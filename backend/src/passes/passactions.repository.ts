import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PassActionsRepository {
    constructor(private readonly prisma: PrismaService,){}
    async createAction(passId:string,rollNo:string,ActorID:string,action:string){
        return await this.prisma.passActions.create({
            data:{
                passID:passId,
                Roll_NO:rollNo,
                Actor_Id:ActorID,
                Action_Type:action,
            }
        });
    }
    async getAllActions(){
        return await this.prisma.passActions.findMany({
            orderBy:{
                Timestamp:'desc'
            }
        });
    }
}