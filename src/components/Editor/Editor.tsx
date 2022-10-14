import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import React, { useEffect, useRef, useState } from 'react';
import { ContentState, convertToRaw, EditorState } from 'draft-js';
import { uploadEditorImg } from '@/services/operationCanter';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

type PropType = {
  initialContent: string;
  onChange?: (html:string, state: EditorState)=>unknown;
  // onStateChange?: (state: EditorState)=>unknown;
}

export default function WYSIWYGEditor({ initialContent, onChange } : PropType) {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const isMounted = useRef(true);

  useEffect(() => {
    if (isMounted.current) {
      const blocksFromHtml = htmlToDraft(initialContent);
      const { contentBlocks, entityMap } = blocksFromHtml;
      const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap);
      const state = EditorState.createWithContent(contentState);
      setEditorState(state);
      if (onChange) {
        onChange(initialContent, state);
      }
    }
  }, [initialContent]);
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  const uploadImageCallBack = (file:any) => new Promise(
    (resolve, reject) => {
      uploadEditorImg({ file })
        .then((result) => {
          let url = '';
          if (result.code === 0) {
            url = result.data && (result.data.url || '');
          } else {
            throw new Error(result.msg);
          }
          resolve({
            data: {
              link: url,
            },
          });
        })
        .catch((err) => {
          reject(err);
        });
    },
  );
  return (
    <Editor
      localization={{
        locale: 'zh',
      }}
      editorStyle={{ minHeight: '300px', border: 'solid 1px #DDD' }}
      editorState={editorState}
      onEditorStateChange={(state) => {
        if (isMounted.current) {
          setEditorState(state);
          const markup = draftToHtml(convertToRaw(editorState.getCurrentContent()));
          if (typeof onChange === 'function') {
            onChange(markup, editorState);
          }
        }
        // if (typeof onStateChange === 'function') {
        //   onStateChange(state);
        // }
      }}
      // onChange={(v) => {
      //   const markup = draftToHtml(v);
      //   if (typeof onChange === 'function') {
      //     onChange(markup);
      //   }
      // }}
      toolbar={
        {
          options: ['inline', 'blockType', 'fontSize', 'fontFamily', 'list', 'textAlign', 'colorPicker', 'link', 'embedded', 'emoji', 'image', 'remove', 'history'],
          image: {
            uploadCallback: uploadImageCallBack,
            alt: { present: true, previewImage: true },
            previewImage: true,
          },
        }
      }
    />
  );
}

WYSIWYGEditor.defaultProps = {
  onChange: () => {},
  // onStateChange: () => {},
};
