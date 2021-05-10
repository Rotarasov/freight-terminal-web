import axios, { AxiosRequestConfig } from "axios";
import { useEffect, useState } from "react";
import { TypeChoice } from "../../admin/CompanyDetail";
import { RobotDetailUrl, RobotStatusesUrl, RobotTypesUrl } from "../../constants";
import { fillUrl, getAuthHeaders, snakeToCamel } from "../../utils";
import { PassToServerRobot, Robot, StatusChoice, StatusChoiceFromServer, TypeChoiceFromServer } from "../RobotDetail";

export type FetchRobotResult = {
    loading: boolean,
    robot?: Robot,
    setRobot: (robot: Robot) => void,
    typeChoices: TypeChoice[] | [],
    statusChoices: StatusChoice[] | []
}


export const useRobot = (companyPk: string, robotPk: string): FetchRobotResult => {
    const accessToken = localStorage.getItem('access') || ""
    const config: AxiosRequestConfig = {
        headers: getAuthHeaders(accessToken)
    }

    const [loading, setLoading] = useState<boolean>(false)
    const [typeChoices, setTypeChoices] = useState<TypeChoice[] | []>([])
    const [statusChoices, setStatusChoices] = useState<StatusChoice[] | []>([])
    const [robot, setRobot] = useState<Robot | undefined>(undefined)

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
        axios.get(fillUrl(RobotDetailUrl, { companyPk: companyPk, robotPk: robotPk }), config)
            .then((response) => setRobot(snakeToCamel<PassToServerRobot, Robot>(response.data)))
            .finally(() => setLoading(false))
            .catch((error) => alert('Fetch error\n' + error))
    }, [])

    return {
        loading,
        robot,
        setRobot,
        typeChoices,
        statusChoices
    }
}