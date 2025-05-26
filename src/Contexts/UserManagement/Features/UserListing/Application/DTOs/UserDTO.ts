export class UserDTO {
    constructor(
        public readonly id: string,
        public readonly name: string,
        public readonly communicationType: string
    ) {}
}

export class ListUsersResponseDTO {
    constructor(
        public readonly users: UserDTO[],
        public readonly total: number,
        public readonly page: number,
        public readonly limit: number,
        public readonly totalPages: number
    ) {}
} 