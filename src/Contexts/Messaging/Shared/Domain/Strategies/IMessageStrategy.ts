import { UserName } from '@userManagement/Shared/Domain/ValueObjects/UserName';

export interface IMessageStrategy {
    sendMessage(userId: string, userName: string, message: string): Promise<void>;
} 