const UserRepository = require('@users/domain/repositories/UserRepository');
const User = require('@users/domain/entities/User');

class MockUserRepository extends UserRepository {
    constructor() {
        super();
        this._users = new Map();
    }

    async save(user) {
        this._users.set(user.id, {
            id: user.id,
            name: user.name,
            communicationType: user.communicationType
        });
        return user;
    }

    async findById(id) {
        const userData = this._users.get(id);
        if (!userData) return null;

        return new User(
            userData.id,
            userData.name,
            userData.communicationType
        );
    }

    async findAll() {
        return Array.from(this._users.values()).map(userData => 
            new User(
                userData.id,
                userData.name,
                userData.communicationType
            )
        );
    }

    async delete(id) {
        return this._users.delete(id);
    }

    // Métodos de utilidad para pruebas
    clear() {
        this._users.clear();
    }

    getUsers() {
        return Array.from(this._users.values());
    }
}

module.exports = MockUserRepository; 