import { SendWelcomeMessageCommandHandler } from '@messages/application/commands/handlers/SendWelcomeMessageCommandHandler';
import { SendWelcomeMessageCommand } from '@messages/application/commands/SendWelcomeMessageCommand';
import { MessageService } from '@messages/domain/services/MessageService';
import { MessageChannel } from '@messages/domain/value-objects/MessageChannel';

describe('SendWelcomeMessageCommandHandler', () => {
  let handler: SendWelcomeMessageCommandHandler;
  let mockMessageService: jest.Mocked<MessageService>;

  beforeEach(() => {
    mockMessageService = {
      sendMessage: jest.fn(),
      registerStrategy: jest.fn()
    } as any;
    handler = new SendWelcomeMessageCommandHandler(mockMessageService);
  });

  it('should send welcome message', async () => {
    const command = new SendWelcomeMessageCommand(
      'user123',
      'John Doe',
      MessageChannel.EMAIL
    );

    await handler.handle(command);

    expect(mockMessageService.sendMessage).toHaveBeenCalledWith(
      MessageChannel.EMAIL,
      '¡Bienvenido John Doe a nuestra plataforma!',
      'user123'
    );
  });
}); 