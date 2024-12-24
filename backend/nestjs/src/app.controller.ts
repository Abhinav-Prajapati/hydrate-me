import { Controller, Get, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('users')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getUsers() {
    return await this.appService.getUsers();
  }

  @Post()
  async addUser(@Body() body: { name: string; email: string }) {
    await this.appService.addUser(body.name, body.email);
    return { message: 'User added successfully' };
  }
}
