import { v4 as uuidv4 } from 'uuid';
import { User } from '@users/domain/entities/User';
import { UserRepository } from '@users/domain/repositories/UserRepository';
import { CommunicationTypeValue } from '@users/domain/value-objects/CommunicationType';

export class CreateUserHandler {
    private readonly _userRepository: UserRepository;

    constructor(userRepository: UserRepository) {
        if (!userRepository || typeof userRepository.save !== 'function') {
            throw new Error('Invalid repository instance');
        }
        this._userRepository = userRepository;
    }

    async handle(name: string, communicationType: CommunicationTypeValue): Promise<User> {
        const id = uuidv4();
        const user = await User.create(id, name, communicationType);
        await this._userRepository.save(user);
        return user;
    }
} 