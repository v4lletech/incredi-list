import { ValueObject } from '@shared/Domain/Common/ValueObject';
import { InvalidUserNameError } from '@userManagement/Features/UserCreation/Domain/Errors/InvalidUserNameError';

export class UserName extends ValueObject<string> {
    private constructor(value: string) {
        super(value);
    }

    public static create(value: string): UserName {
        if (!value || value.trim().length < 3) {
            throw new InvalidUserNameError('El nombre debe tener al menos 3 caracteres');
        }
        return new UserName(value);
    }

    public toString(): string {
        return this.value;
    }
} 