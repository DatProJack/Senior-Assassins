 // {inputValue: asdfadfa, handleSubmit: asdfadf}
import axios from 'axios'
import {useState} from 'react'
import {useNavigate} from 'react-router-dom'
export default function StudentSignUp(props){
  
  const navigate = useNavigate()
  const [inputValue, setInputValue] = useState({name: "", email:"", target: ""})
  const validEmail = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(inputValue.email) || inputValue.email==""
  const validEmailMessage = validEmail? "": <div style={{textAlign:"left", padding: "0", color: "red", fontSize:".8rem"}}>*Please enter a valid email</div>

  const validName = /[^\d\s]/.test(inputValue.name) || inputValue.name==""
  
  console.log(validName)
  function handleSubmit(event){
    event.preventDefault();
    console.log(inputValue.name)
    axios.post("https://backend.yaseenhalabi4.repl.co/students", inputValue)
      .then(response => {
        navigate("/success")
        console.log(response.data)
      })
      .catch(error => console.log(error))
  }
  
  return(
    
    <div className="align-left text-center">
      <h1 className="mt-3">SIGN UP</h1>
      <form onSubmit={handleSubmit} className="row" style={{width: "30%", marginLeft: "35%"}}>
        {/* name */}
        <div style={{textAlign: "left", padding: "0"}}><strong>Name</strong></div>
        <input type="text" value={inputValue.name} onChange={(e) => setInputValue({...inputValue, name: e.target.value.toUpperCase()})}/>
        
        {/* email */}
        <div style={{textAlign: "left", padding: "0", marginTop: "1%"}}><strong>Email</strong></div>
        <input type="text" value={inputValue.email} onChange={(e) => setInputValue({...inputValue, email: e.target.value})}/>
        {validEmailMessage}
        <input className="mt-3" type="submit"></input>
      </form>
    </div>
  )
}