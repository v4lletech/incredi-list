const { v4: uuidv4 } = require('uuid');
const User = require('@users/domain/entities/User');
const UserRepository = require('@users/domain/repositories/UserRepository');

class CreateUserHandler {
    constructor(userRepository) {
        if (!(userRepository instanceof UserRepository)) {
            throw new Error('Invalid repository instance');
        }
        this._userRepository = userRepository;
    }

    async handle(name, communicationType) {
        const id = uuidv4();
        const user = await User.create(id, name, communicationType);
        await this._userRepository.save(user);
        return user;
    }
}

module.exports = CreateUserHandler; 