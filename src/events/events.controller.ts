import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  Logger,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
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
import { CurrentUser } from '../auth/current-user.decorator';
import { User } from '../auth/user.entity';
import { AuthGuardJwt } from '../auth/auth-guard-jwt';

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
  @UsePipes(new ValidationPipe({ transform: true }))
  async findAll(@Query() filter: ListEvents) {
    this.logger.debug(filter);
    this.logger.log(`Hit the findAll route`);
    const events =
      await this.eventsService.getEventsWithAttendeeCountFilteredPaginated(
        filter,
        {
          total: true,
          currentPage: Number(filter.page),
          limit: Number(filter.limit),
        },
      );
    return events;
  }

  // @Get('practice2')
  // async practice2() {
  //   // return await this.eventRepository.findOne({
  //   //   where: {
  //   //     id: 1,
  //   //   },
  //   //   // loadEagerRelations: false
  //   //   relations: ['attendees'],
  //   // });

  //   // const event = await this.eventRepository.findOne({
  //   //   where: {
  //   //     id: 1,
  //   //   },
  //   // });

  //   // const attendee = new Attendee();
  //   // attendee.name = 'jerry';
  //   // attendee.event = event;
  //   // await this.attendeeRepository.save(attendee);
  //   // return event;

  //   // return this.eventRepository
  //   //   .createQueryBuilder('e')
  //   //   .select(['e.id', 'e.name'])
  //   //   .orderBy('e.id', 'ASC')
  //   //   .take(3)
  //   //   .getMany();
  // }

  @Get(':id')
  async findOne(@Param('id', new ParseIntPipe()) id: number) {
    const event = await this.eventsService.getEvent(id);
    if (!event) {
      throw new NotFoundException('No se encontro el evento');
    }

    return event;
  }

  @Post()
  @UseGuards(AuthGuardJwt)
  async create(@Body() input: CreateEventDto, @CurrentUser() user: User) {
    return await this.eventsService.createEvent(input, user);
  }
  

  @Patch(':id')
  @UseGuards(AuthGuardJwt)
  @HttpCode(200)
  async update(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() input: UpdateEventDto,
    @CurrentUser() user: User,
  ) {
    const event = await this.eventsService.getEvent(id);

    if(!event){
      throw new NotFoundException();
    }

    if (event.organizerId !== user.id) {
      throw new ForbiddenException(
        null,
        `You are not authorized to change this event`,
      );
    }

    return await this.eventsService.updateEvent(event, input);
  }

  @Delete(':id')
  @UseGuards(AuthGuardJwt)
  @HttpCode(204)
  async remove(
    @Param('id', new ParseIntPipe()) id: number,
    @CurrentUser() user: User,
  ) {
    const event = await this.eventRepository.findOne({
      where: {
        id: id,
      },
    });

    if(!event){
      throw new NotFoundException();
    }

    if (event.organizerId !== user.id) {
      throw new ForbiddenException(
        null,
        `You are not authorized to change this event`,
      );
    }

    await this.eventsService.deleteEvent(id);
  }
}
