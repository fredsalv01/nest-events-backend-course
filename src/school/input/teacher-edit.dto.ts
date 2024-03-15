import { InputType, PartialType } from '@nestjs/graphql';
import { TeacherAddDto } from './teacher-add.dto';

@InputType()
export class TeacherEditDto extends PartialType(TeacherAddDto) {}
