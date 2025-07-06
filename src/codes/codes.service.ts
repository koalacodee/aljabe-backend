import { Injectable, Logger, StreamableFile } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { GenerateCodesDto } from './dto/generate-codes.dto';
import * as ExcelJS from 'exceljs';
import * as fs from 'fs';
import * as path from 'path';
import { DownloadCodeDto } from './dto/download-code.dto';
import { randomBytes, randomUUID } from 'crypto';

@Injectable()
export class CodesService {
  private readonly logger = new Logger(CodesService.name);
  private readonly CODE_LENGTH = 10;
  private readonly CODE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  private readonly UPLOADS_DIR = path.join(process.cwd(), 'uploads');

  constructor(private readonly prisma: PrismaService) {
    // Ensure uploads directory exists
    if (!fs.existsSync(this.UPLOADS_DIR)) {
      fs.mkdirSync(this.UPLOADS_DIR, { recursive: true });
    }
  }

  private generateUniqueCode(): string {
    const code = randomBytes(this.CODE_LENGTH / 2)
      .toString('hex')
      .toUpperCase();
    console.log(code);

    return code;
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
