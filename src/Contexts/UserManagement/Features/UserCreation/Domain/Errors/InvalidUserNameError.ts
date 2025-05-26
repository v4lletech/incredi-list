export class InvalidUserNameError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'InvalidUserNameError';
    }
} 