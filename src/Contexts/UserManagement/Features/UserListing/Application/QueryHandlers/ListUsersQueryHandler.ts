import { IUserRepository } from '@userManagement/Shared/Domain/Repositories/IUserRepository';
import { ListUsersQuery } from '@userManagement/Features/UserListing/Application/Queries/ListUsersQuery';
import { ListUsersResponseDTO, UserDTO } from '@userManagement/Features/UserListing/Application/DTOs/UserDTO';

export class ListUsersQueryHandler {
    constructor(
        private readonly userRepository: IUserRepository
    ) {}

    async execute(query: ListUsersQuery): Promise<ListUsersResponseDTO> {
        const { page, limit } = query;
        const skip = (page - 1) * limit;

        // Obtener todos los usuarios y manejar la paginación en memoria
        const allUsers = await this.userRepository.findAll();
        const total = allUsers.length;
        const totalPages = Math.ceil(total / limit);

        // Aplicar paginación
        const paginatedUsers = allUsers.slice(skip, skip + limit);

        const userDTOs = paginatedUsers.map(user => new UserDTO(
            user.id.value,
            user.name.value,
            user.communicationType.value
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