import { Module } from '@nestjs/common';
import { BlockedService } from './blocked.service';
import { BlockedController } from './blocked.controller';
import { BlockedRepository } from "./blocked.repository";
import { StudentRepository } from '../student/student.repository';
import { PassActionsRepository } from '../passes/passactions.repository';

@Module({
  controllers: [BlockedController],
  providers: [BlockedService, BlockedRepository, StudentRepository, PassActionsRepository],
  exports:[BlockedRepository]
})
export class BlockedModule {}
