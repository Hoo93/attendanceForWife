import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ormConfig, ormConfigDevelopment } from './orm.config';
import { User } from './users/entities/user.entity';
import { RolesModule } from './roles/roles.module';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    TypeOrmModule.forRoot({ ...ormConfigDevelopment, entities: [User] }),
    RolesModule,
  ],
})
export class AppModule {}
