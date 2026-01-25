import { heroui } from "@heroui/theme";

export default heroui({
  themes: {
    light: {
      colors: {
        background: "#FFFFFF",
        foreground: "#11181C",
        primary: {
          DEFAULT: "#7F56D9",
          foreground: "#FFFFFF",
        },
      },
    },
    dark: {
      colors: {
        background: "hsl(210 5.56% 3.92%)",
        foreground: "hsl(210 5.56% 92.94%)",
        primary: {
          DEFAULT: "#7F56D9",
          foreground: "#FFFFFF",
        },
        focus: "#7F56D9",
      },
      layout: {
        hoverOpacity: 0.9,
        boxShadow: {
          small: "0px 0px 5px 0px rgba(0,0,0,0.05), 0px 2px 10px 0px rgba(0,0,0,0.2)",
          medium: "0px 0px 15px 0px rgba(0,0,0,0.06), 0px 5px 20px 0px rgba(0,0,0,0.3)",
          large: "0px 0px 30px 0px rgba(0,0,0,0.07), 0px 10px 40px 0px rgba(0,0,0,0.4)",
        },
      },
    },
  },
});
