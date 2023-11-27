import { Column, CreateDateColumn, Entity, UpdateDateColumn } from 'typeorm';

@Entity()
export class BaseTimeEntity {
  @Column()
  createId: number;

  @CreateDateColumn()
  createAt: Date;

  @Column()
  updateId: number;

  @UpdateDateColumn()
  updateAt: Date;
}
