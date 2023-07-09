import {EditorContent, useEditor} from "@tiptap/react"
import StarterKit from '@tiptap/starter-kit'
import { DomContainer } from "../DomContainer/DomContainer"
import classNames from "classnames"
import styles from "./TextBox.module.scss"
import { DivTarget } from "../DivTarget/DivTarget"

export const TextBox = ({nodeId}: {
    nodeId: string
}) => {
    const editor = useEditor({
        extensions: [
            StarterKit,
        ],
        content: '<p>Hello World!</p>',
    })

    return (
        <DomContainer nodeId={nodeId}>
            <DivTarget nodeId={nodeId} className={classNames(styles.textBox)}>
                <EditorContent editor={editor} />
            </DivTarget>
        </DomContainer>
    )
}