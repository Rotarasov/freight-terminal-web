import axios, { AxiosRequestConfig } from "axios";
import { useEffect, useState } from "react";
import { DeviceListUrl, DevicePrefixesUrl, DeviceUnitsUrl } from "../../constants";
import { getAuthHeaders, snakeToCamel } from "../../utils";
import { Device, PassToServerDevice, PrefixChoice, PrefixChoiceFromServer, UnitChoice, UnitChoiceFromServer } from "../DeviceDetail";

export type FetchDevicesResult = {
    loading: boolean,
    devices: Device[] | [],
    unitChoices: UnitChoice[] | [],
    prefixChoices: PrefixChoice[] | []
}


export const useDevices = (): FetchDevicesResult => {
    const accessToken = localStorage.getItem('access') || ""
    const config: AxiosRequestConfig = {
        headers: getAuthHeaders(accessToken)
    }

    const [loading, setLoading] = useState<boolean>(false)
    const [unitChoices, setUnitChoices] = useState<UnitChoice[] | []>([])
    const [prefixChoices, setPrefixChoices] = useState<PrefixChoice[] | []>([])
    const [devices, setDevices] = useState<Device[] | []>([])

    useEffect(() => {
        setLoading(true)
        axios.get(DeviceUnitsUrl, config)
            .then((response) => {
                setUnitChoices(response.data.map(
                    (unitChoice: UnitChoiceFromServer) => snakeToCamel<UnitChoiceFromServer, UnitChoice>(unitChoice)
                ))
            })
            .catch((error) => alert('Fetch error\n' + error))
        axios.get(DevicePrefixesUrl, config)
            .then((response) => {
                setPrefixChoices(response.data.map(
                    (prefixChoice: PrefixChoiceFromServer) => snakeToCamel<PrefixChoiceFromServer, PrefixChoice>(prefixChoice)
                ))
            })
            .catch((error) => alert('Fetch error\n' + error))
        axios.get(DeviceListUrl, config)
            .then((response) => {
                setDevices(response.data.map(
                    (device: PassToServerDevice) => snakeToCamel<PassToServerDevice, Device>(device)
                ))
            })
            .finally(() => setLoading(false))
            .catch((error) => alert('Fetch error\n' + error))
    }, [])

    return {
        loading,
        devices,
        unitChoices,
        prefixChoices
    }
}