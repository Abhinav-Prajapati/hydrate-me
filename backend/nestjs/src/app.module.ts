import { Module } from '@nestjs/common';
import { UserProfileModule } from './user-profile/user-profile.module';

@Module({
  imports: [UserProfileModule]
})
export class AppModule { }
