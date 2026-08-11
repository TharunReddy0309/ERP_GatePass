import { NotFoundException, Injectable } from "@nestjs/common";
import { Role } from "@prisma/client";
import { PrismaService} from "src/prisma/prisma.service";

export interface User {
    USER_ID: string;
    Name: string;
    Email: string;
    PhoneNo: string;
    Role: string;
    Password_Hash: string;
    RefreshToken: string | null;
}


@Injectable()
export class AuthRepository{
    constructor(private readonly prisma: PrismaService,){}
    
    async findUserByEmail(email: string):Promise<any> {
        return await this.prisma.user.findUnique({
            where: {
                Email: email,
            },
        });
    }


    async createUser(userData: any) {
        return await this.prisma.user.create({
            data: userData
        });
    }

    async deleteUser(userId: string) {
        return await this.prisma.user.delete({
            where: {
                Id: userId
            }
        });
    }

    async updateUser(userId: string,updatedData: any){
        return await this.prisma.user.update({
            where: {
                Id: userId
            },
            data: updatedData
        });
    }

    async findOne(email: string, role: Role) {
        return await this.prisma.user.findFirst({
            where: {
                Email: email,
                Role: role
            },
            select: {       
                Id: true,
                Name: true,
                Email: true,
                Phone: true,
                RefreshToken: true,
                Password_Hash: true,
                Role: true,
            }
        });
    }

    async findUID(email: string): Promise<string | null> {
        return await this.prisma.user.findUnique({
            where: {
                Email: email,
            },
            select: {
                Id: true,
            },
        }).then(user => user ? user.Id : null);
    }

    async setRefreshToken(UserID: string,hash: string){
        return await this.prisma.user.update({
            where: {
                Id: UserID,
            },
            data: {
                RefreshToken: hash,
            },
        });
    }

    async deleteToken(UserID: string){
        return await this.prisma.user.update({
            where: {
                Id: UserID,
            },
            data: {
                RefreshToken: null,
            },
        });
    }

    async findRole(userid: string): Promise<string | null> {
        return await this.prisma.user.findUnique({
            where: {
                Id: userid,
            },
            select: {
                Role: true,
            },
        }).then(user => user ? user.Role : null);
    }

    async findEmail(userid: string):Promise<string | null> {
        return await this.prisma.user.findUnique({
            where: {
                Id: userid,
            },
            select: {
                Email: true,
            },
        }).then(user => user ? user.Email : null);
    }

    async getRefreshToken(userid: string): Promise<string | null> {
        return await this.prisma.user.findUnique({
            where: {
                Id: userid,
            },
            select: {
                RefreshToken: true,
            },
        }).then(user => user ? user.RefreshToken : null);
    }

    async findUserById(userId: string) {
        return await this.prisma.user.findUnique({
            where: {
                Id: userId
            }
        });
    }

}
