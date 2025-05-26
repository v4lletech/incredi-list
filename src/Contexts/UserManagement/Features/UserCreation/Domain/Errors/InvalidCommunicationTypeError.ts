export class InvalidCommunicationTypeError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'InvalidCommunicationTypeError';
    }
} 