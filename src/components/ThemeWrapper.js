import React from "react"

export function ThemeWrapper({ children, themeName }) {
  return <div className={themeName}>{children}</div>;
}