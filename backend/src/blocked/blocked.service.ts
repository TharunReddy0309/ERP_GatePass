import { Injectable } from '@nestjs/common';
import { CreateBlockedDto } from './dto/create-blocked.dto';
import { UpdateBlockedDto } from './dto/update-blocked.dto';

@Injectable()
export class BlockedService {
  getAllBlocked() {
    return "This action returns all blocked";
  }
}
