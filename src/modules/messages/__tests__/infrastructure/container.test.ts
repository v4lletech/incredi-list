import { configureMessageModule } from '@messages/infrastructure/container';
import { EventBus } from '@users/domain/events/EventBus';
import { MessageService } from '@messages/domain/services/MessageService';
import { EmailMessageStrategy } from '@messages/infrastructure/strategies/EmailMessageStrategy';
import { SmsMessageStrategy } from '@messages/infrastructure/strategies/SmsMessageStrategy';
import { ConsoleMessageStrategy } from '@messages/infrastructure/strategies/ConsoleMessageStrategy';

jest.mock('@messages/domain/services/MessageService');
jest.mock('@messages/infrastructure/strategies/EmailMessageStrategy');
jest.mock('@messages/infrastructure/strategies/SmsMessageStrategy');
jest.mock('@messages/infrastructure/strategies/ConsoleMessageStrategy');

describe('MessageModule Container', () => {
  let eventBus: EventBus;

  beforeEach(() => {
    eventBus = EventBus.getInstance();
    jest.clearAllMocks();
  });

  it('should configure message module with all strategies', () => {
    const subscribeSpy = jest.spyOn(eventBus, 'subscribe');
    
    configureMessageModule(eventBus);

    expect(MessageService).toHaveBeenCalled();
    expect(EmailMessageStrategy).toHaveBeenCalled();
    expect(SmsMessageStrategy).toHaveBeenCalled();
    expect(ConsoleMessageStrategy).toHaveBeenCalled();
    expect(subscribeSpy).toHaveBeenCalledWith('UserCreated', expect.any(Function));
  });
}); 