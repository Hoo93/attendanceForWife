import { IsEnum, IsString, Matches } from 'class-validator';
import { DayType } from './day-type.enum';
import { ApiProperty } from '@nestjs/swagger';

export class SingleSchedule {
  @IsEnum(DayType)
  @ApiProperty({ description: '출석 요일', type: 'enum', enum: DayType })
  day: DayType;

  @IsString()
  @Matches(/^\d{4}$/)
  @ApiProperty({
    description: '출석 시간',
    type: 'string',
    example: '0930',
  })
  time: string;
}
