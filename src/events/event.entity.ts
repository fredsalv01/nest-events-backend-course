import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Attendee } from './attendee.entity';
import { User } from '../auth/user.entity';
import { Expose } from 'class-transformer';
import { PaginationResult } from 'src/pagination/paginator';

@Entity()
export class Event {
  @PrimaryGeneratedColumn('increment')
  @Expose()
  id: number;

  @Column()
  @Expose()
  name: string;

  @Column()
  @Expose()
  description: string;

  @Column()
  @Expose()
  when: Date;

  @Column()
  @Expose()
  address: string;

  @OneToMany(
    () => Attendee,
    (attendee) => attendee.event,
    {
      cascade: true,
    },
    // {
    //   eager: true
    // }
  )
  @Expose()
  attendees: Attendee[];

  @ManyToOne(() => User, (user) => user.organized)
  @JoinColumn({
    name: 'organizerId',
  })
  @Expose()
  organizer: User;

  @Column({ nullable: true })
  organizerId: number;

  @Expose()
  attendeeCount?: number; // virtual property
  @Expose()
  attendeeRejected?: number; // virtual property
  @Expose()
  attendeeMaybe?: number; // virtual property
  @Expose()
  attendeeAccepted?: number; // virtual property
}

export type PaginatedEvents = PaginationResult<Event>;
