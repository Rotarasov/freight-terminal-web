import axios, { AxiosRequestConfig } from "axios";
import { useEffect, useState } from "react";
import { DeviceDetailUrl, DevicePrefixesUrl, DeviceUnitsUrl } from "../../constants";
import { fillUrl, getAuthHeaders, snakeToCamel } from "../../utils";
import { Device, PassToServerDevice, PrefixChoice, PrefixChoiceFromServer, UnitChoice, UnitChoiceFromServer } from "../DeviceDetail";

export type FetchDeviceResult = {
    loading: boolean,
    device?: Device,
    setDevice: (device: Device) => void,
    unitChoices: UnitChoice[] | [],
    prefixChoices: PrefixChoice[] | []
}


export const useDevice = (id: string): FetchDeviceResult => {
    const accessToken = localStorage.getItem('access') || ""
    const config: AxiosRequestConfig = {
        headers: getAuthHeaders(accessToken)
    }

    const [loading, setLoading] = useState<boolean>(false)
    const [unitChoices, setUnitChoices] = useState<UnitChoice[] | []>([])
    const [prefixChoices, setPrefixChoices] = useState<PrefixChoice[] | []>([])
    const [device, setDevice] = useState<Device | undefined>(undefined)

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
        axios.get(fillUrl(DeviceDetailUrl, { pk: id }), config)
            .then((response) => {
                setDevice(snakeToCamel<PassToServerDevice, Device>(response.data))
            })
            .finally(() => setLoading(false))
            .catch((error) => alert('Fetch error\n' + error))
    }, [])

    return {
        loading,
        device,
        setDevice,
        unitChoices,
        prefixChoices
    }
}