import { registerAs } from '@nestjs/config';
import { Event } from '../events/event.entity';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Attendee } from '../events/attendee.entity';
import { User } from '../auth/user.entity';
import { Profile } from '../auth/profile.entity';
import { Teacher } from '../school/teacher.entity';
import { Subject } from '../school/subject.entity';
import { Course } from '../school/course.entity';

export default registerAs(
  'orm.config',
  (): TypeOrmModuleOptions => ({
    type: 'mysql',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    entities: [Event, Attendee, User, Profile, Teacher, Subject, Course],
    synchronize: true,
    dropSchema: Boolean(parseInt(process.env.DB_DROP_SCHEMA)),
  }),
);
