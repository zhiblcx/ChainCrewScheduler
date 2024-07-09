import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  create(createUserDto: CreateUserDto) {
    const user = this.userRepository.save(createUserDto);
    return user;
  }

  findAll(id: number) {
    return this.userRepository.find({ where: { store_id: id } });
  }

  async findOne(account: number) {
    return await this.userRepository.findOne({ where: { id: account } });
  }

  async update(updateUserDto: object) {
    let user = await this.userRepository.findOne({
      where: { id: updateUserDto['account'] },
    });
    user['password'] = updateUserDto['password'];
    user = {
      ...user,
      ...updateUserDto,
    };
    return await this.userRepository.save(user);
  }

  remove(id: number) {
    return this.userRepository.delete(id);
  }

  async updateMonth(id: number, timer: number) {
    const user = await this.findOne(id);
    user.month_timer = timer;
    return this.userRepository.save(user);
  }

  async updateWeek(id: number, timer: number) {
    const user = await this.findOne(id);
    user.week_timer = timer;
    return this.userRepository.save(user);
  }
}
