export class CreateUserV1Command {
    constructor(
        public readonly name: string,
        public readonly communicationType: string
    ) {}
} 