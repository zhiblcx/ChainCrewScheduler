import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { StoreEntity } from '../../store/entities/store.entity';
import internal from 'stream';

@Entity('scheduling_status')
export class SchedulingStatus {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 20 })
  classes: string;

  @Column('int')
  user_id: number;

  @Column({ length: 20 })
  status: string;

  @Column({ length: 20 })
  timer: string;

  @Column('int')
  store_id: number;

  @Column('int')
  working_hours: number;

  @ManyToOne(() => StoreEntity)
  @JoinColumn({ name: 'store_id' })
  store: StoreEntity;
}
