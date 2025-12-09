import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSourceConfig } from './config/typeOrm.config';
import { envValidationSchema } from './config/validation.schema';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `${process.env.NODE_ENV}.env`,
      validationSchema: envValidationSchema,
    }),
    TypeOrmModule.forRoot({ ...DataSourceConfig }),
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
