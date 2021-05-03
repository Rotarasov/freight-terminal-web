export const ServerUrl: string = 'https://freight-terminal-api.herokuapp.com/'

export const UserListUrl: string = ServerUrl + 'users/'
export const UserDetailUrl: string = ServerUrl + 'users/{pk}/'

export const TokenUrl: string = UserListUrl + 'token/'
export const RefreshTokenUrl: string = UserListUrl + 'token/refresh/'
