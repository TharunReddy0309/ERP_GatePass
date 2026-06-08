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

      role: "CHIEF_WARDEN",

      email: "test@gmail.com",

    };

   return true;
 }

}