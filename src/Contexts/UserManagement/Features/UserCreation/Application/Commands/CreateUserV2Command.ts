export class CreateUserV2Command {
    constructor(
        public readonly id: string,
        public readonly name: string,
        public readonly communicationType: string
    ) {}
} 