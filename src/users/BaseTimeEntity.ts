import { Column, CreateDateColumn, Entity, UpdateDateColumn } from 'typeorm';
import { IsOptional } from 'class-validator';

@Entity()
export class BaseTimeEntity {
  @Column()
  createId: string;

  @CreateDateColumn()
  createAt: Date;

  @Column()
  updateId?: string;

  @UpdateDateColumn()
  updateAt: Date;
}
