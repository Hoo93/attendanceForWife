import { Column, CreateDateColumn, Entity, UpdateDateColumn } from 'typeorm';

@Entity()
export class BaseTimeEntity {
  @Column()
  createId: string;

  @CreateDateColumn()
  createAt: Date;

  @Column({ nullable: true })
  updateId: string;

  @UpdateDateColumn({ nullable: true })
  updateAt: Date;
}
