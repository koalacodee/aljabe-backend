import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { InfoService } from '../services/info.service';
import { CreateInfoDto } from '../dto/create-info.dto';
import { UpdateInfoDto } from '../dto/update-info.dto';
import { GetInfoDto } from '../dto/get-info.dto';

@Controller('info')
export class InfoController {
  constructor(private readonly infoService: InfoService) {}

  @Post()
  create(@Body() createInfoDto: CreateInfoDto) {
    return this.infoService.create(createInfoDto);
  }

  @Get()
  findAll(@Query() params: GetInfoDto) {
    return this.infoService.findAll(params);
  }

  @Get(':type')
  findOne(@Param() params: GetInfoDto) {
    return this.infoService.findOneByType(params.type);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateInfoDto: UpdateInfoDto) {
    return this.infoService.update(id, updateInfoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.infoService.remove(id);
  }
}
