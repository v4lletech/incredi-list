import { InMemoryUserRepository } from '@users/infrastructure/repositories/InMemoryUserRepository';
import { CreateUserHandler } from '@users/application/CreateUserHandler';
import { ListUsersHandler } from '@users/application/ListUsersHandler';

export class UserContainer {
    private readonly userRepository: InMemoryUserRepository;
    public readonly createUserHandler: CreateUserHandler;
    public readonly listUsersHandler: ListUsersHandler;

    constructor() {
        this.userRepository = new InMemoryUserRepository();
        this.createUserHandler = new CreateUserHandler(this.userRepository);
        this.listUsersHandler = new ListUsersHandler(this.userRepository);
    }
} 