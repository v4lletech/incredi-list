export class User {
    constructor(
        public readonly id: string,
        public readonly name: string,
        public readonly communicationType: string
    ) {}

    static create(id: string, name: string, communicationType: string): User {
        if (!name || name.length < 3) {
            throw new Error('El nombre debe tener al menos 3 caracteres');
        }

        if (!['SMS', 'EMAIL', 'CONSOLE'].includes(communicationType)) {
            throw new Error('El tipo de comunicación debe ser SMS, EMAIL o CONSOLE');
        }

        return new User(id, name, communicationType);
    }
} 