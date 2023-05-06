 // {inputValue: asdfadfa, handleSubmit: asdfadf}
import axios from 'axios'
import {useState} from 'react'
import {useNavigate} from 'react-router-dom'
export default function SubmitKill(props){
  
  const navigate = useNavigate()
  const [inputValue, setInputValue] = useState({name1: "", name2: ""})
  
  function handleSubmit(event){
    event.preventDefault();
    
    axios.post("https://backend.yaseenhalabi4.repl.co/killRequests", inputValue)
      .then(response => {
        navigate("/success")
        console.log(response.data)
      })
      .catch(error => console.log(error))
  }
  
  return(
    
    <div className="align-left text-center">
      <h3 className="mt-3">Submit a Tag:</h3>
      <form onSubmit={handleSubmit} className="row" style={{width: "30%", marginLeft: "35%"}}>

        <div style={{textAlign: "left", padding: "0"}}><strong>Your Name:</strong></div>
        <input type="text" value={inputValue.name1} onChange={(e) => setInputValue({...inputValue, name1: e.target.value.toUpperCase()})}/>
        <div style={{textAlign: "left", padding: "0", marginTop: "1%"}}><strong>Victim's Name:</strong></div>
        <input type="text" value={inputValue.name2} onChange={(e) => setInputValue({...inputValue, name2: e.target.value.toUpperCase()})}/>
        <input className="mt-3" type="submit"></input>
        <div style={{textAlign:"left", padding: "0", color: "red", fontSize:".8rem"}}>*all kills are checked for authenticity</div>

      </form>
    </div>
  )
} 