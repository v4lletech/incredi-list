class CreateUserCommand {
    constructor(name, communicationType) {
        this.name = name;
        this.communicationType = communicationType;
    }
}

module.exports = CreateUserCommand; 