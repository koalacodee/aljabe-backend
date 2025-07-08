import { Injectable, Logger, StreamableFile } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { GenerateCodesDto } from './dto/generate-codes.dto';
import * as ExcelJS from 'exceljs';
import * as fs from 'fs';
import * as path from 'path';
import { DownloadCodeDto } from './dto/download-code.dto';
import { randomBytes, randomUUID } from 'crypto';
import { ConfigService } from '@nestjs/config';
import { PaginationDto } from './dto/pagination.dto';

@Injectable()
export class CodesService {
  private readonly logger = new Logger(CodesService.name);
  private readonly CHARACTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  private readonly UPLOADS_DIR = path.join(process.cwd(), 'uploads');

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {
    // Ensure uploads directory exists
    if (!fs.existsSync(this.UPLOADS_DIR)) {
      fs.mkdirSync(this.UPLOADS_DIR, { recursive: true });
    }
  }

  private generateUniqueCode(): string {
    // Generate 7 random numbers

    const digitsCount = this.config.get<number>('DIGITS_COUNT') || 7;
    const middleNumbers = Math.floor(
      10 ** (digitsCount - 1) + Math.random() * 10 ** (digitsCount - 1),
    );
    const prefix =
      this.config.get('CODE_PREFIX') ||
      randomBytes(3).toString('hex').toUpperCase;
    const suffix =
      this.config.get('CODE_SUFFIX') ||
      this.CHARACTERS[
        Math.floor(1 + Math.random() * this.CHARACTERS.length - 1)
      ];

    // Format the code as JBR + 7 numbers + BR
    return `${prefix}${middleNumbers}${suffix}`;
  }

  async getAll(pagination: PaginationDto) {
    const { cursor, limit } = pagination;

    const registrations = await this.prisma.code.findMany({
      take: limit + 1,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor } : undefined,
    });

    const hasNextPage = registrations.length > limit;
    const items = hasNextPage ? registrations.slice(0, -1) : registrations;
    const nextCursor = hasNextPage
      ? registrations[registrations.length - 1].id
      : undefined;

    return {
      items,
      hasNextPage,
      nextCursor,
    };
  }

  private async checkCodeUniqueness(code: string): Promise<boolean> {
    const existingCode = await this.prisma.code.findUnique({
      where: { code },
    });
    return !existingCode;
  }

  private async generateSingleUniqueCode(): Promise<string> {
    let code = this.generateUniqueCode();
    while (!(await this.checkCodeUniqueness(code))) {
      code = this.generateUniqueCode();
    }
    return code;
  }

  private async createExcelFile(codes: string[]): Promise<string> {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Generated Codes');

    worksheet.columns = [{ header: 'Code', key: 'code', width: 15 }];

    codes.forEach((code) => {
      worksheet.addRow({ code });
    });

    const filename = `${randomUUID()}.xlsx`;
    const filePath = path.join(this.UPLOADS_DIR, filename);

    try {
      await workbook.xlsx.writeFile(filePath);
      return filename;
    } catch (error) {
      this.logger.error('Error creating Excel file:', error);
      throw error;
    }
  }

  async exportUsersReport(): Promise<{ download: string }> {
    const users = await this.prisma.registration.findMany({
      select: {
        name: true,
        city: true,
        phone: true,
        codes: {
          select: {
            code: true,
          },
        },
      },
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Users Report');

    // Add headers
    worksheet.columns = [
      { header: 'Name', key: 'name' },
      { header: 'City', key: 'city' },
      { header: 'Phone Number', key: 'phone' },
      { header: 'Codes', key: 'codes' },
    ];

    // Add data rows
    users.forEach((user) => {
      worksheet.addRow({
        ...user,
        codes: user.codes.map(({ code }) => code).join(', '),
      });
    });

    // Auto-fit columns
    worksheet.columns.forEach((column) => {
      column.width = 20;
    });

    // Generate filename and path
    const filename = `${randomUUID()}.xlsx`;
    const filePath = path.join(this.UPLOADS_DIR, filename);

    try {
      // Write the Excel file to disk
      await workbook.xlsx.writeFile(filePath);

      // Return the download URL
      return {
        download: `${this.config.get('HOST')}:${this.config.get('PORT')}/public/${filename}`,
      };
    } catch (error) {
      this.logger.error('Error creating Excel file:', error);
      throw error;
    }
  }

  async generateCodes(dto: GenerateCodesDto) {
    const codes: string[] = [];

    for (let i = 0; i < dto.count; i++) {
      const code = await this.generateSingleUniqueCode();
      codes.push(code);
      await this.prisma.code.create({
        data: { code },
      });
    }

    if (dto.exportToExcel) {
      const excelFilename = await this.createExcelFile(codes);
      return {
        codes,
        excelFile: excelFilename,
      };
    }

    return { codes };
  }

  async exportAllCodes(): Promise<{ download: string }> {
    const codes = await this.prisma.code.findMany({
      select: {
        code: true,
      },
    });

    const codeValues = codes.map((code) => code.code);
    const download = `${this.config.get('HOST')}:${this.config.get('PORT')}/public/${await this.createExcelFile(codeValues)}`;

    return { download };
  }

  async downloadExcelFile(params: DownloadCodeDto): Promise<StreamableFile> {
    const filePath = path.join(this.UPLOADS_DIR, params.filename);

    // Check existence
    if (!fs.existsSync(filePath)) {
      throw new Error('File not found');
    }

    // Create a read stream
    const fileStream = fs.createReadStream(filePath);

    // Return as StreamableFile with proper headers
    return new StreamableFile(fileStream, {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      disposition: `attachment; filename="${params.filename}"`,
    });
  }
}
