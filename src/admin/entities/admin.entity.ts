import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { StoreEntity } from '../../store/entities/store.entity';

@Entity('admin')
export class AdminEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 20 })
  account: string;

  @Column({ length: 50 })
  password: string;

  @Column({ length: 20 })
  name: string;

  @Column({ length: 20 })
  mailbox: string;

  @Column({ length: 20 })
  address: string;

  @Column('int')
  store_id: number;

  @ManyToOne(() => StoreEntity)
  @JoinColumn({ name: 'store_id' })
  store: StoreEntity;

  @Column({ length: 30 })
  avatar: string;
}
