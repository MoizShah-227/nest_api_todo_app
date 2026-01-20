import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSubtaskDto, CreateTaskDto } from './dto';

@Injectable()
export class TaskService {
  constructor(private prisma: PrismaService) {}

  async getTasks(userId: number) {
    try {
      const res= await this.prisma.tasks.findMany({
        where: { userId },
        include: { subtasks: true },
      });
      return res;
    } catch (error) {
      throw new ForbiddenException(error);
    }
  }

  async addTask(dto: CreateTaskDto, userId: number) {
    try {
    const res = await this.prisma.tasks.create({
        data: {
          title: dto.title,
          userId,
          subtasks: dto.subtasks
            ? {
                create: dto.subtasks.map((sub) => ({ title: sub.title })),
              }
            : undefined,
        },
        include: { subtasks: true },
      });
      return res
    } catch (error) {
      throw new ForbiddenException(error);
    }
  }

  async addSubTask(dto: CreateSubtaskDto, taskId: number, userId: number) {
    const task = await this.prisma.tasks.findUnique({ where: { id: taskId } });
    if (!task || task.userId !== userId) {
      throw new ForbiddenException("You cannot add subtasks to this task");
    }

    const res= await this.prisma.subtasks.create({
      data: { title: dto.title, taskId },
    });
    return res;
  }

  async deleteTask(taskId: number, userId: number) {
    const task = await this.prisma.tasks.findUnique({ where: { id: taskId } });

    if (!task || task.userId !== userId) {
      throw new ForbiddenException("You cannot delete this task");
    }
    try{
        const dlt_subTasks=await this.prisma.subtasks.deleteMany({ where: { taskId } });
        const dlt_tasks= await this.prisma.tasks.delete({ where: { id: taskId } });
        return{message:"Task deleted successfully"} 
    }catch(error){
        throw new ForbiddenException(error)
    }
}

  async deleteSubTask(subtaskId: number, userId: number) {
    const subtask = await this.prisma.subtasks.findUnique({
      where: { id: subtaskId },
      include: { task: true },
    });

    if (!subtask || subtask.task.userId !== userId) {
      throw new ForbiddenException("You cannot delete this subtask");
    }
    return await this.prisma.subtasks.delete({ where: { id: subtaskId } });
    
  }

  async updateTask(taskId: number, dto: CreateTaskDto, userId: number) {
    const task = await this.prisma.tasks.findUnique({ where: { id: taskId } });

    if (!task || task.userId !== userId) {
      throw new ForbiddenException("You cannot update this task");
    }

    return await this.prisma.tasks.update({
      where: { id: taskId },
      data: { title: dto.title },
    });
  }

  async updateSubTask(subtaskId: number, dto: CreateSubtaskDto, userId: number) {
    const subtask = await this.prisma.subtasks.findUnique({
      where: { id: subtaskId },
      include: { task: true },
    });

    if (!subtask || subtask.task.userId !== userId) {
      throw new ForbiddenException("You cannot update this subtask");
    }

    return await this.prisma.subtasks.update({
      where: { id: subtaskId },
      data: { ...dto },
    });
  }



  async checkTask(taskId: number, userId: number) {
    const task = await this.prisma.tasks.findUnique({ where: { id: taskId } });

    if (!task || task.userId !== userId) {
      throw new ForbiddenException("You cannot modify this task");
    }

    const updatedTask = await this.prisma.tasks.update({
      where: { id: taskId },
      data: { completed: !task.completed },
    });

    await this.prisma.subtasks.updateMany({
      where: { taskId },
      data: { completed: !task.completed },
    });

    return updatedTask;
  }

  async checkSubTask(subtaskId: number, userId: number) {
    const subtask = await this.prisma.subtasks.findUnique({
      where: { id: subtaskId },
      include: { task: true },
    });

    if (!subtask || subtask.task.userId !== userId) {
      throw new ForbiddenException("You cannot modify this subtask");
    }

    return await this.prisma.subtasks.update({
      where: { id: subtaskId },
      data: { completed: !subtask.completed },
    });
  }
}
