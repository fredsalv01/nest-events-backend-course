import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
  SerializeOptions,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create.user.dto';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { hashPasswordFunction } from './utils/functions';

@Controller('users')
@SerializeOptions({ strategy: 'excludeAll' })
export class UsersController {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  @Post()
  @HttpCode(201)
  async create(@Body() createUserDto: CreateUserDto) {
    const user = new User();
    if (createUserDto.password !== createUserDto.retypedPassword) {
      throw new BadRequestException(['Passwords are not identical']);
    }

    const existingUser = await this.userRepository.findOne({
      where: [
        {
          username: createUserDto.username,
        },
        {
          email: createUserDto.email,
        },
      ],
    });
    if (existingUser) {
      throw new BadRequestException(['Username or email already exists!']);
    }
    const hashPassword = await hashPasswordFunction(createUserDto.password);
    user.username = createUserDto.username;
    user.email = createUserDto.email;
    user.firstName = createUserDto.firstName;
    user.lastName = createUserDto.lastName;
    user.password = hashPassword;
    const savedUser = await this.userRepository.save(user);
    return savedUser;
  }
}
