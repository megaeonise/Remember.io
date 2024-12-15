import { useState } from "react"
import "./App.css"

const App = () => {
  const [color, setColor] = useState('red')
  var colorCount = 0
  const colorArray = ['blue', 'green', 'red']

  const colorChanger = () => {
    console.log('color change requested')
    setColor(colorArray[colorCount])
    colorCount = colorCount + 1

    if (colorCount > 2) colorCount = 0

  }
  console.log(colorCount)
  return (
    
    <div>
      <button onClick = {colorChanger} className = {color}>
        Good
      </button>
    </div>
  )
}
export default App