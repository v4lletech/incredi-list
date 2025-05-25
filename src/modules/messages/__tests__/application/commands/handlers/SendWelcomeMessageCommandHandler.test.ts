import { SendWelcomeMessageCommandHandler } from '@messages/application/commands/handlers/SendWelcomeMessageCommandHandler';
import { MessageService } from '@messages/domain/services/MessageService';
import { MessageChannel } from '@messages/domain/value-objects/MessageChannel';
import { SendWelcomeMessageCommand } from '@messages/application/commands/SendWelcomeMessageCommand';

describe('SendWelcomeMessageCommandHandler', () => {
  let handler: SendWelcomeMessageCommandHandler;
  let messageService: jest.Mocked<MessageService>;

  beforeEach(() => {
    messageService = {
      sendMessage: jest.fn(),
      registerStrategy: jest.fn()
    } as any;

    handler = new SendWelcomeMessageCommandHandler(messageService);
  });

  it('should send welcome message', async () => {
    const command: SendWelcomeMessageCommand = {
      userId: '123',
      userName: 'John Doe',
      communicationType: MessageChannel.EMAIL
    };

    await handler.handle(command);

    expect(messageService.sendMessage).toHaveBeenCalledWith({
      channel: MessageChannel.EMAIL,
      content: 'Welcome John Doe!',
      recipient: '123'
    });
  });
}); 