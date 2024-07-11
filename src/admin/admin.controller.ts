import { Controller, Post, Body, Request, Get } from '@nestjs/common';
import { AdminService } from './admin.service';
import { UserService } from 'src/user/user.service';
import * as jwt from 'jsonwebtoken';
import { decrypt } from 'src/utils/encription';
import { Public } from 'src/auth/constants';

@Controller('')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly userService: UserService,
  ) {}

  @Public()
  // 登录
  @Post('admin/login')
  async login(@Body() admin: object) {
    const currentUser = await this.adminService.findOne(admin['account']);
    if (currentUser == null) {
      return {
        code: 400,
        message: '该用户不存在',
      };
    }
    if (currentUser['password'] !== admin['password']) {
      return {
        code: 400,
        message: '密码错误',
      };
    }
    const token = jwt.sign(
      {
        id: currentUser.account,
        type: '管理员',
        store_id: currentUser.store_id,
      },
      'your_secret_key',
      {
        expiresIn: '7d',
      },
    );
    return {
      code: 200,
      message: '登录成功',
      data: { token: token },
    };
  }

  // 注册
  @Post('admin/register')
  async register(@Body() admin: object) {
    return await this.adminService.create(admin);
  }

  // 修改个人信息
  @Post('update/info')
  async updatePersonInfo(@Request() req: Request, @Body() info: object) {
    const user = req['user'];
    if (user['type'] === '管理员') {
      // 修改管理员的资料
      const admin = await this.adminService.findOne(user.id);
      await this.adminService.update(admin.account, info);
    } else {
      const currentUser = await this.userService.findOne(user.id);
      await this.userService.update({
        account: currentUser.id,
        ...info,
      });
    }
    return {
      code: 200,
      message: '修改成功',
    };
  }

  // 修改密码
  @Post('update/password')
  async updatePassword(@Request() req: Request, @Body() psd: object) {
    const user = req['user'];
    let currentData;
    if (user.type != '管理员') {
      // 修改用户密码
      currentData = await this.userService.findOne(user.id);
    } else {
      // 修改管理员密码
      currentData = await this.adminService.findOne(user.id);
    }
    if (decrypt(currentData.password) == psd['oldPassword']) {
      // 如果密码正确，则修改密码
      if (
        decrypt(psd['password']).length < 8 ||
        decrypt(psd['password']).length > 16
      ) {
        return {
          code: 400,
          message: '密码长度应该在8-15',
        };
      } else {
        if (user.type != '管理员') {
          await this.userService.update({
            account: user.id,
            password: psd['password'],
          });
        } else {
          await this.adminService.update(user.id, {
            password: psd['password'],
          });
        }
        return {
          code: 200,
          message: '修改成功',
        };
      }
    } else {
      // 返回密码不正确
      return {
        code: 400,
        message: '密码错误',
      };
    }
  }

  // 查看个人所有信息
  @Get('select/info')
  async selectPerson(@Request() req: Request) {
    const user = req['user'];
    let result;
    if (user['type'] == '管理员') {
      result = await this.adminService.findOne(user.id);
    } else {
      result = await this.userService.findOne(user.id);
    }
    return {
      code: 200,
      message: '查询成功',
      data: {
        ...result,
        position: user['type'],
      },
    };
  }
}
