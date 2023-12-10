import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class BaseTimeEntity {
  @Column()
  createId: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ nullable: true })
  updateId: string;

  @UpdateDateColumn({ nullable: true })
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date;
}
