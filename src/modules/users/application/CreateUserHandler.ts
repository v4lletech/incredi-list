import { v4 as uuidv4 } from 'uuid';
import { User } from '@users/domain/User';
import { UserRepository } from '@users/domain/UserRepository';

export class CreateUserHandler {
    constructor(private readonly userRepository: UserRepository) {}

    async handle(name: string, communicationType: string): Promise<User> {
        const user = new User(uuidv4(), name, communicationType);
        return this.userRepository.save(user);
    }
} 