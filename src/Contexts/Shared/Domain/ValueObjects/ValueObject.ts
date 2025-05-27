export abstract class ValueObject<T> {
    protected readonly _value: T;

    protected constructor(value: T) {
        this._value = value;
    }

    public get value(): T {
        return this._value;
    }

    public equals(other: ValueObject<T>): boolean {
        return this._value === other._value;
    }
} 