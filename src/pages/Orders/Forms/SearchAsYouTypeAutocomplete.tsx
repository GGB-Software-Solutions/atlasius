import * as React from "react";
import throttle from "lodash.throttle";
import {
  AutocompleteElement,
  AutocompleteElementProps,
} from "react-hook-form-mui";

export default function SearchAsYouTypeAutocomplete<
  F,
  T,
  M extends boolean | undefined,
  D extends boolean | undefined
>({
  autocompleteProps,
  textFieldProps,
  fetch,
  ...other
}: AutocompleteElementProps<F, T, M, D> & {
  fetch: (inputValue: string, callback: (results) => void) => void;
}) {
  const [value, setValue] = React.useState(null);
  const [inputValue, setInputValue] = React.useState("");
  const [options, setOptions] = React.useState([]);

  const fetcher = React.useMemo(
    () =>
      throttle((request: { input: string }, callback: (results) => void) => {
        fetch(request.input, callback);
      }, 200),
    []
  );

  React.useEffect(() => {
    let active = true;

    if (inputValue === "") {
      setOptions(value ? [value] : []);
      return undefined;
    }

    fetcher({ input: inputValue }, (results) => {
      if (active) {
        let newOptions = [];

        if (value) {
          newOptions = [value];
        }

        if (results) {
          newOptions = [...newOptions, ...results];
        }

        setOptions(newOptions);
      }
    });

    return () => {
      active = false;
    };
  }, [value, inputValue, fetch]);

  return (
    <AutocompleteElement
      value={value}
      onChange={(event: any, newValue) => {
        setOptions(newValue ? [newValue, ...options] : options);
        setValue(newValue);
      }}
      options={options}
      textFieldProps={{
        variant: "standard",
        ...textFieldProps,
      }}
      autocompleteProps={{
        ...autocompleteProps,
        filterOptions: (x) => x,
        autoComplete: true,
        includeInputInList: true,
        filterSelectedOptions: true,
        onInputChange: (event, newInputValue) => {
          setInputValue(newInputValue);
        },
      }}
      {...other}
    />
  );
}
