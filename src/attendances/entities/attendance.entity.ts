import { BaseTimeEntity } from '../../BaseTimeEntity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { AttendanceType } from '../attendance-type.enum';
import { UserAttendance } from './user-attendance.entity';

@Entity()
export class Attendance extends BaseTimeEntity {
  @PrimaryGeneratedColumn('uuid', { comment: '출석부 번호' })
  @ApiProperty({ description: '출석부 번호' })
  id: string;

  @Column({ comment: '출석부 제목', type: 'varchar' })
  @ApiProperty({ description: '출석부 제목', type: 'string' })
  title: string;

  @Column({ comment: '출석부 설명', type: 'varchar', nullable: true })
  @ApiProperty({ description: '출석부 설명', type: 'string' })
  description: string;

  @Column({ comment: '출석부 타입', type: 'enum', enum: AttendanceType })
  @ApiProperty({ description: '출석부 타입', type: AttendanceType })
  type: AttendanceType;

  @OneToMany(
    () => UserAttendance,
    (userAttendance) => userAttendance.attendance,
  )
  userAttendance: UserAttendance[];
}
