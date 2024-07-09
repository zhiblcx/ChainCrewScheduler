import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('store')
export class StoreEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 20 })
  name: string;

  @Column({ length: 20 })
  address: string;

  @Column('int')
  area: number;

  @Column('int')
  phone: number;
}
