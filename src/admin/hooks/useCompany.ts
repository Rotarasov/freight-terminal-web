import axios, { AxiosRequestConfig } from "axios";
import { useEffect, useState } from "react";
import { CompanyDetailUrl, CompanyTypesUrl } from "../../constants";
import { fillUrl, getAuthHeaders, snakeToCamel } from "../../utils";
import { Company, PassToServerTypeChoice, TypeChoice } from "../CompanyDetail";

export type FetchCompanyResult = {
    loading: boolean,
    company?: Company,
    setCompany: (company: Company) => void,
    typeChoices: TypeChoice[] | [],
}

export const useCompany = (id: string): FetchCompanyResult => {
    const accessToken = localStorage.getItem('access') || ""

    const [loading, setLoading] = useState<boolean>(false)
    const [typeChoices, setTypeChoices] = useState<TypeChoice[] | []>([])
    const [company, setCompany] = useState<Company | undefined>(undefined)

    useEffect(() => {
        setLoading(true)
        const config: AxiosRequestConfig = {
            headers: getAuthHeaders(accessToken)
        }
        axios.get(CompanyTypesUrl, config)
            .then((response) => {
                setTypeChoices(response.data.map(
                    (typeChoice: PassToServerTypeChoice) => snakeToCamel<TypeChoice>(typeChoice)
                ))
            })
            .catch((error) => alert('Fetch error\n' + error))
        axios.get(fillUrl(CompanyDetailUrl, { pk: id }), config)
            .then(response => setCompany(snakeToCamel<Company>(response.data)))
            .finally(() => setLoading(false))
            .catch((error) => alert('Fetch error\n' + error))
    }, [])

    return {
        loading,
        company,
        setCompany,
        typeChoices
    }
}