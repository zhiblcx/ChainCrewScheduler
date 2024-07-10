import { Controller, Get, Post, Body, Param, Request } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { decrypt } from '../utils/encription';
// import * as jwt from 'jsonwebtoken';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // 添加员工
  @Post('add')
  async create(@Request() req: Request, @Body() createUserDto: CreateUserDto) {
    try {
      const user = req['user'];
      createUserDto['store_id'] = user['store_id'];
      return {
        code: 200,
        message: '添加成功',
        data: await this.userService.create(createUserDto),
      };
    } catch (err) {
      return {
        code: 500,
        message: '未知错误',
      };
    }
  }

  // 得到该门店所有员工
  @Get('all')
  async findAll(@Request() req: Request) {
    const user = req['user'];
    return {
      code: 200,
      message: '查询成功',
      data: await this.userService.findAll(user['store_id']),
    };
  }

  // 注册
  @Post('register')
  async update(@Body() updateUser: object) {
    const user = await this.userService.findOne(updateUser['account']);
    if (user == null) {
      return {
        code: 400,
        message: '没有该用户',
      };
    }
    if (user['password'] != null) {
      return {
        code: 400,
        message: '已经注册',
      };
    }
    if (
      decrypt(updateUser['password']).length < 8 ||
      decrypt(updateUser['password']).length > 16
    ) {
      return {
        code: 400,
        message: '密码长度应该在8-15',
      };
    }
    await this.userService.update(updateUser);
    return {
      code: 200,
      message: '注册成功',
    };
  }

  // 辞退
  @Post('delete/:id')
  async remove(@Param('id') id: string) {
    try {
      await this.userService.remove(+id);
      return {
        code: 200,
        message: '辞退成功',
      };
    } catch (err) {
      return {
        code: 500,
        message: '未知错误',
      };
    }
  }

  // 登录
  // @Post('login')
  // async login(@Body() user: object) {
  //   const currentUser = await this.userService.findOne(user['account']);

  //   if (currentUser == null) {
  //     return {
  //       code: 400,
  //       message: '该用户不存在',
  //     };
  //   }
  //   if (currentUser['password'] !== user['password']) {
  //     return {
  //       code: 400,
  //       message: '密码错误',
  //     };
  //   }
  //   const token = jwt.sign(
  //     {
  //       id: currentUser.id,
  //       type: currentUser['position'],
  //       store_id: currentUser.store_id,
  //     },
  //     'your_secret_key',
  //     {
  //       expiresIn: '7d',
  //     },
  //   );
  //   return {
  //     code: 200,
  //     message: '登录成功',
  //     data: { token: token },
  //   };
  // }

  // 根据编号查找员工信息
  @Get('userinfo/:id')
  async selectUserInfo(@Param('id') id: number) {
    try {
      const result = await this.userService.findOne(id);
      return {
        code: 200,
        message: '查找成功',
        data: result,
      };
    } catch (err) {
      return {
        code: 500,
        message: '未知错误',
      };
    }
  }
}
