import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { UserProfileUpdateData } from './types/user-profile.types';

@Injectable()
export class UserProfileService {
  constructor(private prisma: PrismaService) { }

  // ✅ Get user profile by ID
  async getUserProfileById(id: string) {
    if (!id) {
      throw new BadRequestException('User ID must be provided.');
    }

    const userProfile = await this.prisma.user_profile.findUnique({
      where: { id },
    });

    if (!userProfile) {
      throw new NotFoundException(`User profile with ID ${id} not found.`);
    }

    return userProfile;
  }

  // ✅ Update user profile
  async updateUserProfile(id: string, data: UserProfileUpdateData) {
    if (!id) {
      throw new BadRequestException('User ID must be provided.');
    }

    if (!data || Object.keys(data).length === 0) {
      throw new BadRequestException('Update data cannot be empty.');
    }

    return this.prisma.user_profile.update({
      where: { id },
      data,
    });
  }

  async addWaterIntake(id: string, sensorId: string, water_intake: number, time_stamp: string) {
    if (!id || !sensorId || !time_stamp || water_intake === undefined) {
      throw new BadRequestException('All parameters (id, sensorId, water_intake, time_stamp) must be provided.');
    }

    if (water_intake <= 0) {
      throw new BadRequestException('Water intake must be a positive number.');
    }

    let decodedTimestamp: string;
    try {
      decodedTimestamp = decodeURIComponent(time_stamp);
      const timestamp = new Date(decodedTimestamp);

      if (isNaN(timestamp.getTime())) {
        throw new Error('Invalid timestamp format');
      }

      return this.prisma.water_intake.create({
        data: {
          supabase_user_id: id,
          timestamp: timestamp.toISOString(),
          sensor_id: sensorId,
          water_intake_in_ml: water_intake,
        },
      });
    } catch (error) {
      throw new BadRequestException('Invalid timestamp format');
    }
  }
}
