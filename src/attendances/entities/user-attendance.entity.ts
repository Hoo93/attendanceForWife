import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Attendance } from './attendance.entity';
import { RoleType } from '../../roles/role-type.enum';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'user_attendance' }) // This should match the join table name in User entity
export class UserAttendance {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_no' })
  userNo: User;

  @ManyToOne(() => Attendance, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'attendance_no' })
  attendanceNo: Attendance;

  @Column({ comment: '회원별 출석부별 권한', type: 'enum', enum: RoleType })
  @ApiProperty({ description: '회원별 출석부별 권한', type: RoleType })
  role: RoleType; // Additional column for the role
}
