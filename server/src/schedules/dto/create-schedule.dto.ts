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
  attendeeId: string;

  @IsEnum(DayType)
  day: DayType;

  @IsString()
  @Matches(/^\d{4}$/)
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
