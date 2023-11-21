import { IsNumber, IsOptional, IsString, Matches } from 'class-validator';

export const DemoValidation = {
  isABC: {
    matches: /^abc$/,
  },
};

export class CreateDemoDto {
  @IsString()
  @Matches(DemoValidation.isABC.matches, {
    message: 'Name is not in the correct format',
  })
  name: string;

  @IsNumber()
  @IsOptional()
  age: number;
}

export class DemoDto {
  name: string;
  age?: number;
}
