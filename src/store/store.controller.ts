import { Controller, Get, Post, Body, Param, Request } from '@nestjs/common';
import { StoreService } from './store.service';
import { UpdateStoreDto } from './dto/update-store.dto';
import { UserService } from 'src/user/user.service';
import { SchedulingTimerService } from 'src/scheduling_timer/scheduling_timer.service';
import { AdminService } from 'src/admin/admin.service';

@Controller('store')
export class StoreController {
  constructor(
    private readonly storeService: StoreService,
    private readonly userService: UserService,
    private readonly schedulingTimerService: SchedulingTimerService,
    private readonly adminService: AdminService,
  ) {}

  // 查看所有门店
  @Get('all')
  async findAll(@Request() req: Request) {
    const user = req['user'];
    const allStore = await this.storeService.findAll();
    const promises = allStore.map(async (item) => {
      const num = (await this.userService.findAll(item.id)).length;
      const admin = await this.adminService.baseStore_idFind(item.id);
      const timer = await this.schedulingTimerService.find(item.id);
      const workstart = timer[0].timer.split('-')[0];
      const workend = timer[2].timer.split('-')[1];
      const reststart = timer[3].timer.split('-')[0];
      const restend = timer[5].timer.split('-')[1];
      if (user['store_id'] == item.id) {
        item.name = item.name + '(当前门店)';
      }
      return {
        ...item,
        num,
        workday: workstart + '-' + workend,
        restday: reststart + '-' + restend,
        storeManagement: admin.name,
      };
    });
    const allStoreWithNum = await Promise.all(promises);
    return allStoreWithNum;
  }

  // 修改门店信息
  @Post('update/:id')
  async update(
    @Request() req: Request,
    @Param('id') id: string,
    @Body() updateStoreDto: UpdateStoreDto,
  ) {
    const user = req['user'];
    if (user['type'] != '管理员') {
      return {
        code: 400,
        message: '无权限',
      };
    }
    if (user['store_id'] != id) {
      return {
        code: 400,
        message: '不是本门店',
      };
    }
    try {
      const data = await this.storeService.update(+id, updateStoreDto);
      return {
        code: 200,
        message: '修改成功',
        data: data,
      };
    } catch (err) {
      return {
        code: 500,
        message: '未知错误',
        err,
      };
    }
  }
}
