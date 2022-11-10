import * as pactum from 'pactum';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { CreateUserDto } from '../src/users/dto/create-user.dto';

describe('Bookmark App E2E Testing', function () {
  let app: INestApplication;

  jest.setTimeout(15000);

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

    await app.init();
    await app.listen(process.env.TEST_PORT);
    pactum.request.setBaseUrl(`http://localhost:${process.env.TEST_PORT}`);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Users Module', function () {
    const newUser: CreateUserDto = {
      username: 'john-doe',
      email: 'johndoe@localhost.com',
      password: 'john',
    };
    describe('Register a new user.', function () {
      it('should return a new user', function () {
        return pactum
          .spec()
          .post('/users/signup')
          .withBody(newUser)
          .expectStatus(201)
          .inspect();
      });
    });
  });
});
