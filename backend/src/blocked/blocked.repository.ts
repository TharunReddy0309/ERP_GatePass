import { Injectable } from '@nestjs/common';
import { CreateBlockedDto } from './dto/create-blocked.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class BlockedRepository {
    constructor(private readonly prisma: PrismaService,){}

    async createBlocked(createBlockedDto:CreateBlockedDto){
        return await this.prisma.blocked.create({
            data:{
                Roll_NO:createBlockedDto.Roll_NO,
                Hostel_id:createBlockedDto.Hostel_id,
            }
        });
    }

    async unblockStudent(rollNo : string, blockedRoleId: string){
        const blocked = await this.prisma.blocked.findFirst({
            where: {
                Roll_No: rollNo,
                UnblockedAt: null,
            }
        });

        return await this.prisma.blocked.update({
            where: {
                id: blocked.id,
            },
            data: {
                blocked_Role_ID: blockedRoleId,
                UnblockedAt: new Date(),
            }
        });
    }

    async getBlockedStudents(){
        return await this.prisma.blocked.findMany({
            where:{
                Unblocked_At:null
            }
        });
    }

}