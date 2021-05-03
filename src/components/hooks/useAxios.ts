import axios, { AxiosRequestConfig } from 'axios';
import { useEffect, useState } from 'react';
import { RefreshTokenUrl } from '../../constants';
import { camelToSnake, snakeToCamel } from '../../utils';
import { SendRefreshData } from './useAuth';

export type UseAxios<T> = {
    loading: boolean,
    data?: T
}

export function useAxios<T>(config: AxiosRequestConfig): UseAxios<T> {
    const [loading, setLoading] = useState<boolean>(false)
    const [data, setData] = useState<T | undefined>(undefined)

    useEffect(() => {
        const sendRequest = async () => {
            setLoading(true)
            const refresh = camelToSnake<SendRefreshData>({
                refreshToken: 
            })
            axios.post(RefreshTokenUrl, data = camelToSnake<SendRefreshData>({ refreshToken: }))
            axios(config)
                .then(response => setData(snakeToCamel<T>(response.data)))
                .finally(() => setLoading(false))
                .catch((error) => alert('Fetch error\n' + error))
        }
    }, [config])

    return {
        loading,
        data
    }
}