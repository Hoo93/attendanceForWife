import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { BaseTimeEntity } from '../BaseTimeEntity';
import * as bcrypt from 'bcrypt';

@Entity()
@Unique(['id'])
export class User extends BaseTimeEntity {
  @PrimaryGeneratedColumn('uuid')
  no: string;

  @Column()
  id: string;

  @Column()
  password: string;

  @Column()
  name: string;

  @Column()
  mobileNumber: string;

  @Column({ nullable: true })
  age?: number;

  @Column({ nullable: true })
  email?: string;

  async hashPassword() {}
}
