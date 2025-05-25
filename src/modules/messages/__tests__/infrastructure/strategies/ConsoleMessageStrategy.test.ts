import { ConsoleMessageStrategy } from '@messages/infrastructure/strategies/ConsoleMessageStrategy';
import { MessageChannel } from '@messages/domain/value-objects/MessageChannel';

describe('ConsoleMessageStrategy', () => {
  let strategy: ConsoleMessageStrategy;

  beforeEach(() => {
    strategy = new ConsoleMessageStrategy();
  });

  it('should return CONSOLE as channel', () => {
    expect(strategy.getChannel()).toBe(MessageChannel.CONSOLE);
  });

  it('should send message to console', async () => {
    const consoleSpy = jest.spyOn(console, 'log');
    const message = 'Test message';
    const recipient = 'user123';

    await strategy.send(message, recipient);

    expect(consoleSpy).toHaveBeenCalledWith(`[CONSOLE] Message for ${recipient}: ${message}`);
    consoleSpy.mockRestore();
  });
}); 