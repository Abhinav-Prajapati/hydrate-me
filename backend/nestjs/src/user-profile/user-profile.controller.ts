import { Controller, Get, Put, Param, Body, Post, Req, Query } from '@nestjs/common';
import { Request } from 'express';
import { UserProfileService } from "./user-profile.service";
import { UserProfileUpdateData } from './types/user-profile.types';

@Controller('/user')
export class UserProfileController {
  constructor(private userProfileService: UserProfileService) { }

  @Get('/profile')
  async getUserProfile(@Req() req: Request) {
    console.log(req.body)
    return this.userProfileService.getUserProfileById(req.user?.id);
  }

  @Put('/set_daily_goal')
  async setDailyGoal(
    @Query('dailyGoal') goal: number, @Req() req: Request
  ) {

    const data: UserProfileUpdateData = {
      daily_goal: Number(goal)
    }
    await this.userProfileService.updateUserProfile(req.user?.id, data)
    return {
      message: 'Daily Goal Updated successfully',
      daily_goal: data.daily_goal
    }
  }

  @Get('/get_water_attributes')
  async getWaterAttributes(
    @Req() req: Request
  ) {

    const { currect_water_level_in_bottle, daily_goal, todays_water_intake_in_ml, is_bottle_on_dock } = await this.userProfileService.getUserProfileById(req.user?.id)
    return {
      currect_water_level_in_bottle: currect_water_level_in_bottle,
      daily_goal: daily_goal,
      todays_water_intake_in_ml: todays_water_intake_in_ml,
      is_bottle_on_dock: is_bottle_on_dock
    }
  }

  @Post('/add_intake')
  async addIntake(@Body() body: { sensor_id: string, intake: number, time: string }, @Req() req: Request) {
    return await this.userProfileService.addWaterIntake(req.user?.id, body.sensor_id, body.intake, body.time)
  }
}
