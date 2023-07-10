import {Editor, EditorContent, PureEditorContent, useEditor} from "@tiptap/react"
import StarterKit from '@tiptap/starter-kit'
import { DomContainer } from "../DomContainer/DomContainer"
import classNames from "classnames"
import styles from "./TextBox.module.scss"
import { DivTarget } from "../DivTarget/DivTarget"
import {  useEffect, useState } from "react"
import { useEditorPointerActions } from "./hooks/useEditorPointerActions"
import { useMutationNodeState, useStorageNodeState } from "@thinairthings/liveblocks-model"
import { useMutation, useStorage } from "../../context/LiveblocksContext"
import { useStorageMyFocusedNodeId } from "../../hooks/liveblocks/useStorageMyFocusedNodeId"
export const TextBox = ({nodeId}: {
    nodeId: string
}) => {
    // State
    const [editorInitialized, setEditorInitialized] = useState(false)
    const content = useStorageNodeState<'textBox', 'content'>(useStorage, nodeId, "content")
    const isFocused = useStorageMyFocusedNodeId() === nodeId
    // Mutations
    const updateContent = useMutationNodeState<'textBox', 'content'>(useMutation, nodeId, "content")
    const editor = useEditor({
        extensions: [
            StarterKit,
        ],
        content: content,
        onCreate: () => {
            setEditorInitialized(true)
        },
        onUpdate: ({ editor }) => {
            if (!editorInitialized) return
            updateContent(editor.getHTML())
        },
        editorProps: {
            attributes: {
                class: classNames(styles.editor),
            },
        }
    })

    // Effects
    useEffect(() => {
        if (!editorInitialized) return
        editor!.chain().setContent(content).run()
    }, [content])
    useEditorPointerActions({editorInitialized, isFocused, editor})
    return (
        <DomContainer nodeId={nodeId}>
            <div className={classNames(styles.textBox)}>
                <EditorContent editor={editor} 
                    className={classNames(styles.editorContent)}
                />
                {!isFocused && <DivTarget nodeId={nodeId} isApplicationTarget={true}/>}
            </div>
        </DomContainer>
    )
}