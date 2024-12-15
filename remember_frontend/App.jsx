import { useState } from "react"
import "./App.css"

const App = () => {
  const [color, setColor] = useState('red')
  const [colorcount, setcolorCount] = useState(0)
  const colorArray = ['blue', 'green', 'red']

  const colorChanger = () => {
    console.log(colorcount)
    console.log('color change requested')
    setColor(colorArray[colorcount])
    setcolorCount(colorcount+1)
    if (colorcount >= 2) setcolorCount(0)
  }

  return (
    
    <div>
      <button onClick = {colorChanger} className = {color}>
        Good
      </button>
    </div>
  )
}
export default App