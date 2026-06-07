import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { BlockedService } from './blocked.service';
import { CreateBlockedDto } from './dto/create-blocked.dto';
import { UpdateBlockedDto } from './dto/update-blocked.dto';
import{ UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { MockJwtGuard } from '../auth/mock-jwt.guard';
import { RolesGuard} from '../auth/roles.guard';
import { Role } from '../common/roles.enums';
import { Roles } from 'src/auth/roles.decorator';


@Controller('Blocked')
@UseGuards(
  MockJwtGuard,
  // JwtAuthGuard,
  RolesGuard
)

export class BlockedController {
  constructor(private readonly blockedService: BlockedService) {}

  @Put("unblockStudent/:rollNo")
  @Roles(Role.CHIEF_WARDEN,Role.WARDEN)
  unblockStudent(@Param('rollNo') rollNo: string, @Body() updateBlockedDto: UpdateBlockedDto) {
    return this.blockedService.unblockStudent(rollNo,updateBlockedDto);
  }

  @Post("blockStudent")
  @Roles(Role.CHIEF_WARDEN,Role.WARDEN,Role.SECURITY,Role.CARETAKER)
  blockStudent(@Body() createBlockedDto: CreateBlockedDto) {
    return this.blockedService.createBlocked(createBlockedDto);
  }

  @Get("getAllBlocked")
  @Roles(Role.CHIEF_WARDEN,Role.WARDEN)
  getAllBlocked() {
    return this.blockedService.getAllBlocked();
  }

}
