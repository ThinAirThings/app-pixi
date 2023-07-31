import { EditorContent, useEditor} from "@tiptap/react"
import { Color } from '@tiptap/extension-color'
import TextStyle from '@tiptap/extension-text-style'
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
import { TextEditMenu } from "./TextEditMenu"
export const TextBox = ({nodeId}: {
    nodeId: string
}) => {
    // State
    const [editorInitialized, setEditorInitialized] = useState(false)
    const content = useStorageNodeState< 'textBox'>(useStorage, nodeId, "content")
    const isFocused = useStorageMyFocusedNodeId() === nodeId
    // Mutations
    const updateContent = useMutationNodeState<'textBox'>(useMutation, nodeId, "content")
    const editor = useEditor({
        extensions: [
            StarterKit,
            TextStyle,
            Color
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
                class: classNames(styles.editor, {
                    [styles.focused]: isFocused
                }),
                spellcheck: 'false'
            },
        }
    })
    // Effects
    useEffect(() => {
        if (!editorInitialized) return
        if (content === editor!.getHTML()) return
        editor!.chain().setContent(content).run()
    }, [content])
    useEditorPointerActions({editorInitialized, isFocused, editor})
    return (
        <>
            {isFocused && <TextEditMenu nodeId={nodeId} editor={editor!}/>}
            <DomContainer nodeId={nodeId}>
                <div className={classNames(styles.textBox)}>
                    <EditorContent editor={editor} />
                    {!isFocused && <DivTarget nodeId={nodeId} isApplicationTarget={true}/>}
                </div>
            </DomContainer>
        </>

    )
}