import { IsString, IsBoolean, IsOptional, ValidateNested, ArrayMinSize } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';


export class CreateSubtaskDto {
  @ApiProperty({ example: 'Subtask-1' })
  @IsString()
  title!: string;

  @ApiPropertyOptional({ example: false })
  @IsBoolean()
  @IsOptional()
  completed?: boolean;
}

export class CreateTaskDto {
  @ApiProperty({ example: 'Task-1' })
  @IsString()
  title!: string;

  @ApiPropertyOptional({ example: false })
  @IsBoolean()
  @IsOptional()
  completed?: boolean;

  @ApiPropertyOptional({
    type: () => [CreateSubtaskDto],
    example: [
      { title: 'Subtask-1', completed: false },
      { title: 'Subtask-2',completed: false}
    ],
  })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateSubtaskDto)
  subtasks?: CreateSubtaskDto[];
}

export class EditTaskDto {
  @IsOptional()
  @IsString()
  @ApiProperty({example:"Task-1"})
  title?: string;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({example:true})
  completed?: boolean;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateSubtaskDto)
  @ApiProperty({example:[{"title":"sub-task-1"}]})
  subtasks?: CreateSubtaskDto[];
}


export class updateTaskDto{
  @ApiPropertyOptional({ example: 'Updated Task Title' })
  @IsOptional()
  @IsString()
  title?: string;
}

export class updateSubTaskDto{
  @ApiPropertyOptional({ example: 'Updated Subtask Title' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  completed?: boolean;
}

