import {
 Injectable,
 CanActivate,
 ExecutionContext
} from '@nestjs/common';

@Injectable()

export class MockJwtGuard
implements CanActivate {

 canActivate(
   context: ExecutionContext
 ){

   const req =
   context.switchToHttp()
   .getRequest();

   req.user = {

      userId: 1,

      role: "STUDENT",

      email: "test@gmail.com",

      rollNo: "S20240010032"
   };

   return true;
 }

}