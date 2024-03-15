import { PartialType } from '@nestjs/mapped-types';
import { CreateEventDto } from './create-event.dto';

export class UpdateEventDto extends PartialType(CreateEventDto) {
  // partial type is always necessary in update dtos
  name?: string;
  description?: string;
  when?: string;
  address?: string;
}
