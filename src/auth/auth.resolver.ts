import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { TokenOutput } from './dtos/token.dto';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos/login.dto';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => TokenOutput, { name: 'login' })
  public async login(
    @Args('input', { type: () => LoginDto })
    input: LoginDto,
  ): Promise<TokenOutput> {
    console.log('input', input);
    return new TokenOutput({
      token: this.authService.getTokenForUser(
        await this.authService.validateUser(input.username, input.password),
      ),
    });
  }
}
