import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Attendee } from './attendee.entity';

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

  attendeeCount?: number; // virtual property
  attendeeRejected?: number; // virtual property
  attendeeMaybe?: number; // virtual property
  attendeeAccepted?: number; // virtual property
}
