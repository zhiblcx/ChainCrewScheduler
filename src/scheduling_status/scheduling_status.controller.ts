import { Controller, Get, Post, Body, Param, Request } from '@nestjs/common';
import { SchedulingStatusService } from './scheduling_status.service';
import { UserService } from 'src/user/user.service';
import { SchedulingTimerService } from 'src/scheduling_timer/scheduling_timer.service';
import { SchedulingRuleService } from 'src/scheduling_rule/scheduling_rule.service';
import * as dayjs from 'dayjs';

@Controller('status')
export class SchedulingStatusController {
  constructor(
    private readonly schedulingStatusService: SchedulingStatusService,
    private readonly userService: UserService,
    private readonly schedulingTimerService: SchedulingTimerService,
    private readonly schedulingRuleService: SchedulingRuleService,
  ) {}

  // 给员工排班
  async assignWork(user, rule, allUsers, allClasses, allDay) {
    for (let i = 0; i < allDay.length; i++) {
      // 按照员工的工作时间排序
      allUsers.sort((a, b) => Number(a.month_timer) - Number(b.month_timer));
      // 当天员工的状态
      const dayStatus = [];
      // 当天服务员的状态
      const day_waiter_status = [];
      // 当天厨师的状态
      const day_chef_status = [];
      // 1：早班，2：中班，3：晚班
      // 所有服务员
      const all_waiter = allUsers.filter((item) => item.position === '服务员');
      // 所有厨师
      const all_chef = allUsers.filter((item) => item.position === '厨师');
      // 自动排班当天的所有员工的状态
      for (let j = 0; j < allClasses.length; j++) {
        // 分配服务员
        for (let k = 0; k < allClasses[j].waiter; k++) {
          let type: string;
          switch (allClasses[j].type) {
            case 1:
              type = '早班';
              break;
            case 2:
              type = '中班';
              break;
            case 3:
              type = '晚班';
              break;
          }
          if (all_waiter.length == day_waiter_status.length) {
            // 所有人均可分配工作
            break;
          }
          const currentStatus = {
            user_id: all_waiter[day_waiter_status.length].id,
            store_id: user['store_id'],
            timer: allDay[i],
            classes: type,
            status: '上班',
            working_hours: allClasses[j].timer,
          };
          if (
            Number(
              all_waiter[day_waiter_status.length].week_timer +
                allClasses[j].timer,
            ) > rule.week_more
          ) {
            break;
          }
          day_waiter_status.push(currentStatus);
          const currentUserIndex = allUsers.findIndex(
            (item) => item.id === currentStatus.user_id,
          );
          if (currentUserIndex !== -1) {
            allUsers[currentUserIndex].month_timer += Number(
              allClasses[j].timer,
            );
            allUsers[currentUserIndex].week_timer += Number(
              allClasses[j].timer,
            );
          }
        }
        // 分配厨师
        for (let k = 0; k < allClasses[j].chef; k++) {
          let type: string;
          switch (allClasses[j].type) {
            case 1:
              type = '早班';
              break;
            case 2:
              type = '中班';
              break;
            case 3:
              type = '晚班';
              break;
          }
          if (all_chef.length == day_chef_status.length) {
            // 所有人均可分配工作
            break;
          }
          const currentStatus = {
            user_id: all_chef[day_chef_status.length].id,
            store_id: user['store_id'],
            timer: allDay[i],
            classes: type,
            status: '上班',
            working_hours: allClasses[j].timer,
          };
          if (
            Number(
              all_chef[day_chef_status.length].week_timer + allClasses[j].timer,
            ) > rule.week_more
          ) {
            break;
          }
          day_chef_status.push(currentStatus);
          const currentUser = allUsers.find(
            (item) => item.id === currentStatus.user_id,
          );
          currentUser.month_timer += Number(currentStatus.timer);
          const currentUserIndex = allUsers.findIndex(
            (item) => item.id === currentStatus.user_id,
          );
          if (currentUserIndex !== -1) {
            allUsers[currentUserIndex].month_timer += Number(
              allClasses[j].timer,
            );
            allUsers[currentUserIndex].week_timer += Number(
              allClasses[j].timer,
            );
          }
        }

        // 如果没有排完，则都是休息(服务员)
        if (day_waiter_status.length < all_waiter.length) {
          while (true) {
            const currentStatus = {
              user_id: all_waiter[day_waiter_status.length].id,
              store_id: user['store_id'],
              timer: allDay[i],
              status: '休息',
            };
            day_waiter_status.push(currentStatus);
            if (day_waiter_status.length == all_waiter.length) {
              break;
            }
          }
        }
        // 如果没有排完，则都是休息(厨师)
        if (day_chef_status.length < all_chef.length) {
          while (true) {
            const currentStatus = {
              user_id: all_chef[day_chef_status.length].id,
              store_id: user['store_id'],
              timer: allDay[i],
              status: '休息',
              working_hours: 0,
            };
            day_chef_status.push(currentStatus);
            if (day_chef_status.length == all_chef.length) {
              break;
            }
          }
        }
        dayStatus.push(...day_chef_status, ...day_waiter_status);
        for (let i = 0; i < dayStatus.length; i++) {
          await this.schedulingStatusService.create(dayStatus[i]);
        }
      }
    }
  }

  // 给新增员工排班
  async assignWorkByNew(
    i,
    rule,
    allUsers,
    daysStaff,
    allClasses,
    allDay,
    newStatus,
    num,
  ) {
    for (let k = 0; k < allDay.length; k++) {
      for (let j = 0; j < allClasses.length; j++) {
        let type;
        switch (allClasses[j].type) {
          case 1:
            type = '早班';
            break;
          case 2:
            type = '中班';
            break;
          case 3:
            type = '晚班';
            break;
        }

        const dayStaff = await Promise.all(
          daysStaff
            .filter((item) =>
              dayjs(allDay[i], 'YYYY/MM/DD').isSame(item.timer, 'day'),
            )
            .map(async (item) => {
              const user = await this.userService.findOne(item.user_id);
              const isValid =
                user.position === allUsers[i].position && item.classes === type;
              return isValid ? item : null;
            }),
        );
        const filteredDayStaff = dayStaff.filter((item) => item !== null);
        const people = filteredDayStaff.length + 1;
        // 如果是服务员
        if (allUsers[i].position === '服务员') {
          if (
            people <= Number(allClasses[j].waiter) &&
            rule.week_more >=
              allUsers[i].week_timer + Number(allClasses[j].timer)
          ) {
            newStatus.push({
              user_id: allUsers[i].id,
              store_id: allUsers[i].store_id,
              timer: allDay[k],
              classes: type,
              status: '上班',
              working_hours: allClasses[j].timer,
            });
            allUsers[i].week_timer += Number(allClasses[j].timer);
            break;
          }
        } else {
          // 如果是厨师
          if (
            people <= Number(allClasses[j].chef) &&
            rule.week_more >=
              allUsers[i].week_timer + Number(allClasses[j].timer)
          ) {
            newStatus.push({
              user_id: allUsers[i].id,
              store_id: allUsers[i].store_id,
              timer: allDay[k],
              classes: type,
              status: '上班',
              working_hours: allClasses[j].timer,
            });
            allUsers[i].week_timer += Number(allClasses[j].timer);
            break;
          }
        }
      }
      if (k + num > newStatus.length) {
        newStatus.push({
          user_id: allUsers[i].id,
          store_id: allUsers[i].store_id,
          timer: allDay[k],
          classes: null,
          status: '休息',
        });
      }
    }
    return newStatus;
  }

