import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { StoreEntity } from '../../store/entities/store.entity';
@Entity('scheduling_timer')
export class SchedulingTimer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 20 })
  classes: string;

  @Column({ length: 20 })
  timer: string;

  @Column({ length: 20 })
  sum_timer: string;

  @Column('int')
  waiter: number;

  @Column('int')
  chef: number;

  @Column('int')
  store_id: number;

  @ManyToOne(() => StoreEntity)
  @JoinColumn({ name: 'store_id' })
  store: StoreEntity;
}
