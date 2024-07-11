import { ApiProperty } from '@nestjs/swagger';
export class CreateUserDto {
  @ApiProperty({
    example: 'admin',
    description: '用户名',
  })
  account: string;
  @ApiProperty({
    example: '123456',
    description: '密码',
  })
  password: string;
}
