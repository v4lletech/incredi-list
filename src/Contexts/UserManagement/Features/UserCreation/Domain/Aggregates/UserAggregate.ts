import { AggregateRoot } from '@shared/Domain/Common/AggregateRoot';
import { UserName } from '@userManagement/Features/UserCreation/Domain/ValueObjects/UserName';
import { CommunicationType } from '@userManagement/Features/UserCreation/Domain/ValueObjects/CommunicationType';
import { UserCreatedEvent } from '@userManagement/Features/UserCreation/Domain/Events/UserCreatedEvent';
import { UserId } from '@userManagement/Features/UserCreation/Domain/ValueObjects/UserId';

export class UserAggregate extends AggregateRoot {
    private readonly _id: UserId;
    private readonly _name: UserName;
    private readonly _communicationType: CommunicationType;

    private constructor(id: UserId, name: UserName, communicationType: CommunicationType) {
        super();
        this._id = id;
        this._name = name;
        this._communicationType = communicationType;
    }

    public static create(id: UserId, name: UserName, communicationType: CommunicationType): UserAggregate {
        const user = new UserAggregate(id, name, communicationType);
        user.addDomainEvent(new UserCreatedEvent(id, name, communicationType));
        return user;
    }

    public get id(): UserId {
        return this._id;
    }

    public get name(): UserName {
        return this._name;
    }

    public get communicationType(): CommunicationType {
        return this._communicationType;
    }
} 