import { InMemoryUserRepository } from '@userManagement/Shared/Infrastructure/Persistence/InMemoryUserRepository';
import { UserAggregate } from '@userManagement/Features/UserCreation/Domain/Aggregates/UserAggregate';
import { UserId } from '@userManagement/Features/UserCreation/Domain/ValueObjects/UserId';
import { UserName } from '@userManagement/Features/UserCreation/Domain/ValueObjects/UserName';
import { CommunicationType } from '@userManagement/Features/UserCreation/Domain/ValueObjects/CommunicationType';

describe('InMemoryUserRepository', () => {
    let repository: InMemoryUserRepository;

    beforeEach(() => {
        repository = new InMemoryUserRepository();
    });

    it('should create a new user', async () => {
        const userId = UserId.create('123');
        const userName = UserName.create('John Doe');
        const communicationType = CommunicationType.create('EMAIL');
        const user = UserAggregate.create(userId, userName, communicationType);

        const createdUser = await repository.create(user);

        expect(createdUser).toBeInstanceOf(UserAggregate);
        expect(createdUser.id.value).toBe('123');
        expect(createdUser.name.value).toBe('John Doe');
        expect(createdUser.communicationType.value).toBe('EMAIL');
    });

    it('should find a user by id', async () => {
        const userId = UserId.create('123');
        const userName = UserName.create('John Doe');
        const communicationType = CommunicationType.create('EMAIL');
        const user = UserAggregate.create(userId, userName, communicationType);

        await repository.create(user);
        const foundUser = await repository.findById(userId);

        expect(foundUser).toBeInstanceOf(UserAggregate);
        expect(foundUser?.id.value).toBe('123');
    });

    it('should return null when user is not found', async () => {
        const userId = UserId.create('123');
        const foundUser = await repository.findById(userId);

        expect(foundUser).toBeNull();
    });

    it('should find all users', async () => {
        const user1 = UserAggregate.create(
            UserId.create('1'),
            UserName.create('John Doe'),
            CommunicationType.create('EMAIL')
        );
        const user2 = UserAggregate.create(
            UserId.create('2'),
            UserName.create('Jane Doe'),
            CommunicationType.create('SMS')
        );

        await repository.create(user1);
        await repository.create(user2);

        const users = await repository.findAll();

        expect(users).toHaveLength(2);
        expect(users[0]).toBeInstanceOf(UserAggregate);
        expect(users[1]).toBeInstanceOf(UserAggregate);
    });

    it('should update a user', async () => {
        const userId = UserId.create('123');
        const userName = UserName.create('John Doe');
        const communicationType = CommunicationType.create('EMAIL');
        const user = UserAggregate.create(userId, userName, communicationType);

        await repository.create(user);

        const newUserName = UserName.create('Jane Doe');
        const newCommunicationType = CommunicationType.create('SMS');
        const updatedUser = UserAggregate.create(userId, newUserName, newCommunicationType);

        const result = await repository.update(userId, updatedUser);

        expect(result).toBeInstanceOf(UserAggregate);
        expect(result.name.value).toBe('Jane Doe');
        expect(result.communicationType.value).toBe('SMS');
    });

    it('should throw error when updating non-existent user', async () => {
        const userId = UserId.create('123');
        const userName = UserName.create('John Doe');
        const communicationType = CommunicationType.create('EMAIL');
        const user = UserAggregate.create(userId, userName, communicationType);

        await expect(repository.update(userId, user)).rejects.toThrow('User not found');
    });

    it('should delete a user', async () => {
        const userId = UserId.create('123');
        const userName = UserName.create('John Doe');
        const communicationType = CommunicationType.create('EMAIL');
        const user = UserAggregate.create(userId, userName, communicationType);

        await repository.create(user);
        await repository.delete(userId);

        const foundUser = await repository.findById(userId);
        expect(foundUser).toBeNull();
    });
}); 