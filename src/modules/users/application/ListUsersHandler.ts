import { User } from '@users/domain/User';
import { UserRepository } from '@users/domain/UserRepository';

export class ListUsersHandler {
    constructor(private readonly userRepository: UserRepository) {}

    async handle(): Promise<User[]> {
        return this.userRepository.findAll();
    }
} 