import { registerAs } from '@nestjs/config';
import { Event } from '../events/event.entity';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Attendee } from "../events/attendee.entity";

export default registerAs(
  'orm.config',
  (): TypeOrmModuleOptions => ({
    type: 'mysql',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    entities: [Event, Attendee],
    synchronize: true,
  }),
);
