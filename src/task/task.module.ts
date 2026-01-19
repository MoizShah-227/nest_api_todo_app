import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
   imports: [PrismaModule, AuthModule],
  providers: [TaskService],
  controllers: [TaskController]
})
export class TaskModule {}
