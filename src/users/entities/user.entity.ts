import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseTimeEntity } from '../BaseTimeEntity';

@Entity()
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
  phoneNumber: string;

  @Column()
  age?: number;

  @Column()
  email?: string;
}
