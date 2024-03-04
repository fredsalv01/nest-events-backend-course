import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Logger,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateEventDto } from './dtos/create-event.dto';
import { UpdateEventDto } from './dtos/update-event.dto';
import { Event } from './event.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Length } from 'class-validator';
import { Attendee } from './attendee.entity';
import { EventsService } from './events.service';
import { ListEvents } from './dtos/list.events';

@Controller({
  path: '/events',
})
export class EventsController {
  private readonly logger = new Logger(EventsController.name);

  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    @InjectRepository(Attendee)
    private readonly attendeeRepository: Repository<Attendee>,
    private readonly eventsService: EventsService,
  ) {}

  @Get()
  async findAll(@Query() filter: ListEvents) {
    this.logger.debug(filter);
    this.logger.log(`Hit the findAll route`);
    const events =
      await this.eventsService.getEventsWithAttendeeCountFiltered(filter);
    this.logger.debug(`Found ${events.length} events`);
    return events;
  }

  @Get('practice2')
  async practice2() {
    // return await this.eventRepository.findOne({
    //   where: {
    //     id: 1,
    //   },
    //   // loadEagerRelations: false
    //   relations: ['attendees'],
    // });

    // const event = await this.eventRepository.findOne({
    //   where: {
    //     id: 1,
    //   },
    // });

    // const attendee = new Attendee();
    // attendee.name = 'jerry';
    // attendee.event = event;
    // await this.attendeeRepository.save(attendee);
    // return event;

    return this.eventRepository
      .createQueryBuilder('e')
      .select(['e.id', 'e.name'])
      .orderBy('e.id', 'ASC')
      .take(3)
      .getMany();
  }

  @Get(':id')
  async findOne(@Param('id', new ParseIntPipe()) id: number) {
    const event = await this.eventsService.getEvent(id);
    if (!event) {
      throw new NotFoundException('No se encontro el evento');
    }

    return event;
  }

  @Post()
  create(@Body() input: CreateEventDto) {
    const event = {
      ...input,
      when: new Date(input.when),
    } as Event;

    return this.eventRepository.save(event);
  }

  @Patch(':id')
  @HttpCode(200)
  async update(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() input: UpdateEventDto,
  ) {
    const event = await this.eventRepository.findOne({
      where: {
        id: id,
      },
    });

    const updatedEvent = {
      ...event,
      ...input,
      when: input.when ? new Date(input.when) : event.when,
    };

    return this.eventRepository.save(updatedEvent);
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id', new ParseIntPipe()) id: number) {
    const event = await this.eventRepository.findOne({
      where: {
        id: id,
      },
    });
    await this.eventRepository.remove(event);
  }
}
