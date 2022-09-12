import React from "react";

import useStore from "../store/globalStore";
import Notification from "../components/Notification";

const withNotifications = (WrappedComponent) => {
  const WithNotifications = (props) => {
    const { notification, set } = useStore((state) => ({
      notification: state.notification,
      set: state.setNotification,
    }));

    const boundClearNotification = React.useCallback(() => {
      set(null);
    }, []);

    return (
      <>
        <WrappedComponent {...props} />
        <Notification
          notification={notification}
          clearNotification={boundClearNotification}
        />
      </>
    );
  };

  return WithNotifications;
};

export default withNotifications;
