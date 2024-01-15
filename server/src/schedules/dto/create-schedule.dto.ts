import { Column, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { DayType } from '../const/day-type.enum';
import { Attendee } from '../../attendees/entities/attendee.entity';
import { IsEnum, IsNotEmpty, IsString, Matches } from 'class-validator';
import { Schedule } from '../entities/schedule.entity';
import { share } from 'rxjs';

export class CreateScheduleDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: '출석부 PK',
    type: 'string',
    example: 'uuid-1234-uuid',
  })
  attendanceId: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: '출석 대상 ID',
    type: 'string',
    example: 'uuid-1234-uuid',
  })
  attendeeId: string;

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

  toEntity(createId: string) {
    const schedule = new Schedule();
    schedule.attendeeId = this.attendeeId;
    schedule.day = this.day;
    schedule.time = this.time;
    schedule.createId = createId;
    return schedule;
  }
}
