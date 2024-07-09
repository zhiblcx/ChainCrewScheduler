import { MiddlewareConsumer, Module, Req, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminModule } from './admin/admin.module';
import { SchedulingRuleModule } from './scheduling_rule/scheduling_rule.module';
import { SchedulingStatusModule } from './scheduling_status/scheduling_status.module';
import { SchedulingTimerModule } from './scheduling_timer/scheduling_timer.module';
import { StoreModule } from './store/store.module';
import { UserModule } from './user/user.module';
import { AuthMiddleware } from './middle/auth/auth.middleware';
import { UploadModule } from './upload/upload.module';
import { PassengerFlowModule } from './passenger_flow/passenger_flow.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '123456',
      database: 'chaincrew_scheduler',
      entities: [],
      autoLoadEntities: true,
    }),
    UserModule,
    StoreModule,
    AdminModule,
    SchedulingStatusModule,
    SchedulingRuleModule,
    SchedulingTimerModule,
    UploadModule,
    PassengerFlowModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude(
        { path: 'admin/login', method: RequestMethod.ALL },
        { path: 'upload', method: RequestMethod.ALL },
        { path: 'admin/register', method: RequestMethod.ALL },
        { path: 'user/login', method: RequestMethod.ALL },
        { path: 'user/userinfo/:id', method: RequestMethod.ALL },
        { path: 'user/register', method: RequestMethod.ALL },
      )
      .forRoutes('/');
  }
}
