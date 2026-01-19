import { IsString, IsBoolean, IsOptional, ValidateNested, ArrayMinSize } from 'class-validator';
import { Type } from 'class-transformer';


export class CreateSubtaskDto {
  @IsString()
  title!: string;

  @IsBoolean()
  @IsOptional()
  completed?: boolean;
}

export class CreateTaskDto {
  @IsString()
  title!: string;

  @IsBoolean()
  @IsOptional()
  completed?: boolean;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateSubtaskDto)
  subtasks?: CreateSubtaskDto[];
}

export class EditTaskDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsBoolean()
  completed?: boolean;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateSubtaskDto)
  subtasks?: CreateSubtaskDto[];
}
