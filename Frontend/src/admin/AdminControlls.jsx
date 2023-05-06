
import {useState, useEffect} from 'react';
import axios from 'axios'





export default function AdminControlls() {
  const [data, setData] = useState([]);
  // [{name1: name2}...]
  useEffect(() => {
    axios
      .get('https://backend.yaseenhalabi4.repl.co/killRequests')
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => console.log(error));
  }, []);

  
            
  const removeFromSight = (objectToRemove) => {
    setData(
      data.filter(item => item._id != objectToRemove._id)
    )

     axios
      .delete('https://backend.yaseenhalabi4.repl.co/killRequests/' + objectToRemove._id)
      .then((response) => {
        console.log(response)
      })
      .catch((error) => console.log(error));
  }

  const submitKill = (objectToSubmit) => {
    removeFromSight(objectToSubmit)

    axios
      .post('https://backend.yaseenhalabi4.repl.co/kill', objectToSubmit)
      .then((response) => {
        console.log(response)
      })
      .catch((error) => console.log(error));
    
  }
    
  
  const requests = data.map((item, key) => {
    return(
      <div key={key} className="row">
        <div className="col">{item.name1}</div>
        <div className="col">{item.name2}</div> 
        <div className="col">
          <button onClick={() => {removeFromSight(item)}}>NO</button>
          <button onClick={() => {submitKill(item)}}>yes</button>
        </div>
        
      </div>
      
    )
  })
  
  return (
    <div className="container-lg">
      {requests}
    </div>
  )
}
