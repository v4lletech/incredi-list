import { IUserRepository } from '@userManagement/Shared/Domain/Repositories/IUserRepository';
import { ListUsersQueryHandler } from '@userManagement/Features/UserListing/Application/QueryHandlers/ListUsersQueryHandler';
import { ListUsersController } from '@userManagement/Features/UserListing/Interfaces/Controllers/ListUsersController';

export class UserListingContainer {
    constructor(
        private readonly userRepository: IUserRepository
    ) {}

    public getListUsersController(): ListUsersController {
        const queryHandler = new ListUsersQueryHandler(
            this.userRepository
        );

        return new ListUsersController(queryHandler);
    }
} 