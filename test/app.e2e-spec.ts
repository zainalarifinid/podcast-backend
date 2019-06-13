import * as request from 'supertest';
import { TestingModule, Test } from "@nestjs/testing";
import { UsersModule } from "../src/User";
import { UserService } from "../src/User/services/UserService";
import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/appModule';

const userServiceProvider = {
    provide: 'PodcastApp.UserService',
    useClass: UserService,
}

describe('UserControl (e2e)', () => {

    let app: INestApplication;
    let userService = { findAll: () => [ { id: 1, username: "zainal1", email: "zainal1@online-pajak.com" } ] };

    beforeAll( async () => {
        // const moduleFixture: TestingModule = await Test.createTestingModule({
        //     imports: [ UsersModule ],
        // })
        // .overrideProvider(userServiceProvider)
        // .useValue(userService)
        // .compile();

        // app = moduleFixture.createNestApplication();
        app = await NestFactory.create(AppModule);
        console.log(app);
        await app.init();

    });

    it('/ (GET)', async () => {
          const response = await request(app.getHttpServer())
            .get('/api/v1/users')
            .set('accept', 'application/json')
            .set('content-type', 'application/json')
            .send();

        expect(response.status).toMatchInlineSnapshot();
        expect(response.body).toMatchInlineSnapshot();

        // return request(app.getHttpServer())
        //     .get('/user')
        //     .expect(200)
        //     .expect({
        //         data: userService.findAll(),
        //     });

    });

    afterAll( async() =>{
        await app.close();
    } )

});
