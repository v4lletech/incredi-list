import { InMemoryUserRepository } from '@users/infrastructure/repositories/InMemoryUserRepository';
import { CreateUserCommandHandler } from '@users/application/commands/handlers/CreateUserCommandHandler';
import { ListUsersQueryHandler } from '@users/application/queries/handlers/ListUsersQueryHandler';

export class UserContainer {
    private readonly userRepository: InMemoryUserRepository;
    public readonly createUserCommandHandler: CreateUserCommandHandler;
    public readonly listUsersQueryHandler: ListUsersQueryHandler;

    constructor() {
        this.userRepository = new InMemoryUserRepository();
        this.createUserCommandHandler = new CreateUserCommandHandler(this.userRepository);
        this.listUsersQueryHandler = new ListUsersQueryHandler(this.userRepository);
    }
} 