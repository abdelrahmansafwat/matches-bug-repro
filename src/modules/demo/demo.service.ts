import { Injectable } from '@nestjs/common';
import { CreateDemoDto, DemoDto } from './types/demo.dto';

@Injectable()
export class DemoService {
  demos: DemoDto[] = [];

  getHello(): DemoDto[] {
    return this.demos;
  }

  createHello(postData: CreateDemoDto): DemoDto {
    this.demos.push(postData);

    return postData;
  }
}
