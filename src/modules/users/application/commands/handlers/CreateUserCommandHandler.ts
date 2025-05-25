import { CreateUserCommand } from '../CreateUserCommand';
import { User } from '@users/domain/entities/User';
import { UserRepository } from '@users/domain/repositories/UserRepository';
import { CommunicationType } from '@users/domain/value-objects/CommunicationType';

export class CreateUserCommandHandler {
    constructor(private readonly userRepository: UserRepository) {}

    async handle(command: CreateUserCommand): Promise<User> {
        const user = User.create(command.name, command.communicationType as CommunicationType);
        return this.userRepository.save(user);
    }
} 