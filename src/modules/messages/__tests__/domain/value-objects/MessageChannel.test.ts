import { MessageChannel, validateMessageChannel, InvalidMessageChannelError } from '@messages/domain/value-objects/MessageChannel';

describe('MessageChannel', () => {
  describe('validateMessageChannel', () => {
    it('should return the channel when valid', () => {
      expect(validateMessageChannel('EMAIL')).toBe(MessageChannel.EMAIL);
      expect(validateMessageChannel('SMS')).toBe(MessageChannel.SMS);
      expect(validateMessageChannel('CONSOLE')).toBe(MessageChannel.CONSOLE);
    });

    it('should throw InvalidMessageChannelError for invalid channels', () => {
      expect(() => validateMessageChannel('INVALID')).toThrow(InvalidMessageChannelError);
      expect(() => validateMessageChannel('')).toThrow(InvalidMessageChannelError);
    });
  });
}); 