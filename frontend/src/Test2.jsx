
import { Typography,Box, Button, Paper } from '@mui/material';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import { makeStyles } from '@mui/styles';
import axios from 'axios'
import { useState } from 'react';
import upload from './images/upload.png'
function Test2() {
  const useStyles = makeStyles({
    input:{
      margin: '10px !important',
    }
  });
  const classes = useStyles();
  const [file,Setfile]=useState()
const formData=new FormData();

const handleFile=(e)=>{
  formData.append("data_file",e.target.files[0]);
  let a=formData.get("data_file");
}

const handleInp=(e)=>{
  let name=e.target.name;
  let value=e.target.value;
  formData.append([name],value)
}

const handleSumbit=(e)=>{
  e.preventDefault();
  
  axios.post("http://simpson-api.herokuapp.com/confounder/",formData).then(res=>res.data).then(res=>console.log(res))
}

  return (
    <div className="App">
    <Container align="center" sx={{paddingTop:"20px"}}>
     <Paper sx={{paddingBlock:"40px"}} elevation={6}>
     <Typography variant='h3' color="primary">
      Please Enter Values
      </Typography>
      <form>
     <div> 
          <TextField id="outlined-basic" onChange={(e)=>handleInp(e)} name="x" className={classes.input} label="Value for X" variant="outlined" />
          <TextField id="outlined-basic" onChange={(e)=>handleInp(e)} name="y"  className={classes.input} label="Value for Y" variant="outlined" />
     </div>
     
      <div>
          <TextField id="outlined-basic" onChange={(e)=>handleInp(e)} name="x1" className={classes.input}  label="Value for X1" variant="outlined" />
          <TextField id="outlined-basic" onChange={(e)=>handleInp(e)} name="x2" className={classes.input}  label="Value for X2" variant="outlined" />
      </div>

        <label className='file'>
      
         
           
           <img src={upload} style={{width:"50px",display:"block !important"}} alt="" />
              Upload Your Csv File
        
        
        <input type="file" name="file" onChange={(e)=>handleFile(e)}  id="" />
        </label>
        <Button onClick={(e)=>handleSumbit(e)} component="button" sx={{paddingInline:"50px",marginTop:"30px"}} variant="contained">Show</Button>
      </form>
     </Paper>
    </Container>
    </div>
  );
}

export default Test2;
