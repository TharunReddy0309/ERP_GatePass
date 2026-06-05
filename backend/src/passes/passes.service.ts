import { Injectable } from '@nestjs/common';
import { CreatePassDto } from './dto/create-pass.dto';
import { PassStatus,UpdatePassDto } from './dto/update-pass.dto';
import { PassesRepository } from './passes.repository';

@Injectable()
export class PassesService {

    constructor(
        private readonly passesRepository:PassesRepository
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

    async createPass(CreatePass:CreatePassDto):Promise<any>{
        return await this.passesRepository.createPass(CreatePass);
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
        return await this.passesRepository.checkin(id);
    }

}