import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction } from 'express';
import { encrypt } from '../../utils/encription';

@Injectable()
export class HashPasswordMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    let userPassword = req.body['password'];
    if (userPassword) {
      userPassword = encrypt(userPassword);
      req.body['password'] = userPassword;
    }
    next();
  }
}
