import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/get-departments": "http://localhost:5000",
      "/get-halls": "http://localhost:5000",
      "/get-exams": "http://localhost:5000",
      "/generate-seating": "http://localhost:5000"
    }
  }
});
