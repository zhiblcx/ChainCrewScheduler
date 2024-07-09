import { Controller, Get, Body, Post, Request } from '@nestjs/common';
import { SchedulingTimerService } from './scheduling_timer.service';
import { UpdateSchedulingTimerDto } from './dto/update-scheduling_timer.dto';
import { SchedulingRuleService } from 'src/scheduling_rule/scheduling_rule.service';
import { SchedulingStatusService } from 'src/scheduling_status/scheduling_status.service';

@Controller('timer')
export class SchedulingTimerController {
  constructor(
    private readonly schedulingTimerService: SchedulingTimerService,
    private readonly schedulingRuleService: SchedulingRuleService,
    private readonly schedulingStatusService: SchedulingStatusService,
  ) {}

  @Get('select')
  findOne(@Request() req: Request) {
    const user = req['user'];
    if (user['type'] === '管理员') {
      return this.schedulingTimerService.find(user.store_id);
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
    @Body() updateSchedulingTimerDto: UpdateSchedulingTimerDto,
  ) {
    const data = await this.schedulingTimerService.findOne(
      updateSchedulingTimerDto['id'],
    );
    const day = data.classes.split('(')[1].slice(0, -1);
    const user = req['user'];
    const rule = await this.schedulingRuleService.findOne(user.store_id);
    let waiter;
    let chef;
    if (day === '工作日') {
      // 如果是工作日 则按照前面的规则
      waiter = rule.waiter.split(' ')[0].split('-');
      chef = rule.chef.split(' ')[0].split('-');
    } else {
      // 如果是周末，则按照后面的规则
      waiter = rule.waiter.split(' ')[1].split('-');
      chef = rule.chef.split(' ')[1].split('-');
    }
    const currentWaiter = Number(updateSchedulingTimerDto['waiter']);
    const currentChef = Number(updateSchedulingTimerDto['chef']);
    if (currentWaiter >= waiter[0] && currentWaiter <= waiter[1]) {
      if (currentChef >= chef[0] && currentChef <= chef[1]) {
        await this.schedulingTimerService.update(updateSchedulingTimerDto);
        await this.schedulingStatusService.deleteNextWeek();
        return {
          code: 200,
          message: '修改成功',
        };
      }
    }

    return {
      code: 400,
      message: '请设置合适的人数',
    };
  }
}
