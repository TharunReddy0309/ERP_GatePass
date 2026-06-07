import { Module } from '@nestjs/common';
import { BlockedService } from './blocked.service';
import { BlockedController } from './blocked.controller';
import {BlockedRepository} from "./blocked.repository";
@Module({
  controllers: [BlockedController],
  providers: [BlockedService, BlockedRepository],
  exports:[BlockedRepository]
})
export class BlockedModule {}
