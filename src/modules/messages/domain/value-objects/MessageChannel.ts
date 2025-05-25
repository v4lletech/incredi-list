export enum MessageChannel {
  SMS = 'SMS',
  EMAIL = 'EMAIL',
  CONSOLE = 'CONSOLE'
}

export class InvalidMessageChannelError extends Error {
  constructor(channel: string) {
    super(`Invalid message channel: ${channel}`);
    this.name = 'InvalidMessageChannelError';
  }
}

export function validateMessageChannel(channel: string): MessageChannel {
  if (!Object.values(MessageChannel).includes(channel as MessageChannel)) {
    throw new InvalidMessageChannelError(channel);
  }
  return channel as MessageChannel;
} 