import { UserCreatedEventHandler } from '@messages/application/events/UserCreatedEventHandler';
import { UserCreatedEvent } from '@users/domain/events/UserCreatedEvent';
import { User } from '@users/domain/entities/User';
import { SendWelcomeMessageCommandHandler } from '@messages/application/commands/handlers/SendWelcomeMessageCommandHandler';
import { MessageChannel } from '@messages/domain/value-objects/MessageChannel';
import { CommunicationType } from '@users/domain/value-objects/CommunicationType';

describe('UserCreatedEventHandler', () => {
  let handler: UserCreatedEventHandler;
  let mockCommandHandler: jest.Mocked<SendWelcomeMessageCommandHandler>;

  beforeEach(() => {
    mockCommandHandler = {
      handle: jest.fn()
    } as any;
    handler = new UserCreatedEventHandler(mockCommandHandler);
  });

  it('should handle user created event', async () => {
    const user = new User('123', 'John Doe', CommunicationType.EMAIL);
    const event = new UserCreatedEvent(user);

    await handler.handle(event);

    expect(mockCommandHandler.handle).toHaveBeenCalledWith(expect.objectContaining({
      userId: user.id,
      userName: user.name,
      communicationType: MessageChannel.EMAIL
    }));
  });
}); 