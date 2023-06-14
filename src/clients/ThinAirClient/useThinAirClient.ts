import { useUserDetailsContext } from "../../context/UserContext"
import { ThinAirClient } from "./ThinAirClient"


export const useThinAirClient = () => {
    const [userDetails] = useUserDetailsContext()
    return new ThinAirClient(import.meta.env.VITE_ROOT_DOMAIN, userDetails)
}