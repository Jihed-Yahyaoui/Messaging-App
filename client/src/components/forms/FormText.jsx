import { ButtonBase, InputAdornment, TextField } from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { Controller } from "react-hook-form";
import PropTypes from "prop-types";
import { useState } from "react";

export default function FormText(props) {
  const { name, control, register, rules, label, isPassword, serverError } =
    props;

  const [showPassword, setShowPassword] = useState(isPassword);

  // The Controller component allows the react-form-hook to intergrate external UI libraries
  // the rules object allows for form validation, it has the following syntax:
  // {required?: string, maxLength?/minLength?/max?/min?: {value: number, message: string},
  // pattern?: {value: RegExp, message: string}, validate? : value => condition || message}
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ fieldState: { error }, field }) => (
        <TextField
          type={showPassword ? "password" : "text"}
          label={label}
          sx={{ "& .MuiInputBase-root": { paddingRight: "6px" } }}
          InputProps={{
            endAdornment: isPassword && (
              <InputAdornment
                position="end"
                onClick={() => setShowPassword(!showPassword)}
                sx={{ cursor: "pointer" }}
              >
                <ButtonBase>
                  {showPassword ? (
                    <Visibility sx={{ margin: "0.4em" }} />
                  ) : (
                    <VisibilityOff sx={{ margin: "0.4em" }} />
                  )}
                </ButtonBase>
              </InputAdornment>
            ),
          }}
          {...register(name)}
          {...field}
          error={!!error || serverError?.reason === name}
          helperText={
            error
              ? error.message
              : serverError?.reason === name
              ? serverError.message
              : null
          }
        />
      )}
    />
  );
}

// Prop validation
FormText.propTypes = {
  name: PropTypes.string.isRequired,
  control: PropTypes.any.isRequired,
  register: PropTypes.any.isRequired,
  rules: PropTypes.object.isRequired,
  label: PropTypes.string.isRequired,
  serverError: PropTypes.object,
  isPassword: PropTypes.bool,
};