  // 获取员工状态
  @Post('week')
  async findAll(@Request() req: Request, @Body() body: string) {
    const user = req['user'];

    const data = await this.schedulingStatusService.findAll(user.store_id);
    let startOfWeek, endOfWeek;
    if (body['week'] === 'this') {
      // 获取本周的开始日期和结束日期
      startOfWeek = dayjs().startOf('week');
      endOfWeek = dayjs().endOf('week');
    } else {
      // 获取下周的开始日期和结束日期
      startOfWeek = dayjs().startOf('week').add(1, 'week');
      endOfWeek = dayjs().endOf('week').add(1, 'week');
    }

    // 查找数据库中的员工状态
    const filterData = data.filter((item) => {
      const itemDate = dayjs(item.timer, 'YYYY/MM/DD');
      return (
        itemDate.isSame(startOfWeek, 'day') ||
        itemDate.isSame(endOfWeek, 'day') ||
        (itemDate.isAfter(startOfWeek, 'day') &&
          itemDate.isBefore(endOfWeek, 'day'))
      );
    });
    // 首先找到本门店的所有员工
    const allUser = await this.userService.findAll(user['store_id']);
    // 如果为空，则代表该周没有安排员工，系统自动安排
    if (filterData.length == 0) {
      // 清空用户本月的时长，以便重新计算
      for (let i = 0; i < allUser.length; i++) {
        allUser[i].week_timer = 0;
      }
      // 找到规则
      const rule = await this.schedulingRuleService.findOne(user['store_id']);
      // 判断早中晚班哪个最长，基于员工月最短的上，不超过最长时间
      const classes_timer = await this.schedulingTimerService.find(
        user['store_id'],
      );
      // 获取周末早中晚班的工作时间，以及服务人数
      // startOfWeek和endOfWeek是周末
      const restday = [
        dayjs(startOfWeek).format('YYYY/MM/DD'),
        dayjs(endOfWeek).format('YYYY/MM/DD'),
      ];
      const rest_class = [
        {
          type: 1,
          timer: classes_timer[3].sum_timer,
          waiter: classes_timer[3].waiter,
          chef: classes_timer[3].chef,
        },
        {
          type: 2,
          timer: classes_timer[4].sum_timer,
          waiter: classes_timer[4].waiter,
          chef: classes_timer[4].chef,
        },
        {
          type: 3,
          timer: classes_timer[5].sum_timer,
          waiter: classes_timer[5].waiter,
          chef: classes_timer[5].chef,
        },
      ];
      // 给班次排序
      rest_class.sort((a, b) => Number(b.timer) - Number(a.timer));
      // 周末排序
      await this.assignWork(user, rule, allUser, rest_class, restday);

      // 工作日的自动排班
      const workday = [];
      // 工作日 周一 - 周五
      for (let i = 1; i < 6; i++) {
        workday.push(dayjs(startOfWeek).add(i, 'day').format('YYYY/MM/DD'));
      }
      // 获取工作日早中晚班的工作时间，以及服务人数
      const all_class = [
        {
          type: 1,
          timer: classes_timer[0].sum_timer,
          waiter: classes_timer[0].waiter,
          chef: classes_timer[0].chef,
        },
        {
          type: 2,
          timer: classes_timer[1].sum_timer,
          waiter: classes_timer[1].waiter,
          chef: classes_timer[1].chef,
        },
        {
          type: 3,
          timer: classes_timer[2].sum_timer,
          waiter: classes_timer[2].waiter,
          chef: classes_timer[2].chef,
        },
      ];
      all_class.sort((a, b) => Number(b.timer) - Number(a.timer));
      // 工作日排班
      await this.assignWork(user, rule, allUser, all_class, workday);
    }

    // 如果有人一次都没排序，说明是新员工，给他添加后来的状态
    for (let i = 0; i < allUser.length; i++) {
      const status = await this.schedulingStatusService.findUser(
        allUser[i].store_id,
        allUser[i].id,
      );
      // 说明这个员工没有工作，是新员工
      if (status.length == 0) {
        // 如果是本周的话
        if (body['week'] == 'this') {
          const timer = dayjs().add(1, 'day');
          const endTimer = dayjs().endOf('week');
          // 如果是周六添加的话，那么意味着这周不会分配工作了，应该退出
          if (timer.isAfter(endTimer, 'day') == true) {
            break;
          }
          // 从明天到这周末给他安排工作
          // 先存储明天到周末的时间
          const remaining_time = [];
          for (let j = 0; ; j++) {
            if (timer.add(j, 'day').isAfter(endTimer, 'day')) {
              break;
            }
            remaining_time.push(timer.add(j, 'day').format('YYYY/MM/DD'));
          }
          // 注意，这里最多只有一天周末
          // 如果只有一天，那么这一天就是周末
          // 判断早中晚班哪个最长，基于员工月最短的上，不超过最长时间
          const classes_timer = await this.schedulingTimerService.find(
            user['store_id'],
          );
          // 获取周末早中晚班的工作时间，以及服务人数
          const restday = [remaining_time[remaining_time.length - 1]];
          const rest_class = [
            {
              type: 1,
              timer: classes_timer[3].sum_timer,
              waiter: classes_timer[3].waiter,
              chef: classes_timer[3].chef,
            },
            {
              type: 2,
              timer: classes_timer[4].sum_timer,
              waiter: classes_timer[4].waiter,
              chef: classes_timer[4].chef,
            },
            {
              type: 3,
              timer: classes_timer[5].sum_timer,
              waiter: classes_timer[5].waiter,
              chef: classes_timer[5].chef,
            },
          ];
          // 给班次排序
          rest_class.sort((a, b) => Number(b.timer) - Number(a.timer));
          // 周末排序
          let newStatus = [];
          // 找到本店工作的所有员工状态
          const daysStaff = await this.schedulingStatusService.findAll(
            user['store_id'],
          );
          const rule = await this.schedulingRuleService.findOne(
            user['store_id'],
          );
          newStatus = await this.assignWorkByNew(
            i,
            rule,
            allUser,
            daysStaff,
            rest_class,
            restday,
            newStatus,
            2,
          );
          if (newStatus.length == 0) {
            // 说明所有班都没上成，休息吧
            newStatus.push({
              user_id: allUser[i].id,
              store_id: allUser[i].store_id,
              timer: restday[0],
              classes: null,
              status: '休息',
            });
          }
          if (remaining_time.length == 1) {
            await this.schedulingStatusService.create(newStatus);
            break;
          } else {
            // 工作日
            // 工作日的自动排班
            const workday = [];
            // 工作日
            for (let k = 0; k < remaining_time.length - 1; k++) {
              workday.push(remaining_time[k]);
            }
            // 获取工作日早中晚班的工作时间，以及服务人数
            const all_class = [
              {
                type: 1,
                timer: classes_timer[0].sum_timer,
                waiter: classes_timer[0].waiter,
                chef: classes_timer[0].chef,
              },
              {
                type: 2,
                timer: classes_timer[1].sum_timer,
                waiter: classes_timer[1].waiter,
                chef: classes_timer[1].chef,
              },
              {
                type: 3,
                timer: classes_timer[2].sum_timer,
                waiter: classes_timer[2].waiter,
                chef: classes_timer[2].chef,
              },
            ];

            all_class.sort((a, b) => Number(b.timer) - Number(a.timer));
            newStatus = await this.assignWorkByNew(
              i,
              rule,
              allUser,
              daysStaff,
              all_class,
              workday,
              newStatus,
              2,
            );
            for (let k = 0; k < newStatus.length; k++) {
              await this.schedulingStatusService.create(newStatus[k]);
            }
          }
        }

        if (true) {
          // 如果是下周
          // 先看看其他员工是否有状态，如果有状态，则重新单独给这个员工安排一下工作
          const timer = dayjs().startOf('week').add(1, 'day');
          const daysStaff = await this.schedulingStatusService.findAll(
            user['store_id'],
          );
          const dayStaff = await Promise.all(
            daysStaff.filter((item) =>
              dayjs(timer, 'YYYY/MM/DD').isSame(item.timer, 'day'),
            ),
          );

          //如果其他员工没有状态直接退出，无需理会
          if (dayStaff.length == 0) {
            break;
          } else {
            const rule = await this.schedulingRuleService.findOne(
              user['store_id'],
            );
            const newstartweek = dayjs().startOf('week').add(1, 'week');
            const newendweek = dayjs().endOf('week').add(1, 'week');
            // 周末
            const restday = [
              dayjs(newstartweek).format('YYYY/MM/DD'),
              dayjs(newendweek).format('YYYY/MM/DD'),
            ];
            const classes_timer = await this.schedulingTimerService.find(
              user['store_id'],
            );
            const rest_class = [
              {
                type: 1,
                timer: classes_timer[3].sum_timer,
                waiter: classes_timer[3].waiter,
                chef: classes_timer[3].chef,
              },
              {
                type: 2,
                timer: classes_timer[4].sum_timer,
                waiter: classes_timer[4].waiter,
                chef: classes_timer[4].chef,
              },
              {
                type: 3,
                timer: classes_timer[5].sum_timer,
                waiter: classes_timer[5].waiter,
                chef: classes_timer[5].chef,
              },
            ];
            // 给班次排序
            rest_class.sort((a, b) => Number(b.timer) - Number(a.timer));
            // 周末排序
            let newStatus = [];
            const daysStaff = await this.schedulingStatusService.findAll(
              user['store_id'],
            );
            newStatus = await this.assignWorkByNew(
              i,
              rule,
              allUser,
              daysStaff,
              rest_class,
              restday,
              newStatus,
              1,
            );
            // 工作日
            // 工作日的自动排班
            const workday = [];
            // 工作日
            for (let k = 1; k < 6; k++) {
              workday.push(
                dayjs(newstartweek).add(k, 'day').format('YYYY/MM/DD'),
              );
            }

            // 获取工作日早中晚班的工作时间，以及服务人数
            const all_class = [
              {
                type: 1,
                timer: classes_timer[0].sum_timer,
                waiter: classes_timer[0].waiter,
                chef: classes_timer[0].chef,
              },
              {
                type: 2,
                timer: classes_timer[1].sum_timer,
                waiter: classes_timer[1].waiter,
                chef: classes_timer[1].chef,
              },
              {
                type: 3,
                timer: classes_timer[2].sum_timer,
                waiter: classes_timer[2].waiter,
                chef: classes_timer[2].chef,
              },
            ];
            all_class.sort((a, b) => Number(b.timer) - Number(a.timer));
            newStatus = await this.assignWorkByNew(
              i,
              rule,
              allUser,
              daysStaff,
              all_class,
              workday,
              newStatus,
              3,
            );
            for (let k = 0; k < newStatus.length; k++) {
              await this.schedulingStatusService.create(newStatus[k]);
            }
          }
        }
      }
    }

    // 清空用户本月的时长，以便重新计算
    for (let i = 0; i < allUser.length; i++) {
      allUser[i].month_timer = 0;
      allUser[i].week_timer = 0;
    }

    // 如果是本周
    if (body['week'] == 'this') {
      // 获取本周的工作时长赋给用户
      for (let i = 0; i < filterData.length; i++) {
        const userindex = allUser.findIndex(
          (item) => item.id == filterData[i].user_id,
        );
        allUser[userindex].week_timer += Number(filterData[i].working_hours);
      }

      // 保存用户本周的工作时间
      for (let i = 0; i < allUser.length; i++) {
        await this.userService.updateWeek(allUser[i].id, allUser[i].week_timer);
      }
    }

    // 获取本月的工作时长赋给用户
    const start_month = dayjs().startOf('month');
    const end_month = dayjs().endOf('month');
    const monthdata = await this.schedulingStatusService.findAll(
      user['store_id'],
    );
    const filtermonthdata = monthdata.filter((item) => {
      const itemDate = dayjs(item.timer, 'YYYY/MM/DD');
      return (
        itemDate.isSame(start_month, 'day') ||
        itemDate.isSame(end_month, 'day') ||
        (itemDate.isAfter(start_month, 'day') &&
          itemDate.isBefore(end_month, 'day'))
      );
    });
    for (let i = 0; i < filtermonthdata.length; i++) {
      const userindex = allUser.findIndex(
        (item) => item.id == filtermonthdata[i].user_id,
      );
      allUser[userindex].month_timer += Number(
        filtermonthdata[i].working_hours,
      );
    }

    // 保存用户本月的工作时间
    for (let i = 0; i < allUser.length; i++) {
      await this.userService.updateMonth(allUser[i].id, allUser[i].month_timer);
    }

    const updatedData = await Promise.all(
      filterData.map(async (item) => {
        const user_detail = await this.userService.findOne(item.user_id);
        return {
          ...item,
          name: user_detail.name,
          position: user_detail.position,
        };
      }),
    );
    return updatedData;
  }

