
import { useEffect,useState } from "react";
import axios from 'axios'
function Test() {
  // http://simpson-api.herokuapp.com/confounder/

  const [File,SetFile]=useState("");
  const [X,SetX]=useState("");
  const [Y,SetY]=useState("");
  const [X1,SetX1]=useState("");
  const [X2,SetX2]=useState("");

const handleSum=(e)=>{
  e.preventDefault();
  const formData=new FormData();
  formData.append("data_file",File)
  formData.append("x",X)
  formData.append("y",Y)
  formData.append("x1",X1)
  formData.append("x2",X2)

  fetch("http://simpson-api.herokuapp.com/confounder/",{
    method:"POST",
    body:formData 
  }).then(res=>res.json()).then(res=>console.log(res))
}

  return (
    <div className="App">
    <h1>Please Enter Values</h1>
     <form onSubmit={(e)=>handleSum(e)}>
       <input type="file" name="" onChange={(e)=>SetFile(e.target.files[0])} id="" />
       <input type="text" name="" onChange={(e)=>SetX(e.target.value)} id="" />
       <input type="text" name="" onChange={(e)=>SetY(e.target.value)} id="" />
       <input type="text" name="" onChange={(e)=>SetX1(e.target.value)} id="" />
       <input type="text" name="" onChange={(e)=>SetX2(e.target.value)} id="" />
      <button className="btn">Show</button>
    </form>
    </div>
  );
}

export default Test;
