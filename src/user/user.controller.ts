import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { decrypt } from '../utils/encription';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CreateUserVo } from './vo/create-user.vo';

@ApiTags('用户管理')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiBearerAuth()
  @ApiOperation({
    summary: '添加员工',
  })
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

  @ApiBearerAuth()
  @ApiOperation({
    summary: '所有员工',
  })

  // 得到该门店所有员工
  @ApiBearerAuth()
  @Get('all')
  async findAll(@Request() req: Request) {
    const user = req['user'];
    return {
      code: 200,
      message: '查询成功',
      data: await this.userService.findAll(user['store_id']),
    };
  }

  @ApiOperation({
    summary: '注册',
  })
  // 注册
  @HttpCode(HttpStatus.OK)
  @Post('register')
  async update(@Body() updateUser: CreateUserDto) {
    const user = await this.userService.findOne(
      parseInt(updateUser['account']),
    );
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

  @ApiBearerAuth()
  @ApiOperation({
    summary: '删除员工',
  })
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

  @ApiBearerAuth()
  @ApiOperation({
    summary: '查找员工',
  })
  @ApiOkResponse({
    description: '返回示例',
    type: CreateUserVo,
  })
  // 根据编号查找员工信息
  @Get('userinfo/:id')
  async selectUserInfo(@Param('id') id: number) {
    try {
      const { password, ...result } = await this.userService.findOne(id);
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
