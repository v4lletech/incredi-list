import { UserName } from '@userManagement/Features/UserCreation/Domain/ValueObjects/UserName';
import { CommunicationType } from '@userManagement/Features/UserCreation/Domain/ValueObjects/CommunicationType';
import { InvalidUserNameError } from '@userManagement/Features/UserCreation/Domain/Errors/InvalidUserNameError';
import { InvalidCommunicationTypeError } from '@userManagement/Features/UserCreation/Domain/Errors/InvalidCommunicationTypeError';

describe('Value Objects', () => {
    describe('UserName', () => {
        it('debería crear un nombre de usuario válido', () => {
            const name = UserName.create('John Doe');
            expect(name.toString()).toBe('John Doe');
            expect(name.value).toBe('John Doe');
        });

        it('debería crear un nombre de usuario con espacios', () => {
            const name = UserName.create('John  Doe');
            expect(name.toString()).toBe('John  Doe');
        });

        it('debería crear un nombre de usuario con caracteres especiales', () => {
            const name = UserName.create('John-Doe');
            expect(name.toString()).toBe('John-Doe');
        });

        it('debería lanzar error si el nombre está vacío', () => {
            expect(() => UserName.create('')).toThrow(InvalidUserNameError);
            expect(() => UserName.create('')).toThrow('El nombre debe tener al menos 3 caracteres');
        });

        it('debería lanzar error si el nombre es muy corto', () => {
            expect(() => UserName.create('Jo')).toThrow(InvalidUserNameError);
            expect(() => UserName.create('Jo')).toThrow('El nombre debe tener al menos 3 caracteres');
        });

        it('debería lanzar error si el nombre es undefined', () => {
            expect(() => UserName.create(undefined as unknown as string)).toThrow(InvalidUserNameError);
        });

        it('debería lanzar error si el nombre es null', () => {
            expect(() => UserName.create(null as unknown as string)).toThrow(InvalidUserNameError);
        });

        it('debería lanzar error si el nombre solo contiene espacios', () => {
            expect(() => UserName.create('   ')).toThrow(InvalidUserNameError);
        });
    });

    describe('CommunicationType', () => {
        it('debería crear un tipo de comunicación válido (EMAIL)', () => {
            const type = CommunicationType.create('EMAIL');
            expect(type.toString()).toBe('EMAIL');
            expect(type.value).toBe('EMAIL');
        });

        it('debería crear un tipo de comunicación válido (SMS)', () => {
            const type = CommunicationType.create('SMS');
            expect(type.toString()).toBe('SMS');
            expect(type.value).toBe('SMS');
        });

        it('debería crear un tipo de comunicación válido (CONSOLE)', () => {
            const type = CommunicationType.create('CONSOLE');
            expect(type.toString()).toBe('CONSOLE');
            expect(type.value).toBe('CONSOLE');
        });

        it('debería lanzar error si el tipo de comunicación es inválido', () => {
            expect(() => CommunicationType.create('INVALID_TYPE')).toThrow(InvalidCommunicationTypeError);
            expect(() => CommunicationType.create('INVALID_TYPE')).toThrow('El tipo de comunicación debe ser SMS, EMAIL o CONSOLE');
        });

        it('debería lanzar error si el tipo de comunicación está vacío', () => {
            expect(() => CommunicationType.create('')).toThrow(InvalidCommunicationTypeError);
            expect(() => CommunicationType.create('')).toThrow('El tipo de comunicación debe ser SMS, EMAIL o CONSOLE');
        });

        it('debería lanzar error si el tipo de comunicación es undefined', () => {
            expect(() => CommunicationType.create(undefined as unknown as string)).toThrow(InvalidCommunicationTypeError);
        });

        it('debería lanzar error si el tipo de comunicación es null', () => {
            expect(() => CommunicationType.create(null as unknown as string)).toThrow(InvalidCommunicationTypeError);
        });

        it('debería lanzar error si el tipo de comunicación solo contiene espacios', () => {
            expect(() => CommunicationType.create('   ')).toThrow(InvalidCommunicationTypeError);
        });

        it('debería ser case sensitive', () => {
            expect(() => CommunicationType.create('email')).toThrow(InvalidCommunicationTypeError);
            expect(() => CommunicationType.create('Email')).toThrow(InvalidCommunicationTypeError);
        });
    });
}); 