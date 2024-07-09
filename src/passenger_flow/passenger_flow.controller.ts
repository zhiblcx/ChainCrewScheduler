import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
} from '@nestjs/common';
import { PassengerFlowService } from './passenger_flow.service';
import { CreatePassengerFlowDto } from './dto/create-passenger_flow.dto';
import { UpdatePassengerFlowDto } from './dto/update-passenger_flow.dto';
import * as numeric from 'numeric';
import * as dayjs from 'dayjs';

@Controller('')
export class PassengerFlowController {
  constructor(private readonly passengerFlowService: PassengerFlowService) {}

  @Post()
  create(@Body() createPassengerFlowDto: CreatePassengerFlowDto) {
    return this.passengerFlowService.create(createPassengerFlowDto);
  }

  @Get('passenger-flow')
  async findData(@Request() req: Request) {
    const user = req['user'];
    const data = await this.passengerFlowService.findAll(user['store_id']);
    // 示例客流量时间序列数据
    // 示例客流量时间序列数据
    const timeSeries = [];
    for (let i = 0; i < data.length; i++) {
      timeSeries.push({
        date: data[i].timer,
        value: data[i].people_num,
      });
    }
    const today = dayjs().format('YYYY/MM/DD');
    const todayIndex = timeSeries.findIndex((item) => item.date == today);
    const sevenDate = [];
    if (todayIndex != -1) {
      for (let i = todayIndex; i < timeSeries.length; i++) {
        sevenDate.push(timeSeries[i]);
      }
    }

    // 辅助函数：添加指定天数到日期
    function addDays(date, days) {
      const result = new Date(date);
      result.setDate(result.getDate() + days);
      return dayjs(result.toISOString().slice(0, 10)).format('YYYY/MM/DD');
    }
    // 使用多元线性回归方法预测客流量
    function forecastLinearRegression(data, numPeriods) {
      const dataPoints = data.map((d, index) => [
        index + 1,
        getDayOfWeek(d.date),
        d.value,
      ]);

      // 根据工作日和周末给每个数据点分配权重
      const weightedDataPoints = dataPoints.map((point) => {
        const dayOfWeek = point[1];
        const timer = [0.5, 0.6, 0.7, 0.8, 0.9];
        const index = Math.floor(Math.random() * 5);
        const weight =
          dayOfWeek === 5 || dayOfWeek === 6 ? timer[index] : timer[index]; // 周末权重增加
        return [point[0], point[1], point[2] * weight];
      });

      // 构建矩阵 X 和向量 y
      const X = weightedDataPoints.map((point) => [point[0], point[1]]);
      const y = weightedDataPoints.map((point) => [point[2]]);

      // 计算多元线性回归的参数
      const XTranspose = numeric.transpose(X);
      const XtX = numeric.dot(XTranspose, X);
      const XtXInverse = numeric.inv(XtX);
      const XtY = numeric.dot(XTranspose, y);
      const beta = numeric.dot(XtXInverse, XtY);

      const forecastedValues = [];

      for (let i = 1; i <= numPeriods; i++) {
        const nextDayOfWeek = getDayOfWeek(
          addDays(data[data.length - 1].date, i),
        );
        const forecast =
          beta[0][0] * (data.length + i) + beta[1][0] * nextDayOfWeek;
        forecastedValues.push({
          date: addDays(data[data.length - 1].date, i),
          value: forecast,
        });
      }

      return forecastedValues;
    }

    // 辅助函数：获取日期的星期几（0-6，0表示星期日）
    function getDayOfWeek(date) {
      const dayOfWeek = new Date(date).getDay();
      return dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    }
    if (sevenDate.length > 7) {
      sevenDate.splice(7);
    } else {
      if (sevenDate.length == 0) {
        let forecastedValues;
        let i = 7;
        while (true) {
          // 执行多元线性回归预测
          forecastedValues = forecastLinearRegression(timeSeries, i); // 预测未来 7 天的客流量
          forecastedValues.shift();
          const findex = forecastedValues.findIndex(
            (item) => item.date == dayjs().format('YYYY/MM/DD'),
          );
          if (findex != -1) {
            if (forecastedValues.length - findex >= 7) {
              break;
            }
          }
          i += 7;
        }
        const findex = forecastedValues.findIndex(
          (item) => item.date == dayjs().format('YYYY/MM/DD'),
        );
        console.log(findex);
        for (let j = 0; j < findex + 7; j++) {
          await this.passengerFlowService.create({
            people_num: Number(forecastedValues[j].value),
            timer: forecastedValues[j].date,
            store_id: user['store_id'],
          });
          if (j >= findex) {
            sevenDate.push({
              people_num: Number(forecastedValues[j].value),
              timer: forecastedValues[j].date,
            });
          }
        }
      } else {
        // 执行多元线性回归预测
        const forecastedValues = forecastLinearRegression(
          timeSeries,
          8 - sevenDate.length,
        ); // 预测未来 7 天的客流量
        forecastedValues.shift();
        for (const value of forecastedValues) {
          await this.passengerFlowService.create({
            people_num: Number(value.value),
            timer: value.date,
            store_id: user['store_id'],
          });
          sevenDate.push({
            people_num: Number(value.value),
            timer: value.date,
          });
        }
      }
    }
    return {
      code: 200,
      message: '查询成功',
      data: sevenDate,
    };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.passengerFlowService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePassengerFlowDto: UpdatePassengerFlowDto,
  ) {
    return this.passengerFlowService.update(+id, updatePassengerFlowDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.passengerFlowService.remove(+id);
  }
}
