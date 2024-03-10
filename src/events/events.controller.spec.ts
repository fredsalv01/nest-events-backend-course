import { Repository } from 'typeorm';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { Event } from './event.entity';
import { ListEvents } from './dtos/list.events';
import { User } from './../auth/user.entity';
import { NotFoundException } from '@nestjs/common';

describe('EventsController', () => {
  let eventsService: EventsService;
  let eventsController: EventsController;
  let eventsRepository: Repository<Event>;

  // beforeAll(() => console.log('EventsController and Event Service'));
  beforeEach(() => {
    eventsService = new EventsService(eventsRepository);
    eventsController = new EventsController(eventsService);
  });
  it('Should return a list of events', async () => {
    const result = {
      first: 0,
      last: 0,
      limit: 0,
      total: null,
      totalPages: null,
      currentPage: 1,
      data: [],
    };

    // eventsService.getEventsWithAttendeeCountFilteredPaginated = jest
    //   .fn()
    //   .mockImplementation((): any => result);

    const spy = jest
      .spyOn(eventsService, 'getEventsWithAttendeeCountFilteredPaginated')
      .mockImplementation((): any => result);

    const output = await eventsController.findAll(new ListEvents());
    console.log('output', output);

    expect(output).toEqual(result);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  
});
