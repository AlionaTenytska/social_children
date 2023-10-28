import * as React from "react";
import { useController } from "react-hook-form";
import { TextField } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker as MuiDatePicker } from "@mui/x-date-pickers";

const DatePicker = React.forwardRef(function DatePicker(props, ref) {
  const { error, label, format, name, control, value, onChange } = props;
  const { field } = useController({ name, control });

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <MuiDatePicker
        value  = {value}
        label={label}
        inputFormat={format}
        {...field}
        slotProps={{ textField: { error: error,  helperText: error} }}
        onChange={onChange}
        // renderInput={({ error: inputError, ...params }) => {
        //   return <TextField error={error} helperText={error} {...params} />;
        // }}
      />
    </LocalizationProvider>
  );
});

export default DatePicker;