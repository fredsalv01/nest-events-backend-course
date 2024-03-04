import { InjectRepository } from '@nestjs/typeorm';
import { Event } from './event.entity';
import { DeleteResult, Repository } from 'typeorm';
import { Injectable, Logger } from '@nestjs/common';
import { AttendeeAnswerEnum } from './attendee.entity';
import { ListEvents, WhenEventFilter } from './dtos/list.events';
import { PaginateOptions, paginate } from '../pagination/paginator';
import { CreateEventDto } from './dtos/create-event.dto';
import { User } from '../auth/user.entity';
import { UpdateEventDto } from './dtos/update-event.dto';

@Injectable()
export class EventsService {
  private readonly logger = new Logger(EventsService.name);
  constructor(
    @InjectRepository(Event)
    private readonly eventsRepository: Repository<Event>,
  ) {}

  private getEventsBaseQuery() {
    return this.eventsRepository
      .createQueryBuilder('e')
      .orderBy('e.id', 'DESC');
  }

  public async getEventsWithAttendeeCountQuery() {
    return this.getEventsBaseQuery()
      .loadRelationCountAndMap('e.attendeeCount', 'e.attendees')
      .loadRelationCountAndMap(
        'e.attendeeAccepted',
        'e.attendees',
        'attendee',
        (qb) =>
          qb.where('attendee.answer = :answer', {
            answer: AttendeeAnswerEnum.Accepted,
          }),
      )
      .loadRelationCountAndMap(
        'e.attendeeMaybe',
        'e.attendees',
        'attendee',
        (qb) =>
          qb.where('attendee.answer = :answer', {
            answer: AttendeeAnswerEnum.Maybe,
          }),
      )
      .loadRelationCountAndMap(
        'e.attendeeRejected',
        'e.attendees',
        'attendee',
        (qb) =>
          qb.where('attendee.answer = :answer', {
            answer: AttendeeAnswerEnum.Rejected,
          }),
      );
  }

  private async getEventsWithAttendeeCountFiltered(filter?: ListEvents) {
    let query = await this.getEventsWithAttendeeCountQuery();

    if (!filter) {
      return query;
    }

    if (filter.when) {
      if (filter.when == WhenEventFilter.Today) {
        query = query.andWhere(
          `e.when >= CURDATE() AND e.when <= CURDATE() + INTERVAL 1 DAY`,
        );
      }
    }

    if (filter.when == WhenEventFilter.Tommorow) {
      query = query.andWhere(
        `e.when >= CURDATE() + INTERVAL 1 DAY AND e.when <= CURDATE() + INTERVAL 2 DAY`,
      );
    }

    if (filter.when == WhenEventFilter.ThisWeek) {
      query = query.andWhere(`YEARWEEK(e.when, 1) = YEARWEEK(CURDATE(), 1)`);
    }

    if (filter.when == WhenEventFilter.NextWeek) {
      query = query.andWhere(
        `YEARWEEK(e.when, 1) = YEARWEEK(CURDATE(), 1 + 1)`,
      );
    }

    return query;
  }

  public async getEventsWithAttendeeCountFilteredPaginated(
    filter: ListEvents,
    paginateOptions: PaginateOptions,
  ) {
    return await paginate(
      await this.getEventsWithAttendeeCountFiltered(filter),
      paginateOptions,
    );
  }

  public async getEvent(id: number): Promise<Event | undefined> {
    const query = (await this.getEventsWithAttendeeCountQuery()).andWhere(
      'e.id = :id',
      { id },
    );

    this.logger.debug(query.getSql());

    return query.getOne();
  }

  public async createEvent(input: CreateEventDto, user: User): Promise<Event> {
    const event = {
      ...input,
      organizer: user,
      when: new Date(input.when),
    } as Event;

    return this.eventsRepository.save(event);
  }

  public async updateEvent(event: Event, input: UpdateEventDto): Promise<Event> {
    const updatedEvent = {
      ...event,
      ...input,
      when: input.when ? new Date(input.when) : event.when,
    };

    return this.eventsRepository.save(updatedEvent);
  }

  public async deleteEvent(id: number): Promise<DeleteResult> {
    return await this.eventsRepository
      .createQueryBuilder('e')
      .delete()
      .where('id = :id', { id })
      .execute();
  }
}
