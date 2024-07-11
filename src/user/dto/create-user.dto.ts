import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, NotContains, Length } from 'class-validator';
export class CreateUserDto {
  @ApiProperty({ description: '用户名' })
  @IsNotEmpty({ message: '用户名不能为空' })
  @NotContains(' ', { message: '用户名不能包含空格' })
  @Length(4, 16, { message: '用户名长度为 4 ~ 16 位' })
  account: string;
  @ApiProperty({ description: '密码' })
  password: string;
}
