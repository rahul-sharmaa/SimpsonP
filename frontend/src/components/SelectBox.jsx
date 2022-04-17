import React, { useEffect, useState } from 'react'
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select'
function SelectBox({label,name,column,setXvalue,AllData,SetallData}) {
 const [MainValue,SetMainValue]=useState('')

  const handleChange = (e) => {
    let name=e.target.name;
    let value=e.target.value;
    SetMainValue(value)
    SetallData({...AllData,[name]:value})

    if(setXvalue){
      setXvalue(value)
    }

  };
  return (
    <div style={{width:150,display:"inline-block",marginInline:"10px",marginBlock:"20px"}}>
     <FormControl fullWidth>
        <InputLabel id="SelectBox">{label}</InputLabel>
        <Select
          labelId="SelectBox"
          id="demo-simple-select"
          label={label}
          name={name}
          value={MainValue}
          disabled={!column.length}        
         onChange={handleChange}
         
        >
          {
            column.map((row,index)=>(
              <MenuItem key={index} value={row}>{row}</MenuItem>
            ))
          }
         
         
          
        </Select>
      </FormControl>
    </div>
  )
}

export default SelectBox