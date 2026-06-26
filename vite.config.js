import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  build: {
    cssTarget: ["chrome90", "safari14"],
    cssMinify: false,
  },
  plugins: [react()],
});
