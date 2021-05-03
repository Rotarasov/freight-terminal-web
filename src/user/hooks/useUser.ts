import { useAxios } from '../../components/hooks/useAxios';
import { fillUrl } from '../../utils';
import { UserDetailUrl } from '../../constants';
import { useState } from 'react';
import { UserInfoProps, User } from '../InfoForm';
import { FetchAuthResult } from '../../components/hooks/useAuth';
import { AxiosRequestConfig } from 'axios';

export type FetchUserResult = {
    user: User
}

export const useUser = (id: number, auth?: FetchAuthResult): UserInfoProps => {
    const config: AxiosRequestConfig = {
        url: fillUrl(UserDetailUrl, { pk: id.toString() }),
        headers: {
            Authentication: 'Bearer ' + auth?.accessToken
        }
    }
    var { loading, data } = useAxios<FetchUserResult>(config)
    const [user, setUser] = useState<User | undefined>(data?.user)
    return {
        loading,
        user,
        setUser
    }
}