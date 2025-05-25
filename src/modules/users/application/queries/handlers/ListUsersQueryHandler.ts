import { ListUsersQuery } from '@users/application/queries/ListUsersQuery';
import { User } from '@users/domain/entities/User';
import { UserRepository } from '@users/domain/repositories/UserRepository';

export class ListUsersQueryHandler {
    constructor(private readonly userRepository: UserRepository) {}

    async handle(query: ListUsersQuery): Promise<User[]> {
        try {
            return await this.userRepository.findAll();
        } catch (error) {
            throw new Error('Error retrieving users: ' + (error as Error).message);
        }
    }
} 