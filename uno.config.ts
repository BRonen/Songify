import { defineConfig } from "unocss";

export default defineConfig({
  theme: {
    colors: {
      latte: {
        rosewater: "#dc8a78",
        flamingo: "#dd7878",
        magenta: "#da32a4",
        pink: "#ea76cb",
        mauve: "#8839ef",
        red: "#d20f39",
        maroon: "#e64553",
        peach: "#fe640b",
        yellow: "#df8e1d",
        green: "#40a02b",
        teal: "#179299",
        sapphire: "#209fb5",
        sky: "#04a5e5",
        lavender: "#7287fd",
        blue: "#1e66f5",
        gray: "#3c3f59",
        text: "#4c4f69",
        subtext: {
          "200": "#5c5f77",
          "100": "#6c6f85",
        },
        overlay: {
          "300": "#7c7f93",
          "200": "#8c8fa1",
          "100": "#9ca0b0",
        },
        surface: {
          "300": "#acb0be",
          "200": "#bcc0cc",
          "100": "#ccd0da",
        },
        crust: "#dce0e8",
        mantle: "#e6e9ef",
        base: "#eff1f5",
      },
    },
  },
  rules: [["min-h-screen", { "min-height": "100vh" }]],
});
