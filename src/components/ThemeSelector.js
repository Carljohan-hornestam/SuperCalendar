import React, {useContext} from "react"
import { Context } from "../App"



export default function ThemeSelector() {
  
  const themeNames = { dark: `dark-theme`, light: `light-theme`, third: `third-theme` }; 
  const [context, setContext] = useContext(Context)
  const updateContext = updates => setContext({
    ...context,
    ...updates
  })

  function setTheme(value) {
    document.documentElement.className = ""
    document.documentElement.classList.add(`${value}`)
    updateContext({ theme: value })
  }

  return <div>
    <label>Välj tema:</label>
    <select onChange={(e) => setTheme(e.target.value)}>
      <option>Välj:</option>
      { Object.entries(themeNames).map( ([key, value]) => <option value={value}>{key}</option>) }
    </select>
  </div>;
}