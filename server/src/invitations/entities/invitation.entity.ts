import { BaseTimeEntity } from '../../BaseTimeEntity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { RoleType } from '../../roles/entities/role-type.enum';
import { User } from '../../users/entities/user.entity';
import { InvitationStatusType } from '../invitation-status.enum';

@Entity()
export class Invitation extends BaseTimeEntity {
  @PrimaryGeneratedColumn('increment', { comment: '출석부 초대 PK', type: 'int' })
  @ApiProperty({ description: '출석부 초대 PK', type: 'int' })
  id: number;

  @Column({ comment: '초대 받은 출석부 ID', type: 'varchar' })
  @ApiProperty({ description: '초대 받은 출석부 ID', type: 'string' })
  attendanceId: string;

  @Column({ comment: '권한 타입', type: 'enum', enum: RoleType })
  @ApiProperty({ description: '권한 타입', enum: RoleType })
  role: RoleType;

  @Column({ comment: '초대 상태', type: 'enum', enum: InvitationStatusType })
  @ApiProperty({ description: '초대 상태', enum: InvitationStatusType })
  status: InvitationStatusType;

  // 조회를 위한 단방향 관게 설정
  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'inviterId', referencedColumnName: 'id' })
  @ApiProperty({ type: () => User })
  inviter: User;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'inviteeId', referencedColumnName: 'id' })
  @ApiProperty({ type: () => User })
  invitee: User;
}
