import { BaseTimeEntity } from '../../BaseTimeEntity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Attendance } from '../../attendances/entities/attendance.entity';
import { Schedule } from '../../schedules/entities/schedule.entity';
import { Record } from '../../records/entities/record.entity';

@Entity()
export class Attendee extends BaseTimeEntity {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({ description: '출석체크 대상 번호' })
  id: string;

  @Column({ comment: '소속 출석부 ID', type: 'varchar' })
  @ApiProperty({ description: '소속 출석부 ID', type: 'string' })
  attendanceId: string;

  @Column({ comment: '출석 대상자 이름', type: 'varchar' })
  @ApiProperty({ description: '출석 대상자 이름', type: 'string' })
  name: string;

  @Column({ comment: '출석 대상자 나이', type: 'int', nullable: true })
  @ApiProperty({ description: '출석 대상자 나이', type: 'int' })
  age: number;

  @Column({ comment: '출석 대상자 설명', type: 'varchar', nullable: true })
  @ApiProperty({ description: '출석 대상자 설명', type: 'string' })
  description: string;

  @ManyToOne(() => Attendance, (attendance) => attendance.attendees)
  @JoinColumn({ name: 'attendanceId', referencedColumnName: 'id' })
  @ApiProperty({ type: () => Attendance })
  attendance: Attendance;

  @OneToMany(() => Schedule, (schedule) => schedule.attendee)
  @ApiProperty({ type: () => Schedule })
  schedules: Schedule[];

  @OneToMany(() => Record, (record) => record.attendee)
  @ApiProperty({ type: () => Record })
  records: Record[];
}
