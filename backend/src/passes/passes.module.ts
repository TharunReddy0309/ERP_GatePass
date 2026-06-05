import { Module } from '@nestjs/common';
import { PassesService } from './passes.service';
import { PassesController } from './passes.controller';
import { PassesRepository } from './passes.repository';

@Module({
  controllers: [PassesController],
  providers: [PassesService, PassesRepository],
})
export class PassesModule {}
