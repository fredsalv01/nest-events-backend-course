import { Query, Resolver } from '@nestjs/graphql';
import { User } from './user.entity';
import { CurrentUser } from './current-user.decorator';
import { AuthGuardJwtGql } from './auth-guard-jwt.gql';
import { UseGuards } from '@nestjs/common';

@Resolver(() => User)
export class UserResolver {
  @Query(() => User, { nullable: true })
  @UseGuards(AuthGuardJwtGql)
  public async me(@CurrentUser() user: User): Promise<User> {
    return user;
  }
}
