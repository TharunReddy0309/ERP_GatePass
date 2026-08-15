import { Role } from '@prisma/client';
import { IsEmail, IsEnum, IsString, MinLength } from 'class-validator';

export enum UserRole {
  STUDENT = 'STUDENT',
  CARETAKER = 'CARETAKER',
  WARDEN = 'WARDEN',
  PARENT = 'PARENT',
  SECURITY = 'SECURITY'
}

// Converts uppercase UserRole value → Prisma Role enum
export const toPrismaRole = (r: string): Role => ({
  STUDENT: Role.Student,
  CARETAKER: Role.CareTaker,
  WARDEN: Role.Warden,
  PARENT: Role.Parent,
  SECURITY: Role.Security,
} as Record<string, Role>)[r] ?? Role.Warden;

export class LoginDto {
  @IsEmail()
  Email!: string;

  @IsString()
  @MinLength(6)
  password!: string;

  @IsEnum(UserRole)
  role!: UserRole;
}