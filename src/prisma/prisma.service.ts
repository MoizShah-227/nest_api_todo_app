import { Injectable } from '@nestjs/common';
import {PrismaClient}  from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';  
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PrismaService extends PrismaClient {
  User: any;
  constructor(config:ConfigService) {
    const adapter = new PrismaPg({
      connectionString: config.get("DATABASE_URL"), 
    });
    super({ adapter }); 
  }

  cleanDb(){
    return this.$transaction([
      this.subtasks.deleteMany({}),
      this.tasks.deleteMany({}),
      this.user.deleteMany({}),
    ])
  }
}
