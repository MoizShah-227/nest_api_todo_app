import { INestApplication, ValidationPipe } from "@nestjs/common";
import { AppModule } from "../src/app.module";
import * as pactum from 'pactum';
import { Test } from '@nestjs/testing';
import { PrismaService } from "../src/prisma/prisma.service";
import { CreateSubtaskDto, CreateTaskDto } from "src/task/dto";

describe('App-e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule]
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();
    await app.listen(5555);

    prisma = app.get(PrismaService);
    await prisma.cleanDb();

    pactum.request.setBaseUrl("http://localhost:5555");
  });

  afterAll(async () => {
    await app.close();
  });

  describe("todo test case",()=>{
    describe("GetAll todo list",()=>{
      it("Todo List Returns",async ()=>{
        return pactum.spec().get('/task').expectStatus(200)
      })
    })
    
    describe("Add Tasks",()=>{
      const dto:CreateTaskDto={
        title:"This is e2e Testing",
        subtasks:[{title:"this is sub task-1"},{title:"this is sub task-2"}]
      }
      it("Add full task",async ()=>{
        return pactum.spec().post('/task').withBody(dto).expectStatus(201)
      })
      it("should add subtask", async () => {
        const taskId = 1; 
        const dto: CreateSubtaskDto = {
        title: "New Subtask",
        completed: false,
      };

      return pactum
        .spec()
        .post("/task/subtask/{id}")
        .withPathParams("id", taskId.toString())
        .withBody(dto)
        .expectStatus(201);
      });

    })
    
    describe("Delete Test Case",()=>{
      it("Delete the subtask", async () => {
        const subTaskId=1
      return pactum
        .spec()
        .delete("/task/subtask/{id}")
        .withPathParams("id",subTaskId.toString())
        .expectStatus(200);
      });
      
      it("Delete the MainTask", async () => {
        const subTaskId=1
        return pactum
          .spec()
          .delete("/task/main/{id}")
          .withPathParams("id",subTaskId.toString())
          .expectStatus(200);
        });
    })
  })
});
