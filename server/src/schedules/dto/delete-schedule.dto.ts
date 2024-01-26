import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsArray,
  IsDate,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import { Transform, TransformFnParams } from 'class-transformer';

export class DeleteScheduleDto {
  @IsNotEmpty()
  @IsArray()
  @IsPositive({ each: true })
  @ApiProperty({
    description: 'Schedule ID 배열',
    type: 'Array',
    example: ['1', '2', '3'],
  })
  ids: number[];
}
