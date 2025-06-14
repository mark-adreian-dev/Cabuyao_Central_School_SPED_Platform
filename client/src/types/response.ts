export enum ResponseStatus {
    NOT_FOUND = 404,
    SUCCESS = 200,
    CSRF_MISMATCH = 419
}
export interface LoginSuccessResponse {
    message: string,
    token: string
}