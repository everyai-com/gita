import { Capacitor } from "@capacitor/core";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import { listenForDeepLinks } from "./native";
import { go } from "./router";
import { restoreFromDevice } from "./store";
import "@fontsource-variable/fraunces";
import "@fontsource-variable/figtree";
import "@fontsource/tiro-devanagari-sanskrit";
import "@fontsource-variable/noto-sans-devanagari";
import "./styles/sahadeva-tokens.css";
import "./styles/sahadeva-components.css";
import "./styles/app.css";

// Restore the native progress backup before rendering, so no early write can overwrite it.
restoreFromDevice().finally(() => {
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
  listenForDeepLinks(go);
});

// The service worker gives the web build offline support; the native app is offline already.

if ("serviceWorker" in navigator && import.meta.env.PROD && !Capacitor.isNativePlatform()) {
  window.addEventListener("load", () => navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`));
}
