import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    // TODO: Import UsersModule, AuthModule, ProductsModule, CategoriesModule, PrismaModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
