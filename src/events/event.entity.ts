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

@Entity()
export class Event {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  when: Date;

  @Column()
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
  attendees: Attendee[];

  @ManyToOne(() => User, (user) => user.organized)
  @JoinColumn({
    name: 'organizerId',
  })
  organizer: User;

  @Column({ nullable: true })
  organizerId: number;

  attendeeCount?: number; // virtual property
  attendeeRejected?: number; // virtual property
  attendeeMaybe?: number; // virtual property
  attendeeAccepted?: number; // virtual property
}
