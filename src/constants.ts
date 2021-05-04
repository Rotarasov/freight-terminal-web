export const ServerUrl: string = 'http://localhost:8000/'

export const UserListUrl: string = ServerUrl + 'users/'
export const UserDetailUrl: string = ServerUrl + 'users/{pk}/'

export const TokenUrl: string = UserListUrl + 'token/'
export const RefreshTokenUrl: string = UserListUrl + 'token/refresh/'

export const CompanyListUrl: string = ServerUrl + 'companies/'
export const CompanyTypesUrl: string = ServerUrl + 'companies/types/'
export const CompanyDetailUrl: string = ServerUrl + 'companies/{pk}/'

export const BackupDBUrl: string = ServerUrl + 'backup/'
export const RestoreDBUrl: string = ServerUrl + 'restore/'