import React, {useContext} from "react"
import { Context } from "../App"


export default function ThemeSelector() {
  
  const themeNames = { dark: `dark-theme`, light: `light-theme` }; 
  const [context, setContext] = useContext(Context)
  const updateContext = updates => setContext({
    ...context,
    ...updates
  })

  return <div>
    <label>Välj tema:</label>
    <select onChange={(e) => updateContext({theme: e.target.value})}>
      { Object.entries(themeNames).map( ([key, value]) => <option value={value}>{key}</option>) }
    </select>
  </div>;
}