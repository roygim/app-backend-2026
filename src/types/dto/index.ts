export interface CreateUser {
    firstname?: string;
    lastname?: string;
    email: string;
    password: string;
}

export interface UpdateUser {
    firstname?: string;
    lastname?: string;
}