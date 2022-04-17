import React, { useEffect, useState } from 'react'
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select'

function AddtionalValues({label,name,columnValues,Xvalue,AllData,SetallData}) {
 const [Main,SetMain]=useState('')
 const [SecondMain,SetSecondMain]=useState('')
  const [ColumnLength,SetColumnLength]=useState([])
const checkValue=()=>{ 
  Xvalue&& Object.keys(columnValues).map(keys=>{

  if(keys===Xvalue){
    SetColumnLength(columnValues[keys]);
    columnValues[keys].length===2? (name==='x1'? 
    SetMain(columnValues[keys][0]):
    SetMain(columnValues[keys][1]))  :SetMain('')

    if( columnValues[keys].length===2){
    
        if(Main){
          SetallData({...AllData,x1:columnValues[keys][0]})
          console.log('yes',name,columnValues[keys][0]);
          console.log(AllData);
        }
        else{
          console.log('no',name);
          SetallData({...AllData,x2:columnValues[keys][1]})
          console.log(AllData);
        }
    }
    else{
      SetMain('')
    }
    
  
  }
})
 }
useEffect(()=>{
  SetColumnLength([]);
checkValue()
},[AllData['x'],Main,AllData['data_file']])
 
  const handleChange = (e) => {
    let name=e.target.name;
    let value=e.target.value;
    SetMain(value)
    SetSecondMain(value)
    console.log(value,Main);
    SetallData({...AllData,[name]:value})
  };


  return (
    <div style={{width:140,display:"inline-block",marginInline:"10px"}}>
     <FormControl fullWidth>
        <InputLabel id="SelectBox">{label}</InputLabel>
        <Select
          labelId="SelectBox"
          id="demo-simple-select"
          label={label}
          name={name}
          value={ColumnLength.length<3? Main :SecondMain}
          disabled={ColumnLength.length<2 || !Xvalue}        
         onChange={handleChange}
        >
          {
            Xvalue&& Object.keys(columnValues).map(keys=>{

              if(keys===Xvalue){
              return  columnValues[keys].map((row,index)=>(
                  <MenuItem key={index} value={row}>{row}</MenuItem>
                ))
              }
            
            }) 
          }
         
         
          
        </Select>
      </FormControl>
    </div>
  )
}


export default AddtionalValues