import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { BookmarksModule } from './bookmarks/bookmarks.module';

@Module({
  imports: [UsersModule, BookmarksModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
