import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseTimeEntity } from '../../BaseTimeEntity';
import { ApiProperty } from '@nestjs/swagger';
import { Attendee } from '../../attendees/entities/attendee.entity';
import { DayType } from '../const/day-type.enum';
import { Unique } from 'typeorm/browser';

@Entity()
@Unique(['attendeeId', 'day', 'time'])
export class Schedule extends BaseTimeEntity {
  @PrimaryGeneratedColumn('increment')
  @ApiProperty({ description: '출석대상의 출석 스케쥴' })
  id: number;

  @Column({ comment: '출석 대상 ID', type: 'varchar' })
  @ApiProperty({ description: '출석 대상 ID', type: 'string' })
  attendeeId: string;

  @Column({ comment: '출석 요일', type: 'enum', enum: DayType })
  @ApiProperty({ description: '출석 요일', type: 'enum', enum: DayType })
  day: DayType;

  @Column({ comment: '출석 시간', type: 'varchar' })
  @ApiProperty({ description: '출석 시간', type: 'string' })
  time: string;

  @ManyToOne(() => Attendee, (attendee) => attendee.schedules)
  @JoinColumn({ name: 'attendeeId', referencedColumnName: 'id' })
  @ApiProperty({ type: () => Attendee })
  attendee: Attendee;
}
