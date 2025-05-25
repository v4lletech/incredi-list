import { v4 as uuidv4 } from 'uuid';
import { CreateUserCommand } from '@users/application/commands/CreateUserCommand';
import { User } from '@users/domain/entities/User';
import { UserRepository } from '@users/domain/repositories/UserRepository';
import { UserCreatedEvent } from '@users/domain/events/UserCreatedEvent';
import { eventBus } from '@users/domain/events/EventBus';

export class CreateUserCommandHandler {
    constructor(private readonly userRepository: UserRepository) {}

    async handle(command: CreateUserCommand): Promise<User> {
        const user = await User.create(uuidv4(), command.name, command.communicationType);
        const savedUser = await this.userRepository.save(user);
        
        const event = new UserCreatedEvent(savedUser);
        await eventBus.publish(event);
        
        return savedUser;
    }
} 