import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateSubtaskDto, CreateTaskDto } from './dto';
import { pactumEvents } from 'pactum/src/exports/events';

@Controller('task')
export class TaskController {
    constructor(private taskService:TaskService){}

    @Post('')
    addTask(@Body() dto:CreateTaskDto){
        return this.taskService.addTask(dto)
    }

    @Get("")
    getTasks(){
        return this.taskService.getTasks();
    }
    @Post("subtask/:id")
    addSubTask(@Body() dto:CreateSubtaskDto , @Param('id',ParseIntPipe) taskId:number){
        return this.taskService.addSubTask(dto,taskId)
    }

    
    @Delete("main/{:id}")
    deleteTask(@Param('id',ParseIntPipe) id:number){
        return this.taskService.deleteTask(id)
    }

    @Delete("/subtask/{:id}")
    deleteSubTask(@Param('id',ParseIntPipe) id:number){
        return this.taskService.deleteSubTask(id)
    }
    
    @Patch("/subtask/{:id}")
    updateSubtask(@Body() dto:CreateSubtaskDto,@Param('id',ParseIntPipe) taskId:number){
        return this.taskService.updateSubTask(taskId,dto)
    }
    @Patch("/{:id}")
    updateTask(@Body() dto:CreateTaskDto,@Param('id',ParseIntPipe) taskId:number){
        return this.taskService.updateTask(taskId,dto)
    }

    @Patch("/check/{:id}")
    checkTask(@Param('id',ParseIntPipe) taskId:number){
        return this.taskService.checkTask(taskId)
    }
    @Patch("/checksubtask/{:id}")
    checkSubTask(@Param('id',ParseIntPipe) taskId:number){
        return this.taskService.checkSubTask(taskId)
    }


    
}
