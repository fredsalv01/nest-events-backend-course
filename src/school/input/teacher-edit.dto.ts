import { InputType, OmitType, PartialType } from '@nestjs/graphql';
import { TeacherAddDto } from './teacher-add.dto';

@InputType()
export class TeacherEditDto extends PartialType(
  OmitType(TeacherAddDto, ['gender']),
) {}
