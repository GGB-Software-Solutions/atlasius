import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  IconButton,
  InputAdornment,
  TextField,
  Box,
  Alert,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import React from "react";
import { useForm, Controller } from "react-hook-form";
import { css } from "@emotion/react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";

const Login = () => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [error, setError] = React.useState("");
  const router = useRouter();

  const { control, handleSubmit, formState } = useForm({
    defaultValues: {
      username: "",
      password: "",
    },
  });
  const { isSubmitting } = formState;

  React.useEffect(() => {
    router.prefetch("/");
  }, []);

  const onSubmit = async (data) => {
    setError("");
    const response = await signIn("credentials", {
      ...data,
      redirect: false,
    });
    if (response?.ok && !response.error) {
      router.push("/");
    } else {
      setError("Въведената комбинация от потребител и парола не съществуват.");
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  return (
    <Box
      sx={{
        width: 400,
        height: 400,
        backgroundColor: "background.default",
        borderRadius: (theme) => theme.shape.borderRadius,
        border: "1px solid gray",
        padding: 5,
      }}
    >
      {error && (
        <Alert sx={{ mb: 2 }} severity="error">
          {error}
        </Alert>
      )}

      <form
        css={css`
          display: flex;
          flex-direction: column;
          gap: 15px;
        `}
        onSubmit={handleSubmit(onSubmit)}
      >
        <Controller
          name="username"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              variant="standard"
              label="Потребител"
              type="email"
              required
            />
          )}
        />
        <Controller
          name="password"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              type={showPassword ? "text" : "password"}
              required
              variant="standard"
              label="Парола"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          )}
        />
        <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
          Вход
        </LoadingButton>
      </form>
    </Box>
  );
};

export default Login;
