import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Attendance } from './attendance.entity';
import { ApiProperty } from '@nestjs/swagger';
import { BaseTimeEntity } from '../../common/BaseTimeEntity';
import { RoleType } from '../../roles/entities/role-type.enum';

@Entity({ name: 'user_attendance' }) // This should match the join table name in User entity
export class UserAttendance extends BaseTimeEntity {
  @PrimaryGeneratedColumn('increment')
  @ApiProperty({ description: '회원 출석부 아이디' })
  userAttendanceId: number;

  @Column({ comment: '회원 번호', type: 'varchar' })
  @ApiProperty({ description: '회원 번호', type: 'string' })
  userId: string;

  @Column({ comment: '출석부 번호', type: 'varchar' })
  @ApiProperty({ description: '출석부 번호', type: 'string' })
  attendanceId: string;

  @Column({ comment: '회원별 출석부별 권한', type: 'varchar' })
  @ApiProperty({ description: '회원별 출석부별 권한', enum: RoleType })
  role: RoleType; // Additional column for the role

  @ManyToOne(() => User, (user) => user.userAttendance)
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  @ApiProperty({ type: () => User })
  user: User;

  @ManyToOne(() => Attendance, (attendance) => attendance.userAttendance)
  @JoinColumn({ name: 'attendanceId', referencedColumnName: 'id' })
  @ApiProperty({ type: () => Attendance })
  attendance: Attendance;
}
