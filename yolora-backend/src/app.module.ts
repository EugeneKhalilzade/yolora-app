import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { HelpModule } from './help/help.module';
import { GatewayModule } from './gateway/gateway.module';
import { User } from './users/entities/user.entity';
import { HelpRequest } from './help/entities/help-request.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT as string, 10) || 5432,
      username: process.env.DB_USERNAME || 'yolora_user',
      password: process.env.DB_PASSWORD || 'yolora_pass',
      database: process.env.DB_NAME || 'yolora',
      entities: [User, HelpRequest],
      synchronize: true, // disable in production
      logging: false,
    }),
    AuthModule,
    UsersModule,
    HelpModule,
    GatewayModule,
  ],
})
export class AppModule {}
