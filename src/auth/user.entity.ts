import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Profile } from './profile.entity';
import { Event } from '../events/event.entity';
import { Expose } from 'class-transformer';
import { Attendee } from './../events/attendee.entity';
import { Field, Int, ObjectType } from '@nestjs/graphql';

@Entity()
@ObjectType()
export class User {
  @PrimaryGeneratedColumn('increment')
  @Expose()
  @Field(() => Int)
  id: number;

  @Column()
  @Expose()
  @Field()
  username: string;

  @Column()
  password: string;

  @Column()
  @Expose()
  @Field()
  email: string;

  @Column()
  @Expose()
  @Field()
  firstName: string;

  @Column()
  @Expose()
  @Field()
  lastName: string;

  @OneToOne(() => Profile)
  @JoinColumn()
  @Expose()
  profile: Profile;

  @OneToMany(() => Event, (event) => event.organizer)
  @Expose()
  organized: Event[];

  @OneToMany(() => Attendee, (attendee) => attendee.user)
  attended: Attendee[];
}
