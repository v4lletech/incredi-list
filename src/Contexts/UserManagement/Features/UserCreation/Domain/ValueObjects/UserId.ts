import { ValueObject } from '@shared/Domain/ValueObjects/ValueObject';
import { InvalidUserIdError } from '@userManagement/Features/UserCreation/Domain/Errors/InvalidUserIdError';

export class UserId extends ValueObject<string> {
    private constructor(value: string) {
        super(value);
    }

    public static create(value: string): UserId {
        if (!value || value.trim().length === 0) {
            throw new InvalidUserIdError('El ID del usuario no puede estar vacío');
        }
        return new UserId(value);
    }

    public toString(): string {
        return this.value;
    }
} 