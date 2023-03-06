// import { Test, TestingModule } from '@nestjs/testing';
// import { AppModule } from '../src/app.module';
// import * as pactum from 'pactum';
// import { INestApplication, ValidationPipe } from '@nestjs/common';
// import { DataSource } from 'typeorm';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { ConfigModule, ConfigService } from '@nestjs/config';

// describe('App e2e', () => {
//   let app: INestApplication;
//   let connection: DataSource;

//   describe('AppModule', () => {
//     let app: INestApplication;
//     let moduleFixture: TestingModule;

//     beforeAll(async () => {
//       moduleFixture = await Test.createTestingModule({
//         imports: [
//           AppModule,
//           TypeOrmModule.forRootAsync({
//             imports: [ConfigModule],
//             useFactory: async (configService: ConfigService) => ({
//               type: 'postgres',
//               host: configService.get('POSTGRES_HOST'),
//               port: configService.get('POSTGRES_PORT'),
//               username: configService.get('POSTGRES_USER'),
//               password: configService.get('POSTGRES_PASSWORD'),
//               database: configService.get('POSTGRES_DB'),
//               entities: [__dirname + '/../**/*.entity{.ts,.js}'],
//               synchronize: true,
//             }),
//             inject: [ConfigService],
//           }),
//         ],
//       }).compile();

//       app = moduleFixture.createNestApplication();
//       await app.init();
//     });

//     afterAll(async () => {
//       await app.close();
//       await moduleFixture.close();
//     });

//     it('should be defined', () => {
//       expect(app).toBeDefined();
//     });
//   });
// });
