// src/app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BooksModule } from './books/books.module';
import { MembersModule } from './members/members.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'rajawali',
      database: 'library_system',
      autoLoadEntities: true,
      synchronize: true, 
    }),
    BooksModule,
    MembersModule,
  ],
})
export class AppModule {}
