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
import { useRouter } from "next/router";
import { setJwtToken } from "../../utils/jwt";
import { jsonFetch } from "../../utils/fetch";
import useStore from "../../store/globalStore";

const Login = () => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [error, setError] = React.useState("");
  const router = useRouter();
  const setUser = useStore((state) => state.setUser);

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

  const login = async (data) => {
    const url = `login?username=${data.username}&password=${data.password}`;
    try {
      const response = await jsonFetch(url, {
        method: "POST",
        body: JSON.stringify(data),
      });
      if (response) return response;
      // Return null if user data could not be retrieved
      return null;
    } catch (e) {
      return null;
    }
  };

  const onSubmit = async (data) => {
    setError("");
    const response = await login(data);
    if (response) {
      const { access_token, user } = response;
      setUser(user);
      setJwtToken(access_token);
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
