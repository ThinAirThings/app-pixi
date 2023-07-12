import { Editor } from "@tiptap/react"
import { useEffect } from "react"
import { fromEvent, takeUntil } from "rxjs"


export const useEditorPointerActions = ({editorInitialized, isFocused, editor}: {
    editorInitialized: boolean
    isFocused: boolean
    editor: Editor | null
}) => {
    // Effects
    useEffect(() => {
        if (!editorInitialized || !isFocused) return
        const subscription = fromEvent<PointerEvent>(editor!.view.dom, 'pointerdown')
        .subscribe((event) => {
            // Check for right click
            if (event.button !== 0) return
            event.stopPropagation()
            editor!.view.dom.setPointerCapture(event.pointerId)
            fromEvent<PointerEvent>(editor!.view.dom, 'pointermove')
            .pipe(
                takeUntil(fromEvent<PointerEvent, void>(editor!.view.dom, 'pointerup', {}, (event) => {
                    editor!.view.dom.releasePointerCapture(event.pointerId)
                }))
            )
        })
        return () => subscription.unsubscribe()
    }, [editorInitialized, isFocused])
}