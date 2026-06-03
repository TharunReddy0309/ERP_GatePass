import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BlockedService } from './blocked.service';
import { CreateBlockedDto } from './dto/create-blocked.dto';
import { UpdateBlockedDto } from './dto/update-blocked.dto';

@Controller('Blocked')
export class BlockedController {
  constructor(private readonly blockedService: BlockedService) {}
  @Get("getAllBlocked")
  getall(){
    return this.blockedService.getAllBlocked();
  }
}
