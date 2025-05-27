import { UserName } from '@userManagement/Features/UserCreation/Domain/ValueObjects/UserName';

export interface IMessageStrategy {
    sendMessage(userId: string, userName: string, message: string): Promise<void>;
} 