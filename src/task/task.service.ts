import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSubtaskDto, CreateTaskDto } from './dto';
import { send } from 'process';

@Injectable()
export class TaskService {
    constructor(private prisma:PrismaService){}


    async getTasks(){
        try{
            const res = await this.prisma.tasks.findMany({include:{subtasks:true}})

            return res;
        }catch(error){
            throw new ForbiddenException(error)
        }
    }
    async addTask(dto: CreateTaskDto) {
    try {
        const task = await this.prisma.tasks.create({
        data: {
            title: dto.title,
            subtasks: dto.subtasks
            ? {
                create: dto.subtasks.map(sub => ({
                    title: sub.title,
                })),
                }
            : undefined,
        },
        include: {
            subtasks: true, 
        },
        });

        return task;
    } catch (error) {
        throw new ForbiddenException(error);
    }
    }

    async addSubTask(dto:CreateSubtaskDto,taskId:number){
        try{
            const res = await this.prisma.subtasks.create({
                data:{
                    title: dto.title,
                    taskId: taskId, 
                }
                
            })
            return res;
        }catch(error){
            throw new ForbiddenException(error)
        }
    }

        
    async deleteSubTask(taskId:number){
        try{
            const res = await this.prisma.subtasks.delete({
                where:{id:taskId}
            })
            return res;
        }catch(error){
            throw new ForbiddenException(error)
        }
    }

    
    async deleteTask(taskId:number){
        try{
            const subTask = await this.prisma.subtasks.deleteMany({
                where:{taskId:taskId}
            })
            if(subTask){
            const res = await this.prisma.tasks.delete({
                where:{id:taskId}
            })  
            }
            return true;
        }catch(error){
            throw new ForbiddenException(error)
        }
    }

    async updateSubTask(subtaskId: number, dto: CreateSubtaskDto) {
        try {
            const res = await this.prisma.subtasks.update({
            where: {
                id: subtaskId, 
            },
            data: {
                ...dto,
            },
            });

            return res;
        } catch (error) {
            throw new ForbiddenException(error);
        }
        }
    
    async updateTask(taskId: number, dto: CreateTaskDto) {
        try {
            const res = await this.prisma.tasks.update({
            where: {
                id: taskId,
            },
            data: {
                title: dto.title,}
            });
            return res;
        } catch (error) {
            throw new ForbiddenException(error);
        }
        }


    async checkTask(task_Id: number) {
        try {
            const task = await this.prisma.tasks.findUnique({
            where: { id: task_Id },
            select: { completed: true },
            });
            const updatedTask = await this.prisma.tasks.update({
            where: { id: task_Id },
            data: { completed: !task?.completed },
            });

            await this.prisma.subtasks.updateMany({
            where: { taskId: task_Id },
            data: { completed: !task?.completed },
            });

            return updatedTask 
        } catch (error) {
            throw new ForbiddenException(error);
        }
    }

    async checkSubTask(task_Id: number) {
        try {
            const task = await this.prisma.subtasks.findUnique({
            where: { id: task_Id },
            select: { completed: true },
            });
            
            const updatedTask = await this.prisma.subtasks.update({
            where: { id: task_Id },
            data: { completed: !task?.completed },
            });

            return updatedTask 
        } catch (error) {
            throw new ForbiddenException(error);
        }
    }




    

}