export interface IMessageStrategy {
    sendMessage(userId: string, userName: string, message: string): Promise<void>;
} 