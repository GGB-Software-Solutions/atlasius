import React, { SyntheticEvent } from "react";

import {
  Alert,
  AlertColor,
  Snackbar,
  SnackbarCloseReason,
} from "@mui/material";

export interface INotification {
  autoHideDuration?: number;
  message: string;
  type: AlertColor;
}

interface Props {
  notification: INotification;
  clearNotification?: (
    event: Event | SyntheticEvent<any, Event>,
    reason: SnackbarCloseReason
  ) => void;
}

const NotificationSnackbar = ({ notification, clearNotification }: Props) => {
  const isOpen = Boolean(notification);
  const snackbarContent = isOpen ? (
    <Alert
      onClose={clearNotification}
      variant="filled"
      severity={notification.type}
    >
      {notification.message}
    </Alert>
  ) : null;

  if (!snackbarContent) return null;

  return (
    <Snackbar
      autoHideDuration={notification.autoHideDuration}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      open={isOpen}
      onClose={clearNotification}
    >
      {snackbarContent}
    </Snackbar>
  );
};

export default NotificationSnackbar;
