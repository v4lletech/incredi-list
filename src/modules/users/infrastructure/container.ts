import { InMemoryUserRepository } from './repositories/InMemoryUserRepository';
import { CreateUserHandler } from '@users/application/handlers/CreateUserHandler';
import { ListUsersHandler } from '@users/application/handlers/ListUsersHandler';

export class UserContainer {
    private readonly _userRepository: InMemoryUserRepository;
    private readonly _createUserHandler: CreateUserHandler;
    private readonly _listUsersHandler: ListUsersHandler;

    constructor() {
        this._userRepository = new InMemoryUserRepository();
        this._createUserHandler = new CreateUserHandler(this._userRepository);
        this._listUsersHandler = new ListUsersHandler(this._userRepository);
    }

    get createUserHandler(): CreateUserHandler {
        return this._createUserHandler;
    }

    get listUsersHandler(): ListUsersHandler {
        return this._listUsersHandler;
    }

    get userRepository(): InMemoryUserRepository {
        return this._userRepository;
    }
} 