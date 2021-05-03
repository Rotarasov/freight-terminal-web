import axios, { AxiosRequestConfig } from 'axios';
import { useState } from 'react';
import { TokenUrl } from '../../constants';
import { useAxios } from './useAxios';


export type Credentials = {
    email: string,
    password: string
}

export type FetchAuthResult = {
    accessToken: string,
    refreshToken: string,
    userId: number
}

export type SendRefreshData = {
    refresh_token: string
}

export type AuthResult = {
    loading: boolean,
    auth?: FetchAuthResult
}

export const useAuth = (credentials: Credentials): AuthResult => {
    const config: AxiosRequestConfig = {
        url: TokenUrl,
        method: 'POST',
        data: credentials
    }
    const { loading, data } = useAxios<FetchAuthResult>(config)
    return {
        loading,
        auth: data
    }
}