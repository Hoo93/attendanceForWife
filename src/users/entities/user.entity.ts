import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { BaseTimeEntity } from '../BaseTimeEntity';
import * as bcrypt from 'bcrypt';
import { SALT } from '../../auth/const/auth.const';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

@Entity()
@Unique(['id'])
export class User extends BaseTimeEntity {
  @PrimaryGeneratedColumn('uuid', { comment: '회원번호' })
  @ApiProperty({ description: '회원번호' })
  no: string;

  @Column({ comment: '회원 아이디', type: 'varchar' })
  @ApiProperty({ description: '회원 아이디', type: 'varchar' })
  id: string;

  @Column({ comment: '회원 비밀번호', type: 'varchar' })
  @ApiProperty({ description: '회원 비밀번호', type: 'varchar' })
  password: string;

  @Column({ comment: '회원 이름', type: 'varchar' })
  @ApiProperty({ description: '회원 이름', type: 'varchar' })
  name: string;

  @Column({ comment: '회원 전화번호', type: 'varchar' })
  @ApiProperty({ description: '회원 전화번호', type: 'varchar' })
  mobileNumber: string;

  @Column({ nullable: true, comment: '회원 생년월일', type: 'varchar' })
  @ApiPropertyOptional({ description: '회원 생년월일', type: 'varchar' })
  birthday?: string;

  @Column({ nullable: true, comment: '회원 이메일', type: 'varchar' })
  @ApiPropertyOptional({ description: '회원 이메일', type: 'varchar' })
  email?: string;

  async hashPassword() {
    this.password = await bcrypt.hash(this.password, SALT);
  }
}
