import { Sprite } from "@pixi/react";
import { ScreenState } from "@thinairthings/zoom-utils";
import { FC, useRef } from "react";
import {BaseTexture, Texture } from "@pixi/webworker"
import { ApplicationTextureResource } from "./webgl/ApplicationTextureResource";
import { useRxNodeSignal } from "@thinairthings/react-utils";

export const PopupSprite: FC<{
    pixmapId: number,
    screenState: ScreenState,
}> = ({pixmapId, screenState}) => {
    const popupTextureRef = useRef(
        new Texture<ApplicationTextureResource>(new BaseTexture(
            new ApplicationTextureResource(screenState)
        ))
    )
    useRxNodeSignal<{
        dirtyRect: ScreenState
        dirtyBitmap: ImageBitmap
    }>("worker", pixmapId.toString(), "rxPopupDamage", ({
        dirtyRect,
        dirtyBitmap
    }) => {
        popupTextureRef.current.baseTexture.resource.uploadDirtyFrame(
            dirtyRect,
            dirtyBitmap
        )
    })
    return (
        <Sprite
            texture={popupTextureRef.current}
            x={screenState.x}
            y={screenState.y}
            width={screenState.width}
            height={screenState.height}
        />
    )
}