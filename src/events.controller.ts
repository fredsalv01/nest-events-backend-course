import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateEventDto } from './create-event.dto';
import { UpdateEventDto } from './update-event.dto';
import { Event } from './event.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Controller({
  path: '/events',
})
export class EventsController {
  private events: Event[] = [];

  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
  ) {}

  @Get()
  findAll() {
    return this.eventRepository.find();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const event = await this.eventRepository.findOne({
      where: {
        id: parseInt(id),
      },
    });
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
  async update(@Param('id') id: string, @Body() input: UpdateEventDto) {
    const event = await this.eventRepository.findOne({
      where: {
        id: parseInt(id),
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
  async remove(@Param('id') id: string) {
    const event = await this.eventRepository.findOne({
      where: {
        id: parseInt(id),
      },
    });
    await this.eventRepository.remove(event);
  }
}
