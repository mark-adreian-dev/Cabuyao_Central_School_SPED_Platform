export enum ResponseStatus {
    NOT_FOUND = 404,
    SUCCESS = 200,
    BAD_REQUEST = 400,
    INTERNAL_SERVER_ERROR = 500,
    UNAUTHORIZED = 401
}
export interface LoginSuccessResponse {
    message: string,
    token: string
}