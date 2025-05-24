class FindUserByIdHandler {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    async handle(query) {
        const user = await this.userRepository.findById(query.id);
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    }
}

module.exports = FindUserByIdHandler; 