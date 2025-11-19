import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from '@src/modules/auth/auth.module';
import { UsersModule } from '@src/modules/users/users.module';
import { EventsModule } from '@src/modules/events/events.module';
import { BookingsModule } from '@src/modules/bookings/bookings.module';
import { TicketsModule } from '@src/modules/tickets/tickets.module';
import { PaymentsModule } from '@src/modules/payments/payments.module';
import { AdminModule } from '@src/modules/admin/admin.module';
import { DrizzleModule } from '@src/database/drizzle.module';
import { ConfigModule } from '@nestjs/config';
import { SupabaseModule } from '@src/supabase/supabase.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    UsersModule,
    EventsModule,
    BookingsModule,
    TicketsModule,
    PaymentsModule,
    AdminModule,
    DrizzleModule,
    SupabaseModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