  // 根据员工编号查找员工
  @Get(':id')
  async findOne(@Request() req: Request, @Param('id') id: string) {
    return await this.schedulingStatusService.findUser(req['store_id'], +id);
  }

  // 修改员工状态
  @Post('/update')
  async updateStaff(@Request() req: Request, @Body() info: object) {
    const user = req['user'];
    if (user['type'] != '管理员') {
      return {
        code: 200,
        message: '无权限',
      };
    }
    const status = await this.schedulingStatusService.baseTimerUser(
      info['timer'],
      user['store_id'],
      info['user_id'],
    );
    // 找到规则
    const rule = await this.schedulingRuleService.findOne(user['store_id']);
    // 找到本店的员工
    const daysStaff = await this.schedulingStatusService.findAll(
      user['store_id'],
    );
    // 找到要修改的员工数据
    const staff = await this.userService.findOne(info['user_id']);
    // 如果给员工放假
    // 找到修改前的员工的状态，如果不合格，则返回不符合规则
    if (info['classes'] == null && status.status != '休息') {
      const dayStaff = await Promise.all(
        daysStaff
          .filter((item) =>
            dayjs(info['timer'], 'YYYY/MM/DD').isSame(item.timer, 'day'),
          )
          .map(async (item) => {
            const user = await this.userService.findOne(item.user_id);
            const isValid =
              user.position === staff.position &&
              item.classes === status.classes;
            return isValid ? item : null;
          }),
      );

      const filteredDayStaff = dayStaff.filter((item) => item !== null);

      const people = filteredDayStaff.length - 1;
      // 如果是周末
      if (
        dayjs(status['timer']).day() == 6 ||
        dayjs(status['timer']).day() == 0
      ) {
        // 如果是服务员
        if (staff.position === '服务员') {
          if (people < Number(rule.waiter.split(' ')[1].split('-')[0])) {
            return {
              code: 400,
              message: '不符合规则',
            };
          }
        } else {
          // 如果是厨师
          if (people < Number(rule.chef.split(' ')[1].split('-')[0])) {
            return {
              code: 400,
              message: '不符合规则',
            };
          }
        }
      } else {
        //如果是工作日
        // 如果是服务员
        if (staff.position === '服务员') {
          if (people < Number(rule.waiter.split(' ')[0].split('-')[0])) {
            return {
              code: 400,
              message: '不符合规则',
            };
          }
        } else {
          // 如果是厨师
          if (people < Number(rule.chef.split(' ')[0].split('-')[0])) {
            return {
              code: 400,
              message: '不符合规则',
            };
          }
        }
      }
      status['classes'] = null;
      status['status'] = '休息';
      status['working_hours'] = 0;
    } else {
      // 如果员工最开始为休息的时候，管理员设置上班
      // 检查那个班人数是否上线
      if (status.status == '休息') {
        const dayStaff = await Promise.all(
          daysStaff
            .filter((item) =>
              dayjs(info['timer'], 'YYYY/MM/DD').isSame(item.timer, 'day'),
            )
            .map(async (item) => {
              const user = await this.userService.findOne(item.user_id);
              const isValid =
                user.position == staff.position &&
                item.classes == info['classes'];
              return isValid ? item : null;
            }),
        );
        const filteredDayStaff = dayStaff.filter((item) => item !== null);
        const people = filteredDayStaff.length + 1;

        if (
          dayjs(info['timer']).day() == 6 ||
          dayjs(info['timer']).day() == 0
        ) {
          // 如果是周末
          const classes_timer = await this.schedulingTimerService.find(
            user['store_id'],
          );
          let rest_class = [];

          if (info['classes'] == '早班') {
            rest_class = [
              {
                type: 1,
                timer: classes_timer[3].sum_timer,
                waiter: classes_timer[3].waiter,
                chef: classes_timer[3].chef,
              },
            ];
          } else if (info['classes'] == '中班') {
            rest_class = [
              {
                type: 2,
                timer: classes_timer[4].sum_timer,
                waiter: classes_timer[4].waiter,
                chef: classes_timer[4].chef,
              },
            ];
          } else {
            rest_class = [
              {
                type: 3,
                timer: classes_timer[5].sum_timer,
                waiter: classes_timer[5].waiter,
                chef: classes_timer[5].chef,
              },
            ];
          }
          // 如果是服务员
          if (staff.position === '服务员') {
            // 人数超出
            if (people > Number(rule.waiter.split(' ')[1].split('-')[1])) {
              return {
                code: 400,
                message: '人数超出',
              };
            } else if (
              rest_class[0].timer + staff.week_timer >
              rule.week_more
            ) {
              return {
                code: 400,
                message: '时间超出',
              };
            }
          } else {
            // 如果是厨师
            if (people > Number(rule.chef.split(' ')[1].split('-')[1])) {
              return {
                code: 400,
                message: '人数超出',
              };
            } else if (
              rest_class[0].timer + staff.week_timer >
              rule.week_more
            ) {
              return {
                code: 400,
                message: '时间超出',
              };
            }
          }
          status['working_hours'] = rest_class[0].timer;
        } else {
          // 获取工作日早中晚班的工作时间，以及服务人数
          const classes_timer = await this.schedulingTimerService.find(
            user['store_id'],
          );
          let all_class = [];
          if (info['classes'] == '早班') {
            all_class = [
              {
                type: 1,
                timer: classes_timer[0].sum_timer,
                waiter: classes_timer[0].waiter,
                chef: classes_timer[0].chef,
              },
            ];
          } else if (info['classes'] == '中班') {
            all_class = [
              {
                type: 2,
                timer: classes_timer[1].sum_timer,
                waiter: classes_timer[1].waiter,
                chef: classes_timer[1].chef,
              },
            ];
          } else {
            all_class = [
              {
                type: 3,
                timer: classes_timer[2].sum_timer,
                waiter: classes_timer[2].waiter,
                chef: classes_timer[2].chef,
              },
            ];
          }
          //如果是工作日
          // 如果是服务员
          if (staff.position === '服务员') {
            if (people > Number(rule.waiter.split(' ')[0].split('-')[1])) {
              return {
                code: 400,
                message: '人数超出',
              };
            } else if (all_class[0].timer + staff.week_timer > rule.week_more) {
              return {
                code: 400,
                message: '时间超出',
              };
            }
          } else {
            // 如果是厨师
            if (people > Number(rule.chef.split(' ')[0].split('-')[1])) {
              return {
                code: 400,
                message: '人数超出',
              };
            } else if (all_class[0].timer + staff.week_timer > rule.week_more) {
              return {
                code: 400,
                message: '时间超出',
              };
            }
          }
          status['working_hours'] = all_class[0].timer;
        }
      } else {
        // 这是修改班次的
        // 先找到修改前的员工状态，如果不合格，则返回不符合规则
        // 找到修改后的员工状态，如果不合格，则返回不符合规则
        const dayStaff = await Promise.all(
          daysStaff
            .filter((item) =>
              dayjs(info['timer'], 'YYYY/MM/DD').isSame(item.timer, 'day'),
            )
            .map(async (item) => {
              const user = await this.userService.findOne(item.user_id);
              const isValid =
                user.position === staff.position &&
                item.classes === status.classes;
              return isValid ? item : null;
            }),
        );

        const filteredDayStaff = dayStaff.filter((item) => item !== null);

        const dayStaff1 = await Promise.all(
          daysStaff
            .filter((item) =>
              dayjs(info['timer'], 'YYYY/MM/DD').isSame(item.timer, 'day'),
            )
            .map(async (item) => {
              const user = await this.userService.findOne(item.user_id);
              const isValid =
                user.position === staff.position &&
                item.classes === info['classes'];
              return isValid ? item : null;
            }),
        );

        const filteredDayStaff1 = dayStaff1.filter((item) => item !== null);

        const firstPeople = filteredDayStaff.length - 1;
        const endPeople = filteredDayStaff1.length + 1;

        // 这是之前那个班次
        if (
          dayjs(status['timer']).day() == 6 ||
          dayjs(status['timer']).day() == 0
        ) {
          // 如果是服务员
          if (staff.position === '服务员') {
            if (firstPeople < Number(rule.waiter.split(' ')[1].split('-')[0])) {
              return {
                code: 400,
                message: '人数过低',
              };
            }
          } else {
            // 如果是厨师
            if (firstPeople < Number(rule.chef.split(' ')[1].split('-')[0])) {
              return {
                code: 400,
                message: '人数过低',
              };
            }
          }
        } else {
          //如果是工作日
          // 如果是服务员

          if (staff.position === '服务员') {
            if (firstPeople < Number(rule.waiter.split(' ')[0].split('-')[0])) {
              return {
                code: 400,
                message: '人数过低',
              };
            }
          } else {
            // 如果是厨师
            if (firstPeople < Number(rule.chef.split(' ')[0].split('-')[0])) {
              return {
                code: 400,
                message: '人数过低',
              };
            }
          }
        }
        // 这是要修改的那个班次

        if (
          dayjs(info['timer']).day() == 6 ||
          dayjs(info['timer']).day() == 0
        ) {
          // 如果是周末
          const classes_timer = await this.schedulingTimerService.find(
            user['store_id'],
          );
          let rest_class = [];

          if (info['classes'] == '早班') {
            rest_class = [
              {
                type: 1,
                timer: classes_timer[3].sum_timer,
                waiter: classes_timer[3].waiter,
                chef: classes_timer[3].chef,
              },
            ];
          } else if (info['classes'] == '中班') {
            rest_class = [
              {
                type: 2,
                timer: classes_timer[4].sum_timer,
                waiter: classes_timer[4].waiter,
                chef: classes_timer[4].chef,
              },
            ];
          } else {
            rest_class = [
              {
                type: 3,
                timer: classes_timer[5].sum_timer,
                waiter: classes_timer[5].waiter,
                chef: classes_timer[5].chef,
              },
            ];
          }
          // 如果是服务员
          if (staff.position === '服务员') {
            if (endPeople > Number(rule.waiter.split(' ')[1].split('-')[1])) {
              return {
                code: 400,
                message: '人数超出',
              };
            } else if (
              rest_class[0].timer + staff.week_timer - status.working_hours >
              rule.week_more
            ) {
              return {
                code: 400,
                message: '时间超出',
              };
            }
          } else {
            // 如果是厨师
            if (endPeople > Number(rule.chef.split(' ')[1].split('-')[1])) {
              return {
                code: 400,
                message: '人数超出',
              };
            } else if (
              rest_class[0].wor + staff.week_timer - status.working_hours >
              rule.week_more
            ) {
              return {
                code: 400,
                message: '时间超出',
              };
            }
          }
          status['working_hours'] = rest_class[0].timer;
        } else {
          //如果是工作日
          const classes_timer = await this.schedulingTimerService.find(
            user['store_id'],
          );
          let all_class = [];
          if (info['classes'] == '早班') {
            all_class = [
              {
                type: 1,
                timer: classes_timer[0].sum_timer,
                waiter: classes_timer[0].waiter,
                chef: classes_timer[0].chef,
              },
            ];
          } else if (info['classes'] == '中班') {
            all_class = [
              {
                type: 2,
                timer: classes_timer[1].sum_timer,
                waiter: classes_timer[1].waiter,
                chef: classes_timer[1].chef,
              },
            ];
          } else {
            all_class = [
              {
                type: 3,
                timer: classes_timer[2].sum_timer,
                waiter: classes_timer[2].waiter,
                chef: classes_timer[2].chef,
              },
            ];
          }
          // 如果是服务员
          if (staff.position === '服务员') {
            if (endPeople > Number(rule.waiter.split(' ')[0].split('-')[1])) {
              return {
                code: 400,
                message: '人数超出',
              };
            } else if (
              all_class[0].timer + staff.week_timer - status.working_hours >
              rule.week_more
            ) {
              return {
                code: 400,
                message: '时间超出',
              };
            }
          } else {
            // 如果是厨师
            if (endPeople > Number(rule.chef.split(' ')[0].split('-')[1])) {
              return {
                code: 400,
                message: '人数超出',
              };
            } else if (
              all_class[0].timer + staff.week_timer - status.working_hours >
              rule.week_more
            ) {
              return {
                code: 400,
                message: '时间超出',
              };
            }
          }
          status['working_hours'] = all_class[0].timer;
        }
      }
      status['classes'] = info['classes'];
      status['status'] = '上班';
    }
    return {
      code: 200,
      message: '修改成功',
      data: await this.schedulingStatusService.update(status.id, status),
    };
  }

