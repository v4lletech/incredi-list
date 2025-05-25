import { MessageService } from '@messages/domain/services/MessageService';
import { MessageStrategy } from '@messages/domain/strategies/MessageStrategy';
import { MessageChannel } from '@messages/domain/value-objects/MessageChannel';

describe('MessageService', () => {
  let messageService: MessageService;
  let mockStrategy: jest.Mocked<MessageStrategy>;

  beforeEach(() => {
    messageService = new MessageService();
    mockStrategy = {
      send: jest.fn(),
      getChannel: jest.fn().mockReturnValue(MessageChannel.EMAIL)
    };
  });

  it('should register a strategy', () => {
    messageService.registerStrategy(mockStrategy);
    expect(mockStrategy.getChannel()).toBe(MessageChannel.EMAIL);
  });

  it('should send message using registered strategy', async () => {
    messageService.registerStrategy(mockStrategy);
    const message = 'Test message';
    const recipient = 'test@example.com';

    await messageService.sendMessage(MessageChannel.EMAIL, message, recipient);

    expect(mockStrategy.send).toHaveBeenCalledWith(message, recipient);
  });

  it('should throw error when sending message with unregistered channel', async () => {
    const message = 'Test message';
    const recipient = 'test@example.com';

    await expect(
      messageService.sendMessage(MessageChannel.SMS, message, recipient)
    ).rejects.toThrow(`No strategy registered for channel: ${MessageChannel.SMS}`);
  });
}); 