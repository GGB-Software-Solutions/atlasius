import { GridRowParams } from "@mui/x-data-grid";
import React from "react";

export interface EditorProps<T = any> {
  open: boolean;
  onClose: () => void;
  onSave: (data: T) => void;
  title: string;
  data: T;
}

interface Props<T = any> {
  Editor: React.JSXElementConstructor<EditorProps>;
  onEditorSave: (data: T) => void;
}

const withEditor =
  (WrappedComponent) =>
  ({ Editor, onEditorSave, ...props }: Props) => {
    const [currentlyEditting, setCurrentlyEditting] = React.useState(null);

    const onRowClick = (params: GridRowParams) =>
      setCurrentlyEditting(params.row);

    const handleClose = () => {
      setCurrentlyEditting(null);
    };

    const handleSave = async (formData) => {
      if (onEditorSave) {
        const response = await onEditorSave(formData);
        if (response) {
          setCurrentlyEditting(null);
        }
      }
    };

    const showEditor = Editor && currentlyEditting;

    return (
      <>
        <WrappedComponent {...props} onRowClick={onRowClick} />
        {showEditor && (
          <Editor
            open={Boolean(currentlyEditting)}
            onClose={handleClose}
            onSave={handleSave}
            data={currentlyEditting}
            title={props.title}
          />
          // <Editor
          //   row={currentlyEditing}
          //   onClose={handleClose}
          //   onSave={handleSave}
          //   onDelete={handleDelete}
          //   editorProps={EditorProps}
          // />
        )}
      </>
    );
  };

export default withEditor;
