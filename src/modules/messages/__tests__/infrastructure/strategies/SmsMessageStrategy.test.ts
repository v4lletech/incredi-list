import { SmsMessageStrategy } from '@messages/infrastructure/strategies/SmsMessageStrategy';
import { MessageChannel } from '@messages/domain/value-objects/MessageChannel';

describe('SmsMessageStrategy', () => {
  let strategy: SmsMessageStrategy;

  beforeEach(() => {
    strategy = new SmsMessageStrategy();
  });

  it('should return SMS as channel', () => {
    expect(strategy.getChannel()).toBe(MessageChannel.SMS);
  });

  it('should send message via SMS', async () => {
    const consoleSpy = jest.spyOn(console, 'log');
    const message = 'Test message';
    const recipient = '+1234567890';

    await strategy.send(message, recipient);

    expect(consoleSpy).toHaveBeenCalledWith(`[SMS] Sending to ${recipient}: ${message}`);
    consoleSpy.mockRestore();
  });
}); 