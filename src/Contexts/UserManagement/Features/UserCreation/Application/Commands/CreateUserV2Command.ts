export class CreateUserV2Command {
    constructor(
        public readonly name: string,
        public readonly communicationType: string,
        public readonly preferences: Record<string, any>
    ) {}
} 