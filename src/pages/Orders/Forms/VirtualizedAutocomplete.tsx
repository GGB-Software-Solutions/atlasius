import * as React from "react";
import Autocomplete, { autocompleteClasses } from "@mui/material/Autocomplete";
import Popper from "@mui/material/Popper";
import { styled } from "@mui/material/styles";
import { ListChildComponentProps, FixedSizeList } from "react-window";
import Typography from "@mui/material/Typography";
import {
  AutocompleteElement,
  AutocompleteElementProps,
} from "react-hook-form-mui";

function renderRow(props: ListChildComponentProps) {
  const { data, index, style } = props;
  const dataSet = data[index];

  return (
    <Typography
      component="li"
      {...dataSet.props}
      noWrap
      style={style}
      className="MuiAutocomplete-option"
    >
      {dataSet.key}
    </Typography>
  );
}

const OuterElementContext = React.createContext({});

// Adapter for react-window
const ListboxComponent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLElement>
>(function ListboxComponent(props, ref) {
  const { children, ...other } = props;

  return (
    <ul {...props} ref={ref}>
      <OuterElementContext.Provider value={other}>
        <FixedSizeList
          itemData={children}
          itemCount={Array.from(children).length}
          itemSize={48}
          width="100%"
          height={100}
        >
          {renderRow}
        </FixedSizeList>
      </OuterElementContext.Provider>
    </ul>
  );
});

const StyledPopper = styled(Popper)({
  [`& .${autocompleteClasses.listbox}`]: {
    boxSizing: "border-box",
    "& ul": {
      padding: 0,
      margin: 0,
    },
  },
});

export default function VirtualizedAutocomplete<
  F,
  T,
  M extends boolean | undefined,
  D extends boolean | undefined
>({
  autocompleteProps,
  textFieldProps,
  ...other
}: AutocompleteElementProps<F, T, M, D>) {
  return (
    <AutocompleteElement
      textFieldProps={{
        variant: "standard",
        ...textFieldProps,
      }}
      autocompleteProps={{
        disableListWrap: true,
        ListboxComponent,
        PopperComponent: StyledPopper,
        ...autocompleteProps,
      }}
      {...other}
    />
  );
}