  // 返回实际工作时间和预计工作时间
  @Get('working/:id')
  async selectWorking(@Request() req: Request, @Param('id') id: number) {
    const user = req['user'];
    const currentDay = dayjs().day();
    // 如果是星期天看的，返回实际工作0
    if (currentDay == 0) {
      return {
        code: 200,
        message: '查询成功',
        data: {
          working_timer: 0,
        },
      };
    }
    const currentDay1 = dayjs().subtract(1, 'day');
    const week = dayjs().startOf('week');
    const working = [week.format('YYYY/MM/DD')];
    const duration = currentDay1.diff(week, 'day');
    for (let i = 0; i < duration; i++) {
      // 找到这周到昨天的时期
      working.push(week.add(i + 1, 'day').format('YYYY/MM/DD'));
    }
    const allStatus = await this.schedulingStatusService.findUser(
      user['store_id'],
      id,
    );

    const filtermonthdata = allStatus.filter((item) => {
      const itemDate = dayjs(item.timer, 'YYYY/MM/DD');
      return (
        itemDate.isSame(working[0], 'day') ||
        itemDate.isSame(working[working.length - 1], 'day') ||
        (itemDate.isAfter(working[0], 'day') &&
          itemDate.isBefore(working[working.length - 1], 'day'))
      );
    });
    let sum = 0;
    for (let i = 0; i < filtermonthdata.length; i++) {
      sum += filtermonthdata[i].working_hours;
    }
    return {
      code: 200,
      message: '查询成功',
      data: {
        working_timer: sum,
      },
    };
  }
}
