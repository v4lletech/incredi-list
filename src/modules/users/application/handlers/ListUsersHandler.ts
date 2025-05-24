import { User } from '@users/domain/entities/User';
import { UserRepository } from '@users/domain/repositories/UserRepository';

export class ListUsersHandler {
    private readonly _userRepository: UserRepository;

    constructor(userRepository: UserRepository) {
        if (!userRepository || typeof userRepository.findAll !== 'function') {
            throw new Error('Invalid repository instance');
        }
        this._userRepository = userRepository;
    }

    async handle(): Promise<User[]> {
        return this._userRepository.findAll();
    }
} 