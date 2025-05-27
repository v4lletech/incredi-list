import { UserName } from '@userManagement/Features/UserCreation/Domain/ValueObjects/UserName';

export interface IMessageStrategy {
    sendMessage(userName: UserName): Promise<void>;
} 