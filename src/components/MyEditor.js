import React from "react";
import Editor, { composeDecorators } from "draft-js-plugins-editor";
import createUndoPlugin from "draft-js-undo-plugin";
import createEmojiPlugin from "draft-js-emoji-plugin";
import createImagePlugin from "draft-js-image-plugin";
import createAlignmentPlugin from "draft-js-alignment-plugin";
import createFocusPlugin from "draft-js-focus-plugin";
import createResizeablePlugin from "draft-js-resizeable-plugin";
import createBlockDndPlugin from "draft-js-drag-n-drop-plugin";
import createDragNDropUploadPlugin from './../lib/draft-js-drag-n-drop-upload-plugin/';
import createSideToolbarPlugin from 'draft-js-side-toolbar-plugin';
import { uploadFile } from './../aws/s3';

const emojiPlugin = createEmojiPlugin();
const { EmojiSuggestions, EmojiSelect } = emojiPlugin;
const undoPlugin = createUndoPlugin();
const { UndoButton, RedoButton } = undoPlugin;
const alignmentPlugin = createAlignmentPlugin();
const focusPlugin = createFocusPlugin();
const resizeablePlugin = createResizeablePlugin();
const blockDndPlugin = createBlockDndPlugin();
const sideToolbarPlugin = createSideToolbarPlugin();
const { AlignmentTool } = alignmentPlugin;

const decorator = composeDecorators(
  resizeablePlugin.decorator,
  alignmentPlugin.decorator,
  focusPlugin.decorator,
  blockDndPlugin.decorator
);

const imagePlugin = createImagePlugin({ decorator });

const dragNDropFileUploadPlugin = createDragNDropUploadPlugin({
  handleUpload: (files, success, failure) => {
    files.forEach(file => {
      uploadFile(file).then((data) => {
        success(data);
      }).catch((err) => {
        failure(err);
      })
    });
  },
  addImage: imagePlugin.addImage
});

const plugins = [
  sideToolbarPlugin,
  dragNDropFileUploadPlugin,
  undoPlugin,
  emojiPlugin,
  imagePlugin,
  alignmentPlugin,
  focusPlugin,
  resizeablePlugin,
  blockDndPlugin
];

class MyEditor extends React.Component {
  constructor(props) {
    super(props);
  }

  focus = () => {
    this.editor.focus();
  };

  render() {
    return (
      <div onClick={this.focus}>
        <Editor
          plugins={plugins}
          {...this.props}
          ref={element => {
            this.editor = element;
          }}
        />
        {!this.props.readOnly && (
          <div>
            <UndoButton />
            <RedoButton />
            <EmojiSuggestions />
            <EmojiSelect />
            <AlignmentTool />
          </div>
        )}
      </div>
    );
  }
}

export default MyEditor;
