import { Column, DeleteDateColumn, Entity, PrimaryColumn } from 'typeorm';

@Entity('users')
export class UserOrmEntity {
  @PrimaryColumn('varchar', { length: 191 })
  id: string;

  @Column('varchar', { length: 100 })
  name: string;

  @Column('varchar', { length: 100, unique: true })
  registration: string;

  @Column('varchar', { length: 100, unique: true })
  email: string;

  @Column('varchar', { length: 256 })
  password: string;

  @Column('boolean')
  isActive: boolean;

  // Plain column, not @CreateDateColumn: the domain entity always sets
  // createdAt explicitly, and it must pass through untouched on insert.
  @Column('datetime', { default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column('datetime', { nullable: true })
  updatedAt: Date | null;

  @DeleteDateColumn({ type: 'datetime', nullable: true })
  deletedAt: Date | null;
}
