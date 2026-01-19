import { INestApplication, ValidationPipe } from "@nestjs/common";
import { AppModule } from "../src/app.module";
import * as pactum from 'pactum';
import { Test } from '@nestjs/testing';
import { PrismaService } from "../src/prisma/prisma.service";
import { CreateSubtaskDto, CreateTaskDto } from "src/task/dto";
import { AuthDto } from "src/auth/dto";

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

  describe("Auth",()=>{
    describe("signup",()=>{
      const dto: AuthDto = {
        email: 'moiz123@gmail.com',
        password: '1234',
      };
      it("should signup", async () => {
        return pactum.spec().post("/auth/signup").withBody(dto).expectStatus(201);
      });

      describe("signin",()=>{
        const dto: AuthDto = {
        email: 'moiz123@gmail.com',
        password: '1234',
      };
        it("should signin", async () => {
        return pactum.spec().post("/auth/signin").withBody(dto).expectStatus(201).stores('userAt', 'access_token');
      });
      })
    })
  })

  describe("todo test case",()=>{
    describe("Get todo list",()=>{
      it("Todo List Returns",async ()=>{
        return pactum.spec().get('/task/get-tasks').withHeaders({Authorization: 'Bearer $S{userAt}'}).expectStatus(200)
      })
    })
    
    describe("Add Tasks",()=>{
      const dto:CreateTaskDto={
        title:"This is e2e Testing",
        subtasks:[{title:"this is sub task-1"},{title:"this is sub task-2"},{title:"this is sub task-3"}]
      }

      it("Add full task",async ()=>{
        return pactum.spec().post('/task/add-tasks').withHeaders({Authorization: 'Bearer $S{userAt}'}).withBody(dto).expectStatus(201)
      })
    
      it("should add subtask", async () => {
        const taskId = 1; 
        const dto: CreateSubtaskDto = {
        title: "New Subtask",
        completed: false,
      };

      return pactum
        .spec()
        .post("/task/subtasks/{id}")
        .withPathParams("id", taskId.toString())
        .withBody(dto).withHeaders({Authorization: 'Bearer $S{userAt}'})
        .expectStatus(201);
      });

    })
    
    describe("Edit Tasks",()=>{
      const taskId =1;
      const dto:CreateTaskDto={title:"this is updated task-1"}
      const dto1:CreateSubtaskDto={title:"this is updated task-1"}
      it("Edit Task",async ()=>{
        return pactum.spec().patch("/task/update-task/{id}").withBody(dto).withHeaders({Authorization: 'Bearer $S{userAt}'}).withPathParams('id',taskId.toString()).expectStatus(200)
      })

      it("Edit subTask",async ()=>{
        return pactum.spec().patch("/task/update-subtask/{id}").withBody(dto1).withHeaders({Authorization: 'Bearer $S{userAt}'}).withPathParams('id',taskId.toString()).expectStatus(200)
      })

      it("Check Task", async () => {
        const taskId = 1; 
        await pactum.spec().patch('/task/check/{id}').withPathParams('id', taskId)
          .withHeaders({Authorization: 'Bearer $S{userAt}'}).expectStatus(200);});      
        
          it("Check SubTask", async () => {
            const subtaskId = 1;

            await pactum.spec()
              .patch('/task/checksubtask/{id}')
              .withPathParams('id', subtaskId)
              .withHeaders({
                Authorization: 'Bearer $S{userAt}',
              })
              .expectStatus(200);
          });
    
})
    


      describe("Delete Test Case",()=>{

      it("Delete the subtask", async () => {
        const subTaskId=1
      return pactum
        .spec()
        .delete("/task/delete-subtask/{id}").withHeaders({Authorization: 'Bearer $S{userAt}'})
        .withPathParams("id",subTaskId.toString())
        .expectStatus(200);
      });

        it("Delete the MainTask", async () => {
          const subTaskId=1
          return pactum
            .spec()
            .delete("/task/delete-task/{id}").withHeaders({Authorization: 'Bearer $S{userAt}'})
            .withPathParams("id",subTaskId.toString())
            .expectStatus(200);
          });
          
})
  })
});
