export class EditUserCommand {
    constructor(
        public readonly id: string,
        public readonly name?: string,
        public readonly communicationType?: string
    ) {}
} 