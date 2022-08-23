import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  IconButton,
  Input,
  InputAdornment,
  TextField,
  Button,
  Box,
} from "@mui/material";
import React from "react";
import { useForm, Controller } from "react-hook-form";
import { css } from "@emotion/react";
import useSWRMutation from "swr/mutation";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";

async function sendRequest(url, { arg }) {
  return fetch(url, {
    method: "POST",
    body: JSON.stringify(arg),
    headers: new Headers({
      Authorization: "Basic",
    }),
  });
}

const Login = () => {
  const [showPassword, setShowPassword] = React.useState(false);
  const router = useRouter();
  const { trigger } = useSWRMutation("/api/user", sendRequest);

  const { control, handleSubmit } = useForm({
    defaultValues: {
      username: "",
      password: "",
    },
  });
  const onSubmit = async (data) => {
    const a = await signIn("credentials", { ...data, redirect: false });
    if (a?.ok && !a.error) {
      router.push("/");
    } else {
      //TODO: Show a toast message
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

  //   if (error) return <div>failed to load</div>;
  //   if (!data) return <div>loading...</div>;

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
        <Button type="submit" variant="contained">
          Вход
        </Button>
      </form>
    </Box>
  );
};

export default Login;
