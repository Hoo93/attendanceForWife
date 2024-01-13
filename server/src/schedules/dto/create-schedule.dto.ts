import { Column, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { DayType } from '../const/day-type.enum';
import { Attendee } from '../../attendees/entities/attendee.entity';
import { IsEnum, IsNotEmpty, IsString, Matches } from 'class-validator';

export class CreateScheduleDto {
  @IsString()
  @IsNotEmpty()
  attendeeId: string;

  @IsEnum(DayType)
  day: DayType;

  @IsString()
  @Matches(/^\d{4}$/)
  time: string;
}
