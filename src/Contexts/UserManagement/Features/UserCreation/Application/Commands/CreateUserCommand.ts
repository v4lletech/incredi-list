export class CreateUserCommand {
    constructor(
        public readonly id: string,
        public readonly name: string,
        public readonly communicationType: string
    ) {}
} 