import { ConfigModule, ConfigService } from "@nestjs/config";
import { DataSource, DataSourceOptions } from "typeorm";

const Config = new ConfigService();


export const DataSourceConfig: DataSourceOptions = {
    type: 'postgres',
    host: Config.get('POSTGRES_HOST'),
    port: Config.get('POSTGRES_PORT'),
    username: Config.get('POSTGRES_USER'),
    password: Config.get('POSTGRES_PASSWORD'),
    database: Config.get('POSTGRES_DB'),
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    synchronize: Config.get('NODE_ENV') != 'production',
    logging: false,
}

export const connectionDB = new DataSource(DataSourceConfig)