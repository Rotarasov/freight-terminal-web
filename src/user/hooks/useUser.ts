import { fillUrl, snakeToCamel } from '../../utils';
import { UserDetailUrl } from '../../constants';
import { useEffect, useState } from 'react';
import { User, PassToServerUser } from '../InfoForm';
import axios, { AxiosRequestConfig } from 'axios';

export type FetchUserResult = {
    loading: boolean,
    user?: User,
    setUser: (user: User) => void
}

export const useUser = (id: number, accessToken: string): FetchUserResult => {
    const [loading, setLoading] = useState<boolean>(false)
    const [user, setUser] = useState<User | undefined>(undefined)

    useEffect(() => {
        setLoading(true)
        const config: AxiosRequestConfig = {
            headers: {
                Authorization: "Bearer " + accessToken
            }
        }
        axios.get(fillUrl(UserDetailUrl, { pk: id.toString() }), config)
            .then(response => {
                setUser(snakeToCamel<PassToServerUser, User>(response.data))
            })
            .finally(() => setLoading(false))
            .catch((error) => alert('Fetch error\n' + error))
    }, [])

    return {
        loading,
        user,
        setUser
    }
}