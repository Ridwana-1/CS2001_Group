import { UseGuards } from '@nestjs/common';
import { Args, Context, Query, Mutation, Resolver } from '@nestjs/graphql';
import { GqlAuthGuard } from 'src/auth/guards/gql-auth-guard';
import { CurrentUser } from '../common/current-user';
import type { IUser } from '../user/user.interface';
import { AuthService } from './auth.service';
import { AuthUser as SupabaseAuthUser } from '@supabase/supabase-js';
import { UserModel } from '../user/user.model';


@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Query(() => UserModel, { name: 'viewer' })
  @UseGuards(GqlAuthGuard)
  async me(@CurrentUser() user: SupabaseAuthUser) {
    return user;
  }
}
