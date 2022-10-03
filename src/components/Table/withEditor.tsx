import { GridRowParams } from "@mui/x-data-grid";
import React from "react";
import useStore from "../../store/globalStore";
import { Props as TableProps } from "./Table";

export interface EditorProps<T = any> {
  open: boolean;
  onClose: () => void;
  onSave: (data: T) => void;
  title?: string;
  data: T;
}

interface Props<T = any> extends Partial<TableProps<T>> {
  Editor: React.JSXElementConstructor<EditorProps>;
  onEditorSave?: (data: T) => void;
}

const withEditor =
  <T,>(WrappedComponent) =>
  ({ Editor, onEditorSave, ...props }: Props<T>) => {
    const setNotification = useStore((state) => state.setNotification);
    const [currentlyEditting, setCurrentlyEditting] = React.useState(null);

    const onRowClick = (params: GridRowParams) =>
      setCurrentlyEditting(params.row);

    const handleClose = () => {
      setCurrentlyEditting(null);
    };

    const handleSave = async (formData: T) => {
      if (onEditorSave) {
        const response = await onEditorSave(formData);
        if (response && !response.error) {
          const message =
            response.success || response.created || response.updated;
          setNotification({
            type: "success",
            message: Array.isArray(message) ? message.join(",") : message,
          });
          setCurrentlyEditting(null);
        } else {
          setNotification({ type: "error", message: response.error });
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
        )}
      </>
    );
  };

export default withEditor;
