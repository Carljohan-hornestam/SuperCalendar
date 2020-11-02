import React from "react"

export function ThemeWrapper({ children, themeName }) {
  console.log("themename: ", themeName);
  return <div className={themeName}>{children}</div>;
}