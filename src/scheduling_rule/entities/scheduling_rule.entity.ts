import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { StoreEntity } from '../../store/entities/store.entity';

@Entity('scheduling_rule')
export class SchedulingRule {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('int')
  week_more: number;

  @Column('int')
  month_more: number;

  @Column({ length: 20 })
  waiter: string;

  @Column({ length: 20 })
  chef: string;

  @Column('int')
  store_id: number;

  @ManyToOne(() => StoreEntity)
  @JoinColumn({ name: 'store_id' })
  store: StoreEntity;
}
