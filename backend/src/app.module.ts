import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { HostelModule } from './hostel/hostel.module';
import { StudentModule } from './student/student.module';
import { PassesModule } from './passes/passes.module';
import { BlockedModule } from './blocked/blocked.module';
import { DatabaseModule } from './database/database.module';

@Module({
    imports: [
        AuthModule,
        HostelModule,
        StudentModule,
        PassesModule ,
        BlockedModule,
        DatabaseModule
    ],
})
export class AppModule {}