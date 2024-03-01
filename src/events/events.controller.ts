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
} from '@nestjs/common';
import { CreateEventDto } from './create-event.dto';
import { UpdateEventDto } from './update-event.dto';
import { Event } from './event.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Length } from 'class-validator';

@Controller({
  path: '/events',
})
export class EventsController {
  private readonly logger = new Logger(EventsController.name);

  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
  ) {}

  @Get()
  async findAll() {
    this.logger.log(`Hit the findAll route`);
    const events = await this.eventRepository.find();
    this.logger.debug(`Found ${events.length} events`);
    return events;
  }

  @Get('practice2')
  async practice2() {
    return await this.eventRepository.findOne({
      where: {
        id: 1,
      },
      // loadEagerRelations: false
      relations: ['attendees'],
    });
  }

  @Get(':id')
  async findOne(@Param('id', new ParseIntPipe()) id: number) {
    const event = await this.eventRepository.findOne({
      where: {
        id: id,
      },
    });
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
