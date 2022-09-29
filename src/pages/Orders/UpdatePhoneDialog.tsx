import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";

export default function UpdatePhoneDialog({
  onClose,
  promiseArguments,
  onSave,
}) {
  const noButtonRef = React.useRef<HTMLButtonElement>(null);

  const handleEntered = () => {
    // The `autoFocus` is not used because, if used, the same Enter that saves
    // the cell triggers "No". Instead, we manually focus the "No" button once
    // the dialog is fully open.
    // noButtonRef.current?.focus();
  };

  if (!promiseArguments) {
    return null;
  }

  const { newRow, oldRow } = promiseArguments;

  return (
    <Dialog
      maxWidth="xs"
      TransitionProps={{ onEntered: handleEntered }}
      open={!!promiseArguments}
    >
      <DialogTitle>Сигурни ли сте?</DialogTitle>
      <DialogContent dividers>
        {`Натискането на Да ще смени телефона от ${oldRow.phone} на ${newRow.phone}`}
      </DialogContent>
      <DialogActions>
        <Button ref={noButtonRef} onClick={onClose}>
          Не
        </Button>
        <Button onClick={onSave}>Да</Button>
      </DialogActions>
    </Dialog>
  );
}
