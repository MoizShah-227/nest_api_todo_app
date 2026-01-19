import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateSubtaskDto, CreateTaskDto } from './dto';
import { GetUser } from '../../src/auth/decorator';
import { JwtGuard } from '../../src/auth/guard';

@Controller('task')
@UseGuards(JwtGuard)
export class TaskController {
  constructor(private taskService: TaskService) {}


  @Get("/get-tasks")
  getTasks(@GetUser('id') userId: number) {
    return this.taskService.getTasks(userId);
  }

  @Post('add-tasks')
  addTask(@GetUser('id') userId: number, @Body() dto: CreateTaskDto) {
    return this.taskService.addTask(dto, userId);
  }

  @Post("subtasks/:id")
  addSubTask(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) taskId: number,
    @Body() dto: CreateSubtaskDto
  ) {
    return this.taskService.addSubTask(dto, taskId, userId);
  }

  @Delete("/delete-task/:id")
  deleteTask(@GetUser('id') userId: number, @Param('id', ParseIntPipe) taskId: number) {
    return this.taskService.deleteTask(taskId, userId);
  }

  @Delete("/delete-subtask/:id")
  deleteSubTask(@GetUser('id') userId: number, @Param('id', ParseIntPipe) subtaskId: number) {
    return this.taskService.deleteSubTask(subtaskId, userId);
  }


  @Patch("/update-task/:id")
  updateTask(@GetUser('id') userId: number, @Param('id', ParseIntPipe) taskId: number, @Body() dto: CreateTaskDto) {
    return this.taskService.updateTask(taskId, dto, userId);
  }


  @Patch("/update-subtask/:id")
  updateSubtask(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) subtaskId: number,
    @Body() dto: CreateSubtaskDto
  ) {
    return this.taskService.updateSubTask(subtaskId, dto, userId);
  }

  

  @Patch("/check/:id")
  checkTask(@GetUser('id') userId: number, @Param('id', ParseIntPipe) taskId: number) {
    return this.taskService.checkTask(taskId, userId);
  }

  @Patch("/checksubtask/:id")
  checkSubTask(@GetUser('id') userId: number, @Param('id', ParseIntPipe) subtaskId: number) {
    return this.taskService.checkSubTask(subtaskId, userId);
  }
}
