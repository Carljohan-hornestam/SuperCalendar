import React, { useEffect, useState } from "react"
import { Input } from "reactstrap";


export default function ThemeSelector(props) {
  
  const themeNames = { dark: `dark-theme`, light: `light-theme`, third: `third-theme` }; 
  const [theme, setTheme] = useState('dark-theme')

  useEffect(() => {
    setTheme(props.theTheme);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function setThemeChoice(value) {
    document.documentElement.className = ""
    document.documentElement.classList.add(`${value}`)

    setTheme(value)
    props.parentCallback(value)
  }

  return <div>
    <Input
      type="select"
      value={theme}
      className="form-control"
      onChange={(e) => setThemeChoice(e.currentTarget.value)}>
      {Object.entries(themeNames).map(([key, value]) => <option key={key} value={value}>{value}</option>) }
    </Input>
  </div>;
}