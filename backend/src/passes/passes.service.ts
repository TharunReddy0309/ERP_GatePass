import { Injectable } from '@nestjs/common';
import { CreatePassDto } from './dto/create-pass.dto';
import { PassStatus,UpdatePassDto } from './dto/update-pass.dto';
import { PassesRepository } from './passes.repository';
import { BlockedRepository } from 'src/blocked/blocked.repository';
import { PassActionsRepository } from './passactions.repository';

@Injectable()
export class PassesService {

    constructor(
      private readonly passesRepository:PassesRepository,
      private readonly blockedRepository: BlockedRepository,
      private readonly passActionsRepository: PassActionsRepository
    ){}

    async getAllPasses():Promise<any>{
        return await this.passesRepository.getAllPasses();
    }

    async getByHostel(id:string):Promise<any>{
        return await this.passesRepository.getByHostel(id);
    }

    async getByStatus(status:PassStatus):Promise<any>{
        return await this.passesRepository.getByStatus(status);
    }

    async getMyPasses(rollNo:string):Promise<any>{
        return await this.passesRepository.getMyPasses(rollNo);
    }

    async getByHostelStatus(id:string,status:PassStatus):Promise<any>{
        return await this.passesRepository.getByHostelStatus(id,status);
    }

    async getPassActions():Promise<any>{
        return await this.passActionsRepository.getAllActions();
    }

    async createPass(CreatePass:CreatePassDto,rollNo:string):Promise<any>{
        if(await this.blockedRepository.IsBlocked(rollNo)){
          throw new Error("Student is currently blocked from raising passes");
        }
        if(await this.passesRepository.IsPassActive(rollNo)){
          throw new Error("Pass Already active for this student");
        }
        return await this.passesRepository.createPass(CreatePass,rollNo);
    }

    async cancelPass(id:string,updatePass:UpdatePassDto):Promise<any>{

        if(updatePass.Status!==PassStatus.CANCELLED){
            throw new Error("Invalid status update");
        }
        const found=await this.passesRepository.getPassById(id);
        if(!found){
            throw new Error("Pass not found");
        }
        if(found.Status!==PassStatus.PENDING){
            throw new Error("Only pending pass can be cancelled");
        }
        this.passActionsRepository.createAction(id,found.RollNo,"Pass Cancelled in "+found.HostelId);
        return await this.passesRepository.cancelPass(id);

    }

    async approveParent(id:string,updatePass:UpdatePassDto):Promise<any>{

        if(updatePass.Status!==PassStatus.Parentapproved){
            throw new Error("Invalid status update");
        }
        const found=await this.passesRepository.getPassById(id);
        if(!found){
            throw new Error("Pass not found");
        }
        if(found.Status!==PassStatus.PENDING){
            throw new Error("Only pending pass can be approved");
        }
        this.passActionsRepository.createAction(id,found.RollNo,"Parent Approved in "+found.HostelId); 
        return await this.passesRepository.approveParent(id);

    }

    async approveCaretaker(id:string,updatePass:UpdatePassDto):Promise<any>{

        if(updatePass.Status!==PassStatus.CareTakerapproved){
            throw new Error("Invalid status update");
        }
        const found=await this.passesRepository.getPassById(id);
        if(!found){
            throw new Error("Pass not found");
        }
        if(found.Status!==PassStatus.Parentapproved){
            throw new Error("Parent approval required");
        }
        this.passActionsRepository.createAction(id,found.RollNo,"Caretaker Approved in "+found.HostelId);
        return await this.passesRepository.approveCaretaker(id);

    }

    async checkout(id:string,updatePass:UpdatePassDto):Promise<any>{

        if(updatePass.Status!==PassStatus.CHECKEDOUT){
            throw new Error("Invalid status update");
        }
        const found=await this.passesRepository.getPassById(id);
        if(!found){
            throw new Error("Pass not found");
        }
        if(found.Status!==PassStatus.CareTakerapproved){
            throw new Error("Pass not approved");
        }
        this.passActionsRepository.createAction(id,found.RollNo,"Pass Checked Out at "+found.HostelId);
        return await this.passesRepository.checkout(id);

    }
 
    async checkin(id:string,updatePass:UpdatePassDto):Promise<any>{
        
        if(updatePass.Status!==PassStatus.CHECKEDIN){
            throw new Error("Invalid status update");
        }
        const found=await this.passesRepository.getPassById(id);
        if(!found){
            throw new Error("Pass not found");
        }
        if(found.Status!==PassStatus.CHECKEDOUT){
            throw new Error("Student not checked out");
        }
        this.passActionsRepository.createAction(id,found.RollNo,"Pass Checked In at "+found.HostelId);
        return await this.passesRepository.checkin(id);

    }

}