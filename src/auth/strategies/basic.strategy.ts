import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

import { BasicStrategy as Strategy } from 'passport-http';
import { User } from '../../users/models';
import { AuthService } from '../auth.service';

@Injectable()
export class BasicStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(username: string, pass: string): Promise<any> {
    try {
      console.log({ username }, 'START User validation (Basic Strategy)');
      const user: User = await this.authService.validateUser(username, pass);
      console.log('START User', user);
      if (!user) throw new UnauthorizedException();

      const { password, ...result } = user;
      
      return result;
    } catch (error) {
      console.log('START User', error);
      throw new UnauthorizedException(error);
    }
  }
}
