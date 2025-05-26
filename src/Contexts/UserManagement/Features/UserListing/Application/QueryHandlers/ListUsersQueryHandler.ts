import { IUserRepository } from '@userManagement/Shared/Domain/Repositories/IUserRepository';
import { ListUsersQuery } from '../Queries/ListUsersQuery';
import { ListUsersResponseDTO, UserDTO } from '../DTOs/UserDTO';

export class ListUsersQueryHandler {
    constructor(
        private readonly userRepository: IUserRepository
    ) {}

    async execute(query: ListUsersQuery): Promise<ListUsersResponseDTO> {
        const { page, limit } = query;
        const skip = (page - 1) * limit;

        const [users, total] = await Promise.all([
            this.userRepository.findAll(skip, limit),
            this.userRepository.count()
        ]);

        const totalPages = Math.ceil(total / limit);

        const userDTOs = users.map(user => new UserDTO(
            user.id.toString(),
            user.name.toString(),
            user.communicationType.toString()
        ));

        return new ListUsersResponseDTO(
            userDTOs,
            total,
            page,
            limit,
            totalPages
        );
    }
} 