import { useEffect } from "react";
import { useImmer } from "use-immer";
import { useThinAirClient } from "../../../../../clients/ThinAirClient/useThinAirClient";
import { GetSpacesCommand } from "../../../../../clients/ThinAirClient/commands/liveblocks/GetSpacesCommand";


export const useSpacesMetadataMap = () => {
    // Refs
    const thinairClient = useThinAirClient()
    // State
    const [spacesMetadataMap, setSpacesMetadataMap] = useImmer<Map<string, {
        spaceId: string;
        spaceDisplayName: string;
        creationTime: string;
        lastAccessedTime: string;
    }>>(new Map())
    // Effect
    useEffect(() => {
        (async () => {
            const spacesMetadata = await thinairClient.send(new GetSpacesCommand())
            setSpacesMetadataMap(draft => {
                draft.clear()
                spacesMetadata.rooms.forEach(spaceMetadata => {
                    draft.set(spaceMetadata.id, {
                        spaceId: spaceMetadata.id,
                        spaceDisplayName: spaceMetadata.metadata.spaceDisplayName,
                        creationTime: convertDate(spaceMetadata.createdAt),
                        lastAccessedTime: convertDate(spaceMetadata.lastConnectionAt)
                    })
                })
            })
        })()
    }, [])
    return spacesMetadataMap
}

const convertDate = (date: string) => {
    return new Date(date).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    })
}