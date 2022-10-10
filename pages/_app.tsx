import * as React from "react";
import Head from "next/head";
import { AppProps } from "next/app";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { CacheProvider, EmotionCache } from "@emotion/react";
import theme from "../src/theme";
import createEmotionCache from "../src/createEmotionCache";
import "./styles.css";
import App from "../src/App";
import { ConfirmProvider } from "material-ui-confirm";

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

export default function MyApp(props: MyAppProps) {
  const {
    Component,
    emotionCache = clientSideEmotionCache,
    pageProps: { ...pageProps },
  } = props;

  const syncStorage = (event) => {
    if (event.key === "logout") {
      router.push("/auth/login");
    }
    if (!event.newValue) return;
    if (event.key === "getSessionStorage") {
      // Some tab asked for the sessionStorage -> send it
      localStorage.setItem("sessionStorage", JSON.stringify(sessionStorage));
      localStorage.removeItem("sessionStorage");
    } else if (event.key == "sessionStorage" && !sessionStorage.length) {
      // sessionStorage is empty -> fill it
      var data = JSON.parse(event.newValue);
      Object.entries(data).forEach((entry) => {
        sessionStorage.setItem(entry[0], entry[1]);
      });
    }
  };

  React.useEffect(() => {
    window.addEventListener("storage", syncStorage);
    if (!window.sessionStorage.length) {
      // Ask other tabs for session storage
      window.localStorage.setItem("getSessionStorage", Date.now().toString());
    }

    return () => {
      window.removeEventListener("storage", syncStorage);
    };
  }, []);

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <ThemeProvider theme={theme}>
        <ConfirmProvider>
          {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
          <CssBaseline />
          {Component.whitelist ? (
            <Component {...pageProps} />
          ) : (
            <App>
              <Component {...pageProps} />
            </App>
          )}
        </ConfirmProvider>
      </ThemeProvider>
    </CacheProvider>
  );
}
