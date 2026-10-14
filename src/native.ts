import { App as CapApp } from "@capacitor/app";
import { Capacitor } from "@capacitor/core";
import { Haptics, ImpactStyle, NotificationType } from "@capacitor/haptics";
import { LocalNotifications } from "@capacitor/local-notifications";
import { Share } from "@capacitor/share";

/** Thin bridge: native iOS features when running in the app, web fallbacks otherwise. */
export const isNative = () => Capacitor.isNativePlatform();

export async function tap(kind: "light" | "success" | "warning" = "light") {
  if (!isNative()) return;
  try {
    if (kind === "light") await Haptics.impact({ style: ImpactStyle.Light });
    else await Haptics.notification({ type: kind === "success" ? NotificationType.Success : NotificationType.Warning });
  } catch {
    // Haptics unavailable (simulator): ignore.
  }
}

/** Returns "shared", "copied" or "dismissed". */
export async function shareText(text: string): Promise<"shared" | "copied" | "dismissed"> {
  try {
    if (isNative()) {
      await Share.share({ text });
      return "shared";
    }
    if (navigator.share) {
      await navigator.share({ text });
      return "shared";
    }
    await navigator.clipboard.writeText(text);
    return "copied";
  } catch {
    return "dismissed";
  }
}

const REMINDER_ID = 108;
const LINES = [
  "Five quiet minutes with the Gita?",
  "Your lamp is waiting. One small step today.",
  "Krishna's next teaching is ready for you.",
  "A verse a day keeps the mind steady.",
];

/** Schedules (or cancels) the daily reminder. Asks permission the first time. */
export async function scheduleReminder(when: "morning" | "evening" | "off"): Promise<boolean> {
  if (!isNative()) return false;
  try {
    await LocalNotifications.cancel({ notifications: [{ id: REMINDER_ID }] });
    if (when === "off") return true;
    const perm = await LocalNotifications.requestPermissions();
    if (perm.display !== "granted") return false;
    await LocalNotifications.schedule({
      notifications: [
        {
          id: REMINDER_ID,
          title: "Gita",
          body: LINES[new Date().getDate() % LINES.length],
          schedule: { on: { hour: when === "morning" ? 7 : 20, minute: 0 }, allowWhileIdle: true },
        },
      ],
    });
    return true;
  } catch {
    return false;
  }
}

/** Opens gita://verse/2/47 style links (shares, notifications, Spotlight) inside the app. */
export function listenForDeepLinks(open: (path: string) => void) {
  if (!isNative()) return;
  CapApp.addListener("appUrlOpen", ({ url }) => {
    const path = url.replace(/^gita:\/\/?/, "");
    if (path) open(path);
  });
}
