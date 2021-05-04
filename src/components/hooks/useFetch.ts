import axios, { AxiosRequestConfig } from 'axios';
import { useEffect, useState } from 'react';
import { RefreshTokenUrl } from '../../constants';
import { camelToSnake, snakeToCamel } from '../../utils';

export type UseFetch<T> = {
    loading: boolean,
    data?: T
}

export function useFetch<T>(config: AxiosRequestConfig): UseFetch<T> {
    const [loading, setLoading] = useState<boolean>(false)
    const [data, setData] = useState<T | undefined>(undefined)

    useEffect(() => {
        setLoading(true)
        axios.request(config)
            .then(response => {
                setData(snakeToCamel<T>(response.data))
            })
            .finally(() => setLoading(false))
            .catch((error) => alert('Fetch error\n' + error))
    }, [config])

    return {
        loading,
        data
    }
}

export type UseFetchList<T extends any[]> = {
    loading: boolean,
    data?: T
}

export function useFetchList<T extends any[]>(config: AxiosRequestConfig): UseFetch<T> {
    const [loading, setLoading] = useState<boolean>(false)
    const [data, setData] = useState<T | undefined>(undefined)

    useEffect(() => {
        setLoading(true)
        axios.request(config)
            .then(response => {
                setData(response.data.map((element: T) => snakeToCamel<T>(element)))
            })
            .finally(() => setLoading(false))
            .catch((error) => alert('Fetch error\n' + error))
    }, [config])

    return {
        loading,
        data
    }
}