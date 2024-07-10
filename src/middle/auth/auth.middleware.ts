// import { Injectable, NestMiddleware } from '@nestjs/common';
// import { NextFunction, Request, Response } from 'express';
// import * as jwt from 'jsonwebtoken';

// @Injectable()
// export class AuthMiddleware implements NestMiddleware {
//   use(req: Request, res: Response, next: NextFunction) {
//     let token;
//     if (req.headers['authorization'] == null) {
//       token = null;
//     } else {
//       token = req.headers['authorization'].split(' ')[1];
//     }
//     if (token) {
//       jwt.verify(token, 'your_secret_key', (err, decoded) => {
//         if (err) {
//           // 令牌无效或过期
//           return res.status(401).json({ message: '身份过期' });
//         } else {
//           // 令牌验证成功，解析的负载数据存储在decoded中
//           req['user'] = decoded; // 将解析后的负载数据存储在req.user中，方便后续处理
//           next(); // 继续执行下一个处理函数
//         }
//       });
//     } else {
//       // 没有令牌
//       return res.status(401).json({ message: '未登录' });
//     }
//   }
// }
