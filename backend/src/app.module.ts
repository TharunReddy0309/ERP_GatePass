import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PassesModule } from './passes/passes.module';
import { BlockedModule } from './blocked/blocked.module';

@Module({
  imports: [PassesModule, BlockedModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
