import { test as setup } from "@playwright/test";
import fs from "fs";

setup("prepare auth directory", async () => {
  if (!fs.existsSync(".auth")) {
    fs.mkdirSync(".auth");
  }
});
