import React, { useEffect } from 'react'
import { Editor, EditorState, ContentState } from 'draft-js'
import "draft-js/dist/Draft.css";
import { convertToRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html'
import htmlToDraft from 'html-to-draftjs'

export default function NewsEditor(props) {

    const [editorState, setEditorState] = React.useState(() =>
        EditorState.createEmpty()
    );

    useEffect(() => {
        const html = props.content
        if (!html) return
        const contentBlock = htmlToDraft(html)
        if (contentBlock) {
            const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks)
            const editorState = EditorState.createWithContent(contentState)
            setEditorState(editorState)
        }
    }, [props.content])

    const editor = React.useRef(null);
    function focusEditor() {
        editor.current.focus();
    }

    return (
        <div
            style={{ border: "1px solid black", minHeight: "6em", cursor: "text" }}
            onClick={focusEditor}
        >
            <Editor
                ref={editor}
                editorState={editorState}
                onChange={setEditorState}
                placeholder="Write something!"
                onBlur={() => {
                    // console.log(draftToHtml(convertToRaw(editorState.getCurrentContent())))
                    props.getContent(draftToHtml(convertToRaw(editorState.getCurrentContent())))
                }}
            />
        </div>
    )
}
