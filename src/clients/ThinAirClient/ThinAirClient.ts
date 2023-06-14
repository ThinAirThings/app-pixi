import { useUserDetailsContext } from "../../context/UserContext"

export abstract class Command {
    abstract payload: any
    abstract returnType: any
    constructor(
        public apiName: string, 
        public commandName: string, 
        public methodType: 'GET' | 'POST',
    ) {}
}

export class ThinAirClient {
    constructor(public rootDomain: string, public userDetails: ReturnType<typeof useUserDetailsContext>[0]) {}
    send = async <T extends Command>(command: T):Promise<T['returnType']> => {
        try {
            const url = new URL(`https://${command.apiName}.api.${this.rootDomain}/${command.commandName}`)
            if (command.methodType === 'GET'){
                url.search = new URLSearchParams({
                    ...command.payload,
                    userId: this.userDetails?.userId
                }).toString()
            }
            const response = await fetch(url, {
                method: command.methodType,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.userDetails?.accessToken}`
                },
                body: command.methodType === "POST" ? JSON.stringify({
                    ...command.payload,
                    userId: this.userDetails?.userId
                }): null,
                mode: 'cors' 
            })
            const result = await response.json()
            // Check for Errors
            if (!response.ok) {
                throw new Error(result.message)
            }
            return result
        } catch (e) {
            console.log(e)
        }
    }
}
