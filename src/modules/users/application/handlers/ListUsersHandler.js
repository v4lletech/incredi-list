const UserRepository = require('@users/domain/repositories/UserRepository');

class ListUsersHandler {
    constructor(userRepository) {
        if (!(userRepository instanceof UserRepository)) {
            throw new Error('Invalid repository instance');
        }
        this._userRepository = userRepository;
    }

    async handle() {
        return this._userRepository.findAll();
    }
}

module.exports = ListUsersHandler; 