import { BaseTimeEntity } from '../../common/BaseTimeEntity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { AttendanceStatus } from '../const/record-type.enum';
import { DayType } from '../../schedules/const/day-type.enum';
import { Attendee } from '../../attendees/entities/attendee.entity';

// 출석 체크 방법
//
@Entity()
@Unique(['attendeeId', 'date'])
export class Record extends BaseTimeEntity {
  @PrimaryGeneratedColumn('increment', { comment: '출석 기록 PK', type: 'int' })
  @ApiProperty({ description: '출석 기록 PK', type: 'int' })
  id: number;

  @Column({ comment: '출석 대상 ID', type: 'varchar' })
  @ApiProperty({ description: '출석 대상 ID', type: 'string' })
  attendeeId: string;

  @Column({ comment: '출석 상태', type: 'varchar' })
  @ApiProperty({
    description: '출석 상태',
    type: 'enum',
    enum: AttendanceStatus,
  })
  status: AttendanceStatus;

  @Column({ comment: '출석 날짜', type: 'varchar' })
  @ApiProperty({ description: '출석 날짜', type: 'string' })
  date: string;

  @Column({ comment: '출석 요일', type: 'enum', enum: DayType })
  @ApiProperty({
    description: '출석 요일',
    type: 'enum',
    enum: DayType,
  })
  day: DayType;

  @Column({ comment: '지각사유', type: 'varchar', nullable: true })
  @ApiProperty({ description: '지각사유', type: 'string', nullable: true })
  lateReason: string;

  @Column({ comment: '비고', type: 'varchar', nullable: true })
  @ApiProperty({ description: '비고', type: 'string', nullable: true })
  etc: string;

  @ManyToOne(() => Attendee, (attendee) => attendee.records)
  @JoinColumn({ name: 'attendeeId', referencedColumnName: 'id' })
  @ApiProperty({ type: () => Attendee })
  attendee: Attendee;
}
