import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from './user.entity';
import { hashPasswordFunction } from './utils/functions';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  public getTokenForUser(user: User): string {
    return this.jwtService.sign({
      username: user.username,
      sub: user.id,
    });
  }

  public async hashPassword(password: string): Promise<string> {
    return hashPasswordFunction(password);
  }
}
