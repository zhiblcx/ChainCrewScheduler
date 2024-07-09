import { Injectable } from '@nestjs/common';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { Repository } from 'typeorm';
import { StoreEntity } from './entities/store.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class StoreService {
  constructor(
    @InjectRepository(StoreEntity)
    private readonly storeRepository: Repository<StoreEntity>,
  ) {}

  findAll() {
    return this.storeRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} store`;
  }

  async update(id: number, updateStoreDto: UpdateStoreDto) {
    let store = await this.storeRepository.findOne({ where: { id } });
    store = {
      ...store,
      ...updateStoreDto,
    };
    await this.storeRepository.save(store);
    return store;
  }
}
