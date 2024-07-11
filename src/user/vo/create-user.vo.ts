import { ApiProperty } from '@nestjs/swagger';
export class CreateUserVo {
  @ApiProperty({ example: 200 })
  code: number;
  @ApiProperty({
    example: {
      address: '无',
      avatar: '1708448688590.jpg',
      id: 20240347,
      mailbox: '无',
      month_timer: 0,
      name: 'c1',
      position: '厨师',
      store_id: 100,
      week_timer: 0,
    },
  })
  data: object;
  @ApiProperty({ example: '请求成功' })
  message: string;
}
