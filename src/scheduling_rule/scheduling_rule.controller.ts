import { Controller, Get, Post, Body, Request } from '@nestjs/common';
import { SchedulingRuleService } from './scheduling_rule.service';
import { UpdateSchedulingRuleDto } from './dto/update-scheduling_rule.dto';
import { SchedulingTimerService } from 'src/scheduling_timer/scheduling_timer.service';
import { SchedulingStatusService } from 'src/scheduling_status/scheduling_status.service';

@Controller('store')
export class SchedulingRuleController {
  constructor(
    private readonly schedulingRuleService: SchedulingRuleService,
    private readonly schedulingTimerService: SchedulingTimerService,
    private readonly schedulingStatusService: SchedulingStatusService,
  ) {}

  @Get('select')
  async findAll(@Request() req: Request) {
    const user = req['user'];
    if (user['type'] === '管理员') {
      return {
        code: 200,
        message: '查询成功',
        data: await this.schedulingRuleService.findOne(user['store_id']),
      };
    } else {
      return {
        code: 400,
        message: '无权限',
      };
    }
  }

  @Post('update')
  async update(
    @Request() req: Request,
    @Body() updateSchedulingRuleDto: UpdateSchedulingRuleDto,
  ) {
    const user = req['user'];
    if (user['type'] === '管理员') {
      try {
        const store = await this.schedulingRuleService.findOne(
          user['store_id'],
        );
        const data = await this.schedulingRuleService.update(
          store.store_id,
          updateSchedulingRuleDto,
        );
        const waiter = data.waiter.split(' ');
        const chef = data.chef.split(' ');
        const timer = await this.schedulingTimerService.find(user['store_id']);
        // 给班次里面最少安排规则里面的人数
        for (let i = 0; i < 3; i++) {
          if (
            timer[i]['waiter'] < Number(waiter[0].split('-')[0]) ||
            timer[i]['waiter'] > Number(waiter[0].split('-')[1])
          ) {
            timer[i]['waiter'] = Number(waiter[0].split('-')[0]);
            await this.schedulingStatusService.deleteNextWeek();
          }
          if (
            timer[i]['chef'] < Number(chef[0].split('-')[0]) ||
            timer[i]['chef'] > Number(chef[0].split('-')[1])
          ) {
            timer[i]['chef'] = Number(chef[0].split('-')[0]);
            await this.schedulingStatusService.deleteNextWeek();
          }
        }
        for (let i = 3; i < 6; i++) {
          if (
            timer[i]['waiter'] < Number(waiter[1].split('-')[0]) ||
            timer[i]['waiter'] > Number(waiter[1].split('-')[1])
          ) {
            timer[i]['waiter'] = Number(waiter[1].split('-')[0]);
            await this.schedulingStatusService.deleteNextWeek();
          }
          if (
            timer[i]['chef'] < Number(chef[1].split('-')[0]) ||
            timer[i]['chef'] > Number(chef[1].split('-')[1])
          ) {
            timer[i]['chef'] = Number(chef[1].split('-')[0]);
            await this.schedulingStatusService.deleteNextWeek();
          }
        }
        for (let i = 0; i < timer.length; i++) {
          this.schedulingTimerService.update(timer[i]);
        }
        return {
          code: 200,
          message: '修改成功',
        };
      } catch (err) {
        return {
          code: 500,
          message: '未知错误',
        };
      }
    } else {
      return {
        code: 400,
        message: '无权限',
      };
    }
  }
}
