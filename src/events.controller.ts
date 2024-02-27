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

@Controller({
  path: '/events',
})
export class EventsController {
  private events: Event[] = [];

  constructor() {}

  @Get()
  findAll() {
    return this.events;
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    const event = this.events.find((item: Event) => item.id === parseInt(id));
    return event;
  }

  @Post()
  create(@Body() input: CreateEventDto) {
    const event = {
      ...input,
      when: new Date(input.when),
      id: this.events.length + 1,
    } as Event;

    this.events.push(event);
    return event;
  }

  @Patch(':id')
  @HttpCode(200)
  update(@Param('id') id: string, @Body() input: UpdateEventDto) {
    const eventIndex = this.events.findIndex(
      (item: Event) => item.id === parseInt(id),
    );

    this.events[eventIndex] = {
      ...this.events[eventIndex],
      ...input,
      when: input.when ? new Date(input.when) : this.events[eventIndex].when,
    };

    return this.events[eventIndex];
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id') id: string) {
    this.events = this.events.filter((item: Event) => item.id !== parseInt(id));
  }
}
