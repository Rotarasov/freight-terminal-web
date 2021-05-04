import axios, { AxiosRequestConfig } from "axios";
import { useEffect, useState } from "react";
import { CompanyListUrl, CompanyTypesUrl } from "../../constants";
import { getAuthHeaders, snakeToCamel } from "../../utils";
import { Company, PassToServerCompany, PassToServerTypeChoice, TypeChoice } from "../CompanyDetail";

export type FetchCompaniesResult = {
    loading: boolean,
    companies: Company[] | [],
    typeChoices: TypeChoice[] | [],
}


export const useCompanies = (): FetchCompaniesResult => {
    const accessToken = localStorage.getItem('access') || ""
    const config: AxiosRequestConfig = {
        headers: getAuthHeaders(accessToken)
    }

    const [loading, setLoading] = useState<boolean>(false)
    const [typeChoices, setTypeChoices] = useState<TypeChoice[] | []>([])
    const [companies, setCompanies] = useState<Company[] | []>([])

    useEffect(() => {
        setLoading(true)
        axios.get(CompanyTypesUrl, config)
            .then((response) => {
                setTypeChoices(response.data.map(
                    (typeChoice: PassToServerTypeChoice) => snakeToCamel<TypeChoice>(typeChoice)
                ))
            })
            .catch((error) => alert('Fetch error\n' + error))
        axios.get(CompanyListUrl, config)
            .then((response) => {
                setCompanies(response.data.map(
                    (company: PassToServerCompany) => snakeToCamel<Company>(company)
                ))
            })
            .finally(() => setLoading(false))
            .catch((error) => alert('Fetch error\n' + error))
    }, [])

    return {
        loading,
        companies,
        typeChoices
    }
}