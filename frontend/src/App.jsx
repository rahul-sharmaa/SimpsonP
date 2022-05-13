
import { Typography, Button, Paper, Input } from '@mui/material';
import Container from '@mui/material/Container';
import axios from 'axios'
import { useEffect, useState } from 'react';
import DataTable from './components/DataTable';
import SelectBox from './components/SelectBox';
import AddtionalValues from './components/AddtionalValues';
import CircularProgress from '@mui/material/CircularProgress';
import { green } from '@mui/material/colors';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import RingLoader from "react-spinners/RingLoader";
function App() {
  
  const [loading,Setloading]=useState(true)
  const [fileLoading,SetfielLoading]=useState(false) 
  const [DataLoading,SetDataLoading]=useState(false) 
  const [data,SetData]=useState({})
  const [columnValues,setcolumnValues]=useState([]);
  const [Xvalue,setXvalue]=useState(null);
  const [column,setcolumn]=useState([]);
  const [file,Setfile]=useState([])
  const formData=new FormData();
  const [success,Setsuccess]=useState(false)
  const [AllData,SetallData]=useState({
    x1:"A",
    x2:'B'
  })

  
  useEffect(()=>{
   if(data){
    window.scrollTo({
      top: 650,
      behavior: 'smooth'
    });
   }
  },[data])

  const buttonSx = {
    ...(  success && {
      bgcolor:green[500]
    }),
  }
const handleFile=(e)=>{
  SetfielLoading(true)
  SetData({})
  Setfile(e.target.files[0])
  const ColumnData=new FormData();
  ColumnData.append('data_file',e.target.files[0])
  axios.post("https://v08bpt.deta.dev/dropdown/",ColumnData).then(res=>res.data)
  .then(res=>{
    setcolumn(JSON.parse(res.columns))
    setcolumnValues(JSON.parse(res.column_values))
    SetfielLoading(false)
    Setsuccess(true);
  });
} 


const handleSumbit=(e)=>{
  e.preventDefault();
  SetDataLoading(true)
  SetData([])
  for(let key in AllData){
    formData.append(key,AllData[key])
  }
  formData.append('data_file',file);
  axios.post("https://v08bpt.deta.dev/confounder/",formData).then(res=>res.data).then(res=>{
    SetData(res);
    console.log(res);
    SetDataLoading(false)
 }
 ).catch((error) => {
  SetDataLoading(false)
  SetData({})
  toast.error(`Backend Server Error,
  Incorrect text fields!`, {
    position: "top-center",
    autoClose: 3000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: 0,
    });
})
 Setsuccess(false)

}

useEffect(()=>{
  setTimeout(()=>{
    Setloading(false)
  },1800)
},[])
  return (
  <>
 { loading? 
   <div className="sweet-loading">
   <RingLoader color={"#1976D2"} loading={loading}  size={200} />
 </div>:
    <div className="App">
    <Container align="center" sx={{paddingTop:"20px"}}>
    <ToastContainer/>
{/* Same as */}
<ToastContainer />
     <Paper sx={{paddingBlock:"40px",marginBottom:"40px"}} elevation={6}>
     <Typography variant='h3' color="primary">
      Simpson's Paradox
      </Typography>
     <Typography variant='h6' color="primary" sx={{marginTop:"30px",marginBottom:"20px"}}>
    The first step is to drop your file
      </Typography>
      <form>
      
       
      <div>
      <label htmlFor="contained-button-file">
        <Input  id="contained-button-file" sx={{display:"none"}} name="file" value={AllData.data_file} onChange={(e)=>handleFile(e) }  type="file" />
        <Button variant="contained" sx={buttonSx} disabled={fileLoading} component="span">
        {fileLoading && (
          <CircularProgress
            size={24}
            sx={{
              color:"green",
              position: 'absolute',
              top: '50%',
              left: '50%',
              marginTop: '-12px',
              marginLeft: '-12px',
            }}
          />
        )}
          Upload
        </Button>
        {file? <div><h3>{file.name}</h3></div>:''}
      </label>
        {/* <TextField id="outlined-basic" type="file"  variant="outlined" /> */}
      </div>
      <Typography variant='h6' color="primary" sx={{marginTop:"20px",marginBottom:"10px"}}>
    The second step is to choose values
      </Typography>

     <div> 
          <SelectBox column={column} SetallData={SetallData} AllData={AllData}  formData={formData} setXvalue={setXvalue}  name="x" label={"X-value"}/> 
          <SelectBox column={column} SetallData={SetallData} AllData={AllData} formData={formData} name="y"  label={"Y-value"}/> 
     </div>
     
      <div>
     
          <AddtionalValues columnValues={columnValues} SetallData={SetallData} AllData={AllData} Xvalue={Xvalue} name="x1" label={"X1-value"}/> 
          <AddtionalValues columnValues={columnValues} SetallData={SetallData} AllData={AllData}   Xvalue={Xvalue} name="x2" label={"X2-value"}/> 
      </div>
    
        <Button onClick={(e)=>handleSumbit(e)} component="button" disabled={DataLoading}  sx={{paddingInline:"50px",marginTop:"30px"}} variant="contained">Show
        {DataLoading && (
          <CircularProgress
            size={24}
            sx={{
              color:green[500],
              position: 'absolute',
              top: '50%',
              left: '50%',
              marginTop: '-12px',
              marginLeft: '-12px',
            }}
          />
        )}
        </Button>
      </form>
     </Paper>

   { data.confounding_variable&&
      <DataTable data={data}/>} 
    </Container>
    </div>}
    </>
  );
}

export default App;
