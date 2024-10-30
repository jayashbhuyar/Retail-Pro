import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // server: {
  //   host:'0.0.0.0', // Alternatively, use '0.0.0.0' to listen on all network interfaces
  //   port: 5173, // Default port (can be changed)
  //   open: true, // Automatically open the app in the default browser
  // },
});
