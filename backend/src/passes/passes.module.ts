import { Module } from '@nestjs/common';
import { PassesService } from './passes.service';
import { PassesController } from './passes.controller';
import { PassesRepository } from './passes.repository';
import { BlockedModule } from 'src/blocked/blocked.module';

@Module({
  imports: [BlockedModule],
  controllers: [PassesController],
  providers: [PassesService, PassesRepository],
})
export class PassesModule {}
