import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBlockedDto } from './dto/create-blocked.dto';
import { UpdateBlockedDto } from './dto/update-blocked.dto';
import { BlockedRepository } from './blocked.repository';
import { StudentRepository } from '../student/student.repository';
import { HostelRepository } from '../hostel/hostel.repository';
import { AuthRepository } from '../auth/auth.repository';

@Injectable()
export class BlockedService {

  constructor(
    private readonly blockedRepository: BlockedRepository,
    private readonly studentRepository: StudentRepository,
    private readonly hostelRepository: HostelRepository,
    private readonly authRepository: AuthRepository,
  ) { }

  private async resolveCallerBlock(email: string): Promise<string> {
    const user = await this.authRepository.findUserByEmail(email);
    if (!user) throw new NotFoundException('Not found');
    const hostel = await this.hostelRepository.findByUserId(user.Id);
    if (!hostel) throw new NotFoundException('Not found');
    return hostel.Block_Id;
  }

  async getAllBlocked() {
    return await this.blockedRepository.getBlockedStudents();
  }

  async createBlocked(createBlockedDto: CreateBlockedDto, callerEmail?: string) {
    const student = await this.studentRepository.findByRollNo(createBlockedDto.Roll_No);
    if (!student) {
      throw new NotFoundException('Not found');
    }
    if (callerEmail) {
      const callerBlock = await this.resolveCallerBlock(callerEmail);
      if (student.Block_Id !== callerBlock) {
        throw new NotFoundException('Not found');
      }
    }
    if (student.Is_Blocked) {
      return;
    }
    await this.studentRepository.updateBlockedStatus(createBlockedDto.Roll_No, true);
    return await this.blockedRepository.createBlocked(createBlockedDto);
  }

  async unblockStudent(rollNo: string, updateBlockedDto: UpdateBlockedDto, callerEmail: string) {
    const callerBlock = await this.resolveCallerBlock(callerEmail);
    const student = await this.studentRepository.findByRollNo(rollNo);
    if (!student || student.Block_Id !== callerBlock) {
      throw new NotFoundException('Not found');
    }
    if (!student.Is_Blocked) {
      throw new Error("Student is not currently blocked");
    }
    if (!updateBlockedDto.Blocked_Role_id) {
      throw new Error("Blocked_Role_id is required for unblocking");
    }
    await this.studentRepository.resetDefaulterAttempts(rollNo);
    await this.studentRepository.updateBlockedStatus(rollNo, false);
    return await this.blockedRepository.unblockStudent(rollNo, updateBlockedDto.Blocked_Role_id);
  }

}
