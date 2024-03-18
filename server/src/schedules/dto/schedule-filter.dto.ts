import { Column, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { DayType } from '../const/day-type.enum';
import { Attendee } from '../../attendees/entities/attendee.entity';
import { IsEnum, IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';
import { Schedule } from '../entities/schedule.entity';
import { share } from 'rxjs';
import { IsTimeFormat } from '../../common/decorator/isTimeformat.decorator';
import { Optional } from '@nestjs/common';

export class ScheduleFilterDto {
  @IsEnum(DayType, { each: true })
  @IsOptional()
  @ApiPropertyOptional({
    description: '출석부 요일 배열',
    type: 'Array',
    nullable: true,
    example: [DayType.MONDAY, DayType.TUESDAY],
  })
  days?: DayType[];

  @IsTimeFormat()
  @IsOptional()
  @ApiPropertyOptional({
    description: '검색 시작기준 시간 (format:hhmm)',
    type: 'string',
    nullable: true,
    example: '1200',
  })
  timeFrom?: string;

  @IsTimeFormat()
  @IsOptional()
  @ApiPropertyOptional({
    description: '검색 종료기준 시간 (format:hhmm)',
    type: 'string',
    nullable: true,
    example: '1815',
  })
  timeTo?: string;
}
