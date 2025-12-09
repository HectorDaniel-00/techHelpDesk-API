import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSourceConfig } from './config/typeOrm.config';
import { envValidationSchema } from './config/validation.schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `${process.env.NODE_ENV}.env`,
      validationSchema: envValidationSchema

    }),
    TypeOrmModule.forRoot({...DataSourceConfig})
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
