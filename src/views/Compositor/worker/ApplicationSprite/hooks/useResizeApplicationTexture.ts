import { Texture } from "@pixi/webworker";
import { MutableRefObject, useEffect } from "react";
import { ApplicationTextureResource } from "../webgl/ApplicationTextureResource";
import { ContainerState } from "@thinairthings/zoom-utils";

export const useResizeApplicationTexture = (
    applicationTextureRef: MutableRefObject<Texture<ApplicationTextureResource>>,
    containerState: ContainerState
) => {
    useEffect(() => {
        applicationTextureRef.current.baseTexture.resource.resizeTexture(
            containerState
        )
    }, [containerState.width, containerState.height, containerState.scale])
}