import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseTimeEntity } from '../../common/BaseTimeEntity';
import { RoleType } from './role-type.enum';

@Entity()
@Unique(['name'])
export class Role extends BaseTimeEntity {
  @PrimaryGeneratedColumn('increment', { comment: '권한번호' })
  @ApiProperty({ description: '권한번호' })
  id: string;

  @Column({ comment: '권한 이름', type: 'varchar' })
  @ApiProperty({ description: '권한 이름', type: 'string' })
  name: string;

  @Column({ comment: '권한 타입', type: 'enum', enum: RoleType })
  @ApiProperty({ description: '권한 타입', enum: RoleType })
  type: RoleType;
}
