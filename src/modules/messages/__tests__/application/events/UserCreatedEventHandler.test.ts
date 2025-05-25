import { UserCreatedEventHandler } from '@messages/application/events/UserCreatedEventHandler';
import { UserCreatedEvent } from '@users/domain/events/UserCreatedEvent';
import { User } from '@users/domain/entities/User';
import { SendWelcomeMessageCommandHandler } from '@messages/application/commands/handlers/SendWelcomeMessageCommandHandler';
import { MessageChannel } from '@messages/domain/value-objects/MessageChannel';

describe('UserCreatedEventHandler', () => {
  let handler: UserCreatedEventHandler;
  let mockCommandHandler: jest.Mocked<SendWelcomeMessageCommandHandler>;

  beforeEach(() => {
    mockCommandHandler = {
      handle: jest.fn()
    } as any;
    handler = new UserCreatedEventHandler(mockCommandHandler);
  });

  it('should handle user created event and send welcome message', async () => {
    const user = new User('user123', 'John Doe', MessageChannel.EMAIL);
    const event = new UserCreatedEvent(user);

    await handler.handle(event);

    expect(mockCommandHandler.handle).toHaveBeenCalledWith(expect.objectContaining({
      userId: 'user123',
      userName: 'John Doe',
      communicationType: MessageChannel.EMAIL
    }));
  });
}); 