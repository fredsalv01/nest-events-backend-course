import {
  Resolver,
  Query,
  Args,
  Int,
  Mutation,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { Teacher } from './teacher.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { TeacherAddDto } from './input/teacher-add.dto';
import { Logger } from '@nestjs/common';
import { TeacherEditDto } from './input/teacher-edit.dto';
import { EntityWithId } from './school.types';

@Resolver(() => Teacher)
export class TeacherResolver {
  private readonly logger = new Logger(TeacherResolver.name);

  constructor(
    @InjectRepository(Teacher)
    private readonly teachersRepository: Repository<Teacher>,
  ) {}
  @Query(() => [Teacher])
  public async teachers(): Promise<Teacher[]> {
    return await this.teachersRepository.find({
      relations: ['subjects'],
    });
  }

  @Query(() => Teacher)
  public async teacher(
    @Args('id', { type: () => Int, description: 'teacher id' }) id: number,
  ): Promise<Teacher> {
    return await this.teachersRepository.findOneOrFail({
      where: {
        id: id,
      },
    });
  }

  @Mutation(() => Teacher, { name: 'teacherAdd' })
  public async add(
    @Args('input', { type: () => TeacherAddDto })
    input: TeacherAddDto,
  ): Promise<Teacher> {
    return await this.teachersRepository.save(new Teacher(input));
  }

  @Mutation(() => Teacher, { name: 'teacherEdit' })
  public async edit(
    @Args('id', { type: () => Int, description: 'teacher id' })
    id: number,
    @Args('input', { type: () => TeacherEditDto })
    input: TeacherEditDto,
  ): Promise<Teacher> {
    const teacher = await this.teachersRepository.findOneOrFail({
      where: {
        id: id,
      },
    });
    return await this.teachersRepository.save(
      new Teacher(Object.assign(teacher, input)),
    );
  }

  @Mutation(() => EntityWithId, { name: 'teacherDelete' })
  public async delete(
    @Args('id', { type: () => Int })
    id: number,
  ): Promise<EntityWithId> {
    const teacher = await this.teachersRepository.findOneOrFail({
      where: {
        id: id,
      },
    });
    await this.teachersRepository.remove(teacher);
    return new EntityWithId(id);
  }

  @ResolveField('subjects')
  public async subjects(@Parent() teacher: Teacher) {
    this.logger.debug(`@ResolveField subjects was called`);
    return await teacher.subjects;
  }

  
}
