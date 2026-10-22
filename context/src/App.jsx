import { createContext, useContext } from 'react'
import './App.css'
export const LoginContext = createContext()
export const DarkModeContext = createContext()
function LevelC() {
  const darkMode = useContext(DarkModeContext)
  return (
    <div className="box level-c">Z
      <h3>Level-C : Child of Level-B</h3>
      <h2 className="highlight">Value of Dark Mode is : {darkMode}</h2>
      <p className="subtitle">Shown Value of Dark Mode using Context created at Level-A</p>
    </div>
  )
}
function LevelB() {
  const loginStatus = useContext(LoginContext)

  return (
    <div className="box level-b">
      <h3>Level-B : child of Level-A</h3>
      <h2 className="highlight">Value of Login Status is : {loginStatus}</h2>
      <p className="subtitle">Shown Login Status using Context created at Level-A</p>
      <LevelC />
    </div>
  )
}
export default function App() {
  const loginStatus = 'Logged Out'
  const darkMode = 'ON'
  return (
    <LoginContext.Provider value={loginStatus}>
      <DarkModeContext.Provider value={darkMode}>
        <div className="container">
          <div className="level-a">
            <h1>Use Context Demo</h1>
            <h2>Level-A ( Top Level )</h2>
            <p className="desc">
              Context(global variable) for Login Status and Dark Mode have been created here and value also given at this top level
            </p>
            <LevelB />
          </div>
        </div>
      </DarkModeContext.Provider>
    </LoginContext.Provider>
  )
}
