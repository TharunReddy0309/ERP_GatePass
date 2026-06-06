import { Controller, Get, Post, Body, Put, Param, Req } from '@nestjs/common';
import { PassesService } from './passes.service';
import { CreatePassDto } from './dto/create-pass.dto';
import { PassStatus, UpdatePassDto } from './dto/update-pass.dto';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { MockJwtGuard } from '../auth/mock-jwt.guard';
import { RolesGuard} from '../auth/roles.guard';
import { Role } from '../common/roles.enums';
import { Roles } from 'src/auth/roles.decorator';

@Controller('Passes')
@UseGuards(
  MockJwtGuard,
  // JwtAuthGuard,
  RolesGuard
)
export class PassesController {
  constructor(private readonly passesService: PassesService) {}
  @Get("getAllPasses")
  @Roles(Role.CHIEF_WARDEN)
  async getAll() :Promise<any>{
    return await this.passesService.getAllPasses();
  }
  @Get("getByHostel/:id")
  @Roles(Role.CHIEF_WARDEN,Role.WARDEN,Role.CARETAKER)
  async getByHostel(@Param('id') id: string) {
    return await this.passesService.getByHostel(id);
  }

  @Get("getByStatus/:status")
  @Roles(Role.CHIEF_WARDEN,Role.WARDEN,Role.CARETAKER)
  async getByStatus(@Param('status') status: PassStatus) {
    return await this.passesService.getByStatus(status);
  }

  @Get("getMyPasses")
  @Roles(Role.STUDENT)
  async getMyPasses(@Req() req: any) {
    return await this.passesService.getMyPasses(req.user.rollNo);
  }

  @Get("getByHostelStatus/:id/:status")
  @Roles(Role.CHIEF_WARDEN,Role.WARDEN,Role.CARETAKER)
  async getByHostelStatus(@Param('id') id: string, @Param('status') status: PassStatus) {
    return await this.passesService.getByHostelStatus(id, status);
  }

  @Post("createPass")
  @Roles(Role.STUDENT)
  async createPass(@Body() createPass: CreatePassDto) :Promise<any> {
    return await this.passesService.createPass(createPass);
  }

  @Put("cancelPass/:id")
  @Roles(Role.STUDENT)
  async cancelPass(@Param('id') id: string, @Body() updatePass: UpdatePassDto) {
    return await this.passesService.cancelPass(id,updatePass);
  }
  
  @Put("approveParent/:id")
  @Roles(Role.PARENT)
  async approveParent(@Param('id') id: string,@Body() updatePass: UpdatePassDto) {
    return await this.passesService.approveParent(id,updatePass);
  }

  @Put("approveCaretaker/:id")
  @Roles(Role.CARETAKER)
  async approveCaretaker(@Param('id') id: string, @Body() updatePass: UpdatePassDto) {
    return await this.passesService.approveCaretaker(id,updatePass);
  }

  @Put("Checkin/:id")
  @Roles(Role.SECURITY)
  async checkin(@Param('id') id: string, @Body() updatePass: UpdatePassDto) {
    return await this.passesService.checkin(id, updatePass);
  }

  @Put("Checkout/:id")
  @Roles(Role.SECURITY)
  async checkout(@Param('id') id: string, @Body() updatePass: UpdatePassDto) {
    return await this.passesService.checkout(id, updatePass);
  }

}
