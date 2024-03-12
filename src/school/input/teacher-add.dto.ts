import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, MinLength } from 'class-validator';

@InputType()
export class TeacherAddDto {
  @Field()
  @IsNotEmpty()
  @MinLength(5)
  name: string;
}
