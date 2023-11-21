import { Body, Controller, Get, Post } from '@nestjs/common';
import { DemoService } from './demo.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateDemoDto, DemoDto } from './types/demo.dto';

@Controller({ path: 'demo', version: '1' })
@ApiTags('Demo')
export class DemoController {
  constructor(private readonly demoService: DemoService) {}

  @Get()
  getHello(): DemoDto[] {
    return this.demoService.getHello();
  }

  @Post()
  createHello(@Body() postData: CreateDemoDto): DemoDto {
    return this.demoService.createHello(postData);
  }
}
