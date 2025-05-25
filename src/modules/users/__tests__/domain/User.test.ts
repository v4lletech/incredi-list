import { User } from '@users/domain/entities/User';
import { CommunicationType } from '@users/domain/value-objects/CommunicationType';

describe('User', () => {
    it('should create a user with the provided properties', () => {
        const id = '123';
        const name = 'John Doe';
        const communicationType = CommunicationType.EMAIL;

        const user = new User(id, name, communicationType);

        expect(user.id).toBe(id);
        expect(user.name).toBe(name);
        expect(user.communicationType).toBe(communicationType);
    });
}); 