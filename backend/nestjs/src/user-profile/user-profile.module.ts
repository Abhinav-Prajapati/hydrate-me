import { Module, MiddlewareConsumer } from '@nestjs/common';
import { UserProfileService } from './user-profile.service';
import { PrismaService } from 'prisma/prisma.service';
import { UserProfileController } from './user-profile.controller';
import { JwtMiddleware } from 'src/jwt/jwt.middleware';


@Module({
  providers: [UserProfileService, PrismaService],
  exports: [UserProfileService],
  controllers: [UserProfileController]
})
export class UserProfileModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(JwtMiddleware).forRoutes('user')
  }
}
