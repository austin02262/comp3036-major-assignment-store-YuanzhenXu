import sharedConfig from "@repo/tailwind-config";
import type { Config } from "tailwindcss";

const config: Pick<Config, "prefix" | "presets" | "content" | "darkMode"> = {
  content: ["./src/**/*.tsx", "../../packages/ui/src/**/*.tsx"],
  presets: [sharedConfig],

  
  darkMode: ["class", '[data-theme="dark"]'],
};

export default config;