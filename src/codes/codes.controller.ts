import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Get,
  Param,
  Query,
} from '@nestjs/common';
import { CodesService } from './codes.service';
import { GenerateCodesDto } from './dto/generate-codes.dto';
import { DownloadCodeDto } from './dto/download-code.dto';
import { PaginationDto } from './dto/pagination.dto';

@Controller('codes')
export class CodesController {
  constructor(private readonly codesService: CodesService) {}

  @Get()
  async getAll(@Query() query: PaginationDto) {
    return this.codesService.getAll(query);
  }

  @Post('generate')
  @HttpCode(HttpStatus.OK)
  async generateCodes(@Body() dto: GenerateCodesDto) {
    return this.codesService.generateCodes(dto);
  }

  @Get('download/:filename')
  async downloadExcelFile(@Param() params: DownloadCodeDto) {
    return this.codesService.downloadExcelFile(params);
  }

  @Post('export-all')
  async exportAllCodes() {
    return this.codesService.exportAllCodes();
  }

  @Get('users-report')
  async exportUsersReport() {
    return this.codesService.exportUsersReport();
  }
}
