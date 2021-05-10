import axios, { AxiosRequestConfig } from "axios";
import { useEffect, useState } from "react";
import { TypeChoice } from "../../admin/CompanyDetail";
import { RobotListUrl, RobotStatusesUrl, RobotTypesUrl } from "../../constants";
import { fillUrl, getAuthHeaders, snakeToCamel } from "../../utils";
import { PassToServerRobot, Robot, StatusChoice, StatusChoiceFromServer, TypeChoiceFromServer } from "../RobotDetail";

export type FetchRobotsResult = {
    loading: boolean,
    robots: Robot[] | [],
    typeChoices: TypeChoice[] | [],
    statusChoices: StatusChoice[] | []
}


export const useRobots = (): FetchRobotsResult => {
    const account = localStorage.getItem('userId') || "0"
    const accessToken = localStorage.getItem('access') || ""
    const config: AxiosRequestConfig = {
        headers: getAuthHeaders(accessToken)
    }

    const [loading, setLoading] = useState<boolean>(false)
    const [typeChoices, setTypeChoices] = useState<TypeChoice[] | []>([])
    const [statusChoices, setStatusChoices] = useState<StatusChoice[] | []>([])
    const [robots, setRobots] = useState<Robot[] | []>([])

    useEffect(() => {
        setLoading(true)
        axios.get(RobotTypesUrl, config)
            .then((response) => {
                setTypeChoices(response.data.map(
                    (typeChoice: TypeChoiceFromServer) => snakeToCamel<TypeChoiceFromServer, TypeChoice>(typeChoice)
                ))
            })
            .catch((error) => alert('Fetch error\n' + error))
        axios.get(RobotStatusesUrl, config)
            .then((response) => {
                setStatusChoices(response.data.map(
                    (statusChoice: StatusChoiceFromServer) => snakeToCamel<StatusChoiceFromServer, TypeChoice>(statusChoice)
                ))
            })
            .catch((error) => alert('Fetch error\n' + error))
        axios.get(fillUrl(RobotListUrl, { pk: account }), config)
            .then((response) => {
                setRobots(response.data.map(
                    (robot: PassToServerRobot) => snakeToCamel<PassToServerRobot, Robot>(robot)
                ))
            })
            .finally(() => setLoading(false))
            .catch((error) => alert('Fetch error\n' + error))
    }, [])

    return {
        loading,
        robots,
        typeChoices,
        statusChoices
    }
}