import { Injectable } from '@nestjs/common';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { AdminEntity } from './entities/admin.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(AdminEntity)
    private readonly adminRepository: Repository<AdminEntity>,
  ) {}

  create(admin: object) {
    return this.adminRepository.save(admin);
  }

  findAll() {
    return `This action returns all admin`;
  }

  async findOne(account: string) {
    return await this.adminRepository.findOne({ where: { account } });
  }

  async update(account: string, updateAdminDto: UpdateAdminDto) {
    let data = await this.findOne(account);
    data = {
      ...data,
      ...updateAdminDto,
    };
    return this.adminRepository.save(data);
  }

  remove(id: number) {
    return `This action removes a #${id} admin`;
  }

  baseStore_idFind(store_id: number) {
    return this.adminRepository.findOne({ where: { store_id } });
  }
}
