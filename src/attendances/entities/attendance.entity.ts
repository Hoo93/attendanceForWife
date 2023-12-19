import { BaseTimeEntity } from '../../BaseTimeEntity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { AttendanceType } from '../attendance-type.enum';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Attendance extends BaseTimeEntity {
  @PrimaryGeneratedColumn('uuid', { comment: '출석부 번호' })
  @ApiProperty({ description: '출석부 번호' })
  no: string;

  @Column({ comment: '출석부 제목', type: 'varchar' })
  @ApiProperty({ description: '출석부 제목', type: 'string' })
  title: string;

  @Column({ comment: '출석부 설명', type: 'varchar', nullable: true })
  @ApiProperty({ description: '출석부 설명', type: 'string' })
  description: string;

  @Column({ comment: '출석부 타입', type: 'enum', enum: AttendanceType })
  @ApiProperty({ description: '출석부 타입', type: AttendanceType })
  type: AttendanceType;

  @ManyToMany(() => User, { cascade: true })
  @JoinTable({ name: 'user_attendance' }) // This should match the join table name in User entity
  users: User[];
}
