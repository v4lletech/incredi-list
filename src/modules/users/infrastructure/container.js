const InMemoryUserRepository = require('@users/infrastructure/repositories/InMemoryUserRepository');
const CreateUserHandler = require('@users/application/handlers/CreateUserHandler');
const ListUsersHandler = require('@users/application/handlers/ListUsersHandler');

class UserContainer {
    constructor() {
        this._userRepository = new InMemoryUserRepository();
        this._createUserHandler = new CreateUserHandler(this._userRepository);
        this._listUsersHandler = new ListUsersHandler(this._userRepository);
    }

    get createUserHandler() {
        return this._createUserHandler;
    }

    get listUsersHandler() {
        return this._listUsersHandler;
    }

    get userRepository() {
        return this._userRepository;
    }
}

module.exports = UserContainer; 