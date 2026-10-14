import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.everyai.gita",
  appName: "Gita",
  webDir: "dist",
  ios: { contentInset: "never", backgroundColor: "#f7f6f2", scheme: "Gita" },
  plugins: {
    SplashScreen: { launchShowDuration: 600, backgroundColor: "#f7f6f2", showSpinner: false },
    LocalNotifications: { iconColor: "#b87327" },
  },
};

export default config;
