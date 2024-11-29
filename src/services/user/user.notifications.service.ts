import { inject, injectable } from "inversify";
import {
  CreateUserNotificationParams,
  GetUserNotificationsParams,
  IUserNotificationsRepository,
  IUserNotificationsService,
  UserNotificationsData,
} from "../../ts/interfaces/user/user.notifications.interface";
import { TYPES } from "../../constants";

@injectable()
export class UserNotificationsService implements IUserNotificationsService {
  private repo: IUserNotificationsRepository;

  constructor(@inject(TYPES.UserNotificationsRepository) repo: IUserNotificationsRepository) {
    this.repo = repo;
  }

  async createNotification(params: CreateUserNotificationParams): Promise<void> {
    return await this.repo.create(params);
  }

  async getNotifications(params: GetUserNotificationsParams): Promise<UserNotificationsData[]> {
    return await this.repo.getAll(params);
  }

  async getNotificationsCount(userId: string): Promise<number> {
    return await this.repo.getCount(userId);
  }

  async updateNotifications(userId: string): Promise<void> {
    return await this.repo.update(userId);
  }

  async deleteNotification(userId: string, notificationId: string): Promise<void> {
    return await this.repo.delete(userId, notificationId);
  }
}
