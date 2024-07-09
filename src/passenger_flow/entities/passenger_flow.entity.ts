import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { StoreEntity } from '../../store/entities/store.entity';
@Entity('passenger_flow')
export class PassengerFlow {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 20 })
  timer: string;

  @Column('int')
  people_num: number;

  @Column('int')
  store_id: number;

  @ManyToOne(() => StoreEntity)
  @JoinColumn({ name: 'store_id' })
  store: StoreEntity;
}
