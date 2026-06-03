import { Injectable } from '@nestjs/common';
import { CreatePassDto } from './dto/create-pass.dto';
import { UpdatePassDto } from './dto/update-pass.dto';

@Injectable()
export class PassesService {
  getAllPasses() {
    return "This action returns all passes";
  }
}
