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

export class DeleteRecordDto {
  @IsNotEmpty()
  @IsArray()
  @IsPositive({ each: true })
  @ApiProperty({
    description: '출석기록 ID 배열',
    type: 'Array',
    example: [1, 2, 3],
  })
  ids: number[];

  @IsString()
  @ApiProperty({
    description: '출석부 ID',
    type: 'string',
    example: 'attendanceId',
  })
  attendanceId: string;
}
