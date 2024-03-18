import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../users/entities/user.entity';

@Entity()
export class LoginHistory {
  @PrimaryGeneratedColumn('increment')
  @ApiProperty({ description: '로그인 이력 PK', type: 'number' })
  id: number;

  @Column({ comment: '회원 PK', type: 'varchar' })
  @ApiProperty({ description: '회원 PK', type: 'string' })
  userId: string;

  @Column({ comment: '로그인 ip', type: 'varchar' })
  @ApiProperty({ description: '로그인 ip', type: 'string' })
  currentIp: string;

  @CreateDateColumn({ type: 'timestamp' })
  @ApiProperty({ description: '로그인 시간', example: '2021-01-01T00:00:00.000Z' })
  loginAt: Date;

  // 단방향 관계로 설정
  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;
}
