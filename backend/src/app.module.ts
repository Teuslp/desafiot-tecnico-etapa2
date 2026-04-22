import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    PrismaModule,
    AuthModule,
    UsersModule,
    // TODO: Import ProductsModule, CategoriesModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
