import { Injectable } from '@nestjs/common';
import { CreateBlockedDto } from './dto/create-blocked.dto';
import { UpdateBlockedDto } from './dto/update-blocked.dto';
import { BlockedRepository } from './blocked.repository';
import { blocked } from './blocked.repository';
@Injectable()
export class BlockedService {

  constructor(private readonly blockedRepository: BlockedRepository){}

  async getAllBlocked() : Promise<blocked[]> {
    return await this.blockedRepository.getBlockedStudents();
  }

  async createBlocked(createBlockedDto: CreateBlockedDto) : Promise<blocked>{
    if(await this.blockedRepository.IsBlocked(createBlockedDto.Roll_NO)){
      throw new Error("Student is already blocked");
    }
    return await this.blockedRepository.createBlocked(createBlockedDto);
  }

  async unblockStudent(rollNo: string, updateBlockedDto: UpdateBlockedDto) : Promise<blocked>{
    if(!await this.blockedRepository.IsBlocked(rollNo)){
      throw new Error("Student is not currently blocked");
    } 
    if(!updateBlockedDto.Blocked_Role_id){
      throw new Error("Blocked_Role_id is required for unblocking");
    }
    return await this.blockedRepository.unblockStudent(rollNo,updateBlockedDto.Blocked_Role_id);
  }

}
