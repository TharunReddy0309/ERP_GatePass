import { Module } from '@nestjs/common';
import { BlockedService } from './blocked.service';
import { BlockedController } from './blocked.controller';
import { BlockedRepository } from "./blocked.repository";
import { StudentRepository } from '../student/student.repository';
import { StorageService } from './storage.service';
import { HostelRepository } from '../hostel/hostel.repository';
import { AuthRepository } from '../auth/auth.repository';

@Module({
  controllers: [BlockedController],
  providers: [BlockedService, BlockedRepository, StudentRepository, StorageService, HostelRepository, AuthRepository],
  exports: [BlockedRepository, StorageService]
})
export class BlockedModule { }
