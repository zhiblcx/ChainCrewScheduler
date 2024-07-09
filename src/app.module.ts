import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
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
import { ConfigModule, ConfigService, ConfigType } from '@nestjs/config';
import databaseConfig from './config/database.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
      envFilePath: ['.env.local'],
      load: [databaseConfig],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (_, datatype: ConfigType<typeof databaseConfig>) => {
        return {
          type: 'mysql',
          username: datatype.DATABASE_USER,
          password: datatype.DATABASE_PASSWORD,
          host: datatype.DATABASE_HOST,
          port: parseInt(datatype.DATABASE_PORT),
          database: datatype.DATABASE_NAME,
          entities: [],
          autoLoadEntities: true,
        };
      },
      inject: [ConfigService, databaseConfig.KEY],
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
