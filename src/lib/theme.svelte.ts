import { createPubSub } from "./pub";

type Theme = "dark" | "light";

const pub = createPubSub(["themeChange"]);
const { on, cleanup } = pub.managedSubscriber();

class ThemeManager {
  theme: Theme = "light";

  init() {
    if (typeof window !== "undefined") {
      let theme = localStorage.getItem("theme");
      const defaultToDark =
        !theme &&
        window.matchMedia("(prefers-color-scheme: dark)").matches;

      if (theme === "dark" || defaultToDark) {
        document.documentElement.classList.add("dark");
        this.theme = "dark";
      } else {
        document.documentElement.classList.remove("dark");
        this.theme = "light";
      }
    }
  }

  toggle() {
    this.theme = this.theme === "dark" ? "light" : "dark";
    document.documentElement.classList.toggle("dark");
    window.localStorage.setItem("theme", this.theme);
    pub.publish("themeChange", this.theme);
  }

  on = on;
  off = cleanup;
}

export const themeManager = new ThemeManager();
