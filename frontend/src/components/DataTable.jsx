import { Typography,Container,Paper } from '@mui/material'
import React from 'react'

function DataTable({data}) {
  return (
    <Container>
       <Paper sx={{paddingBlock:"30px"}}>
         <div>
          <Typography variant='h3' sx={{marginBottom:"30px"}}  className='title'>
          Simpson's Paradox <Typography variant='h3' component={"span"}  color="error">{data.reversed_params===0? "Not DETECTED":" DETECTED" }</Typography></Typography>
          <Typography variant='h3' sx={{marginBottom:"30px"}}  className='title'>
         Form:<Typography variant='h3' component={"span"}  color="error">{data.agg_data? " Relative Rates":" Linear Rates" }</Typography></Typography>
          <Typography variant='h3' className='title'>Confounding variable: <Typography variant='h3' component={"span"} color={"error"}>{data.confounding_variable}</Typography></Typography>
      
          <Typography variant='h5' className='title' component={"div"} sx={{marginTop:"20px",marginBottom:"50px"}}>
          The Subgroups which exhibit reversal: <Typography variant='h5' component={"h5"} color={"error"}>
               {data.revs.map((item,index)=>(
                 <span key={index}>{index!==0? ',':''}"{item}"</span>
               ))}</Typography></Typography>
         
        {
          data.agg_data&&
         <div>
              <div>
              <table aria-label="custom pagination table">
              <caption>
                <Typography variant='h4' sx={{marginBottom:"20px"}}>Aggregated Data</Typography>
                <Typography variant='p' component={"h5"} sx={{marginBottom:"20px",color:"gray"}}>Description: Aggregated Data representing 
                average "{Object.keys(data.agg_data[0])[1]}" rate/amount for each "{Object.keys(data.agg_data[0])[0]}"</Typography>
                </caption>
            <thead>
              <tr>
             { Object.keys(data.agg_data[0]).map((heading,b)=>(
                <th key={b}>{heading}</th>
              ))}
                               
              </tr>
            </thead>
            <tbody>
            {data.agg_data.map((row,index) => (
                <tr key={index}>
                  {Object.values(row).map((item,b)=>(
                    <td key={b} style={{ width: 160 }} align="center">
                      
                      {Object.keys(data.agg_data[0]).length===b+1?   Number(item).toFixed(4):item}
                  </td>
                  ))}
                </tr>
              ))}
            </tbody>
             </table>
              </div>
    
              <div>
              <table aria-label="custom pagination table">
              <caption><Typography variant='h4' sx={{marginBottom:"20px"}}>Disaggregated Data</Typography>
              <Typography variant='p' component={"h5"} sx={{marginBottom:"20px",color:"gray"}}>Description: Disaggregated Data representing 

              average "{Object.keys(data.disagg_date[0])[2]}" rate/amount for each "{Object.keys(data.disagg_date[0])[0]}" 
              conditioning by "{Object.keys(data.disagg_date[0])[1]}"</Typography>
              </caption>
            <thead>
              <tr>
              { Object.keys(data.disagg_date[0]).map((heading,b)=>(
                <th key={b}>{heading}</th>
              ))}
              </tr>
            </thead>
            <tbody>
            {data.disagg_date.map((row,index) => (
                <tr key={index}>
                  {Object.values(row).map((item,b)=>(
                    <td key={b} style={{ width: 160 }} align="center">
                 {Object.keys(data.disagg_date[0]).length===b+1?   Number(item).toFixed(4):item}
                  </td>
                  ))}
                </tr>
              ))}
            </tbody>
             </table>
              </div>
    
              <div>
              <table aria-label="custom pagination table">
              <caption><Typography variant='h4' sx={{marginBottom:"20px"}}>Aggregated Data with adjustments</Typography>
              <Typography variant='p' component={"h5"} sx={{marginBottom:"20px",color:"gray"}}>Description:
               Adjusted Aggregated Data representing average "{Object.keys(data.fixed_agg_data[0])[1]}" rate/amount for each
                 "{Object.keys(data.fixed_agg_data[0])[0]}" .
               IPW method is used to balance the data distribution illustrated below during the aggregation.</Typography>
              </caption>
            <thead>
              <tr>
              { Object.keys(data.fixed_agg_data[0]).map((heading,b)=>(
                <th key={b}>{heading}</th>
              ))}
               
              </tr>
            </thead>
            <tbody>
            {data.fixed_agg_data.map((row,index) => (
                <tr key={index}>
                  {Object.values(row).map((item,b)=>(
                    <td style={{ width: 160 }} key={b} align="center">
                 {Object.keys(data.fixed_agg_data[0]).length===b+1?   Number(item).toFixed(4):item}
                  </td>
                  ))}
                </tr>
              ))}
            </tbody>
             </table>
              </div>
         </div>
}
         </div>
         {
            data.dist&&
            <div>
              <Typography variant='h4' sx={{marginBottom:"20px"}}>Data Distribution </Typography>
              <Typography variant='p' component={"h5"} sx={{marginBottom:"20px",color:"gray"}}>
                Distribution of data instances among the subgroups of the confounding variable in original data.<br/> 
              Uneven distribution of data causes the paradox.</Typography>
               <img src={data.dist} width='100%' height='400' alt="" />
            </div>
          }
         {
            data.response&&
          <div>
              <Typography variant='h4' className='Graphic'>Graphical Representation </Typography>
            <img src={data.response} width='100%' className='Graphic-img' height='800' alt="" />
          </div>
          }
          
     </Paper>
    </Container>
  )
}

export default DataTable
