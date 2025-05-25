import { EmailMessageStrategy } from '@messages/infrastructure/strategies/EmailMessageStrategy';
import { MessageChannel } from '@messages/domain/value-objects/MessageChannel';

describe('EmailMessageStrategy', () => {
  let strategy: EmailMessageStrategy;

  beforeEach(() => {
    strategy = new EmailMessageStrategy();
  });

  it('should return EMAIL as channel', () => {
    expect(strategy.getChannel()).toBe(MessageChannel.EMAIL);
  });

  it('should send message via email', async () => {
    const consoleSpy = jest.spyOn(console, 'log');
    const message = 'Test message';
    const recipient = 'test@example.com';

    await strategy.send(message, recipient);

    expect(consoleSpy).toHaveBeenCalledWith(`[EMAIL] Sending to ${recipient}: ${message}`);
    consoleSpy.mockRestore();
  });
}); 