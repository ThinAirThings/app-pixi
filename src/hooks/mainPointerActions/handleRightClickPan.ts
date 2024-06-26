import { ViewportState } from "@thinairthings/zoom-utils"
import { useViewportStateContext } from "../../context/SpaceContext"
import { mousePoint } from "@thinairthings/mouse-utils"
import { fromEvent, takeUntil } from "rxjs"

export const handleRightClickPan = (event: PointerEvent, {
    viewportState,
    setViewportState,
}: {
    viewportState: ViewportState
    setViewportState: ReturnType<typeof useViewportStateContext>[1]
}) => {
    const initialViewportState = {...viewportState}
    const pointerDownPoint = mousePoint(event)
    fromEvent<PointerEvent>(document.body, 'pointermove')
    .pipe(
        takeUntil(fromEvent<PointerEvent, void>(document.body, 'pointerup', {}, (event) => {
            // POINTER CAPTURE WAS BREAKING CLICKS INTO THE APPLICATION CANVAS
            // Need to fix this at some point
        }))
    )
    .subscribe((event) => {
        const pointerMovePoint = mousePoint(event)
        setViewportState({
            ...initialViewportState,
            x: initialViewportState.x + viewportState.scale * (pointerMovePoint.x - pointerDownPoint.x),
            y: initialViewportState.y + viewportState.scale * (pointerMovePoint.y - pointerDownPoint.y),
        })
    })
}
