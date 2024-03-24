import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { User } from './user.entity';
import { CurrentUser } from './current-user.decorator';
import { AuthGuardJwtGql } from './auth-guard-jwt.gql';
import { UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create.user.dto';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => User, { nullable: true })
  @UseGuards(AuthGuardJwtGql)
  public async me(@CurrentUser() user: User): Promise<User> {
    return user;
  }

  @Mutation(() => User, { name: 'userAdd' })
  public async add(
    @Args('input', { type: () => CreateUserDto }) input: CreateUserDto,
  ): Promise<User> {
    return await this.usersService.create(input);
  }
}
