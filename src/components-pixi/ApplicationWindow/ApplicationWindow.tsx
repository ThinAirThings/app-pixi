
import { RxTxContainer } from "../_base/RxTxContainer"
import {  Container as PxContainer } from "pixi.js"
import { ReactNode, useRef, useState } from "react"
import { PixiLoading } from "../PixiLoading/PixiLoading"
import { WorkerClient } from "@thinairthings/worker-client"
import { useApplicationRendering } from "./hooks/useApplicationRendering"
import { useApplicationPointerEvents } from "../../hooks/pointerActions/useApplicationPointerActions"
import { useStorageContainerState, useStorageNodeState } from "@thinairthings/liveblocks-model"
import { useStorage } from "../../context/LiveblocksContext"
import { ApplicationContainer } from "../ApplicationContainer/ApplicationContainer"
import { useApplicationKeyboardEvents } from "../../hooks/useApplicationKeyboardEvents"

export const applicationSocketMap = new Map<string, WorkerClient>()

export const ApplicationWindow = ({
    nodeId,
    children
}: {
    nodeId: string
    children?: ReactNode
}) => {
    // State
    const containerState = useStorageContainerState(useStorage, nodeId)
    const [readyToRender, setReadyToRender] = useState(false)
    const cursor = useStorageNodeState<'browser', 'cursor'>(useStorage, nodeId, "cursor")
    // Refs
    const applicationContainerRef = useRef<PxContainer | null>(null)
    const workerClientRef = useRef<WorkerClient | null>(null)
    applicationSocketMap.has(nodeId) || applicationSocketMap.set(nodeId, workerClientRef.current!)
    // Effects
    useApplicationRendering(nodeId, {
        applicationContainerRef,
        workerClientRef,
        setReadyToRender
    })
    useApplicationPointerEvents(
        nodeId, 
        applicationContainerRef.current, 
        workerClientRef
    )
    useApplicationKeyboardEvents(nodeId, {
        workerClientRef,
        readyToRender
    })
    return(
        <RxTxContainer nodeId={nodeId}>
            {readyToRender
                ? <ApplicationContainer
                    ref={applicationContainerRef}
                    nodeId={nodeId}
                    cursor={cursor}
                /> 
                : <PixiLoading
                    width={(1/containerState.scale)*containerState.width}
                    height={(1/containerState.scale)*containerState.height}
                />
            }
            {children}
        </RxTxContainer>
    )
}