import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(account: number, pass: string): Promise<any> {
    const user = await this.userService.findOne(account);
    if (user && user.password === pass) {
      return user;
    }
    return null;
  }

  async signIn(user) {
    const payload = { sub: user.id, account: user.id };
    return {
      token: await this.jwtService.signAsync(payload),
    };
  }
}
