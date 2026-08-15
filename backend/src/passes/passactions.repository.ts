import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PassActionsRepository {
    constructor(private readonly prisma: PrismaService){}

    async createAction(passId:string,ActorID:string | null,action:string,remarks?:string){
        return await this.prisma.passAction.create({
            data:{
                passID:passId,
                Actor_Id:ActorID as any,
                Action_Type:action,
                Remarks:remarks
            }
        });
    }

    async getAllActions(){
        // Use raw query to avoid Prisma P2032 error when Actor_Id is null in existing rows
        return await this.prisma.$queryRaw`
            SELECT "Action_Id", "passID", "Actor_Id", "Action_Type", "Remarks", "Timestamp"
            FROM "PassAction"
            ORDER BY "Timestamp" DESC
        `;
    }
}