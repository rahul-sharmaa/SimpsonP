import { Typography,Container,Paper } from '@mui/material'
import React from 'react'

function DataTable({data}) {
  return (
    <Container>
       <Paper sx={{paddingBlock:"30px"}}>
         <div>
          <Typography variant='h3' sx={{marginBottom:"30px"}} color="error" className='title'>{data.reversed_params===1? "Simpson's Paradox DETECTED":"Simpson's Paradox Not DETECTED" }</Typography>
          <Typography variant='h3' className='title'>Confounding variable: <Typography variant='h3' component={"span"} color={"error"}>{data.confounding_variable}</Typography></Typography>
      
          <Typography variant='h5' className='title' sx={{marginBlock:"30px"}}>The proportion of reversed associations in subgroups: <Typography variant='h4' component={"span"} color={"error"}> {data.reversed_params&&data.reversed_params*100+"%"}</Typography></Typography>
          {
            data.response&&
            <img src={data.response} width='100%' height='800' alt="" />
          }
        {
          data.agg_data&&
         <div>
              <div>
              <table aria-label="custom pagination table">
              <caption><Typography variant='h4' sx={{marginBottom:"20px"}}>Aggregated Data</Typography></caption>
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
                 {item}
                  </td>
                  ))}
                </tr>
              ))}
            </tbody>
             </table>
              </div>
    
              <div>
              <table aria-label="custom pagination table">
              <caption><Typography variant='h4' sx={{marginBottom:"20px"}}>Disaggregated Data</Typography></caption>
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
                 {item}
                  </td>
                  ))}
                </tr>
              ))}
            </tbody>
             </table>
              </div>
    
              <div>
              <table aria-label="custom pagination table">
              <caption><Typography variant='h4' sx={{marginBottom:"20px"}}>Aggregated Data with adjustments</Typography></caption>
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
                 {item}
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
        
     </Paper>
    </Container>
  )
}

export default DataTable
