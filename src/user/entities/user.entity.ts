import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { StoreEntity } from '../../store/entities/store.entity';

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

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

  @Column({ length: 20 })
  position: string;

  @Column('int')
  week_timer: number;

  @Column('int')
  month_timer: number;

  @Column({ length: 30 })
  avatar: string;
}
