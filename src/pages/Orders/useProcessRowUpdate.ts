import { GridRowModel } from "@mui/x-data-grid";
import React from "react";

const useProcessRowUpdate = <T>() => {
  const [promiseArguments, setPromiseArguments] = React.useState<any>(null);

  const onClose = () => {
    const { oldRow, resolve } = promiseArguments;
    resolve(oldRow);
    setPromiseArguments(null);
  };

  const onSuccess = (data: T) => {
    const { resolve } = promiseArguments;
    resolve(data);
    setPromiseArguments(null);
  };

  const onError = () => {
    const { oldRow, reject } = promiseArguments;

    reject(oldRow);
    setPromiseArguments(null);
  };

  const processRowUpdate = React.useCallback(
    (newRow: GridRowModel, oldRow: GridRowModel) =>
      new Promise<GridRowModel>((resolve, reject) => {
        if (oldRow.phone !== newRow.phone) {
          // Save the arguments to resolve or reject the promise later
          setPromiseArguments({ resolve, reject, newRow, oldRow });
        } else {
          resolve(oldRow); // Nothing was changed
        }
      }),
    []
  );

  return {
    processRowUpdate,
    onClose,
    promiseArguments,
    onError,
    onSuccess,
  };
};

export default useProcessRowUpdate;
