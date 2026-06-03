import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PassesService } from './passes.service';
import { CreatePassDto } from './dto/create-pass.dto';
import { UpdatePassDto } from './dto/update-pass.dto';

@Controller('Passes')
export class PassesController {
  constructor(private readonly passesService: PassesService) {}
  @Get("getAllPasses")
  getall(){
    return this.passesService.getAllPasses();
  }
  
}
