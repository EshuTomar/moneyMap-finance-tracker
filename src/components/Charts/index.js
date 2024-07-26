// import { Line, Pie } from '@ant-design/charts';
// import React from 'react'

// function ChartComponent({sortedTransactions}) {
//     // const data = [
//     //     { year: '1991', value: 3 },
//     //     { year: '1992', value: 4 },
//     //     { year: '1993', value: 3.5 },
//     //     { year: '1994', value: 5 },
//     //     { year: '1995', value: 4.9 },
//     //     { year: '1996', value: 6 },
//     //     { year: '1997', value: 7 },
//     //     { year: '1998', value: 9 },
//     //     { year: '1999', value: 13 },
//     // ];
//     const data=sortedTransactions.map((item)=>{
//         return {date:item.date, amount:item.amount}
// });

//     const spendingData = sortedTransactions.filter((transaction) => {
//         if(transaction.type == "expense"){
//             return {tag: transaction.tag,
//                 amount:transaction.amount
//             }
//         }
//     });

//     let finalSpendings = spendingData.reduce((acc,obj)=>{
//         let key = obj.tag;
//         if(!acc[key]){
//             acc[key] = {tag:obj.tag, amount:obj.amount} //create new obj with same properties
//         }else{
//             acc[key].amount += obj.amount;
//         }
//         return acc
//     },{});

//     const config ={
//         // height:400,
//         width:600,
//         data:data,
//         xField: 'date',
//         yField: 'amount',
//         autoFit: true,
//         // point:{
//         //     size:5,
//         //     shape:"diamond"
//         // },
//         // label:{
//         //     style:{
//         //         fill:"#aaa"
//         //     }
//         // },
        
//     }
//     const spendingConfig ={
//         // height:400,
//         width:500,
//         // autoFit: false,
//         // spendingData,
//         data:Object.values(finalSpendings),
//         angleField:"amount",
//         colorField:"tag"
        
//     }
//     let chart;
//     let pieChart;
//   return (

//     <div className='charts-wrapper'> 
    
//     <div>
//         <h2 style={{marginTop:0}}>Your Analytics</h2>
//         <Line  {...config} onReady={(chartInstance)=> (chart = chartInstance)}  />
    
//     </div>

//     <div>
//         <h2>Your Spendings</h2>
//         {spendingDataArray.length == 0 ? (
//                     <p>Seems like you haven't spent anything till now...</p>
//                   ) : (
//                     <Pie {...spendingConfig} onReady={(chartInstance)=> (pieChart = chartInstance)}  />
//                   )}
      
    
//     </div>

  

//      </div>
//   )
// }

// export default ChartComponent



import { Line, Pie } from '@ant-design/charts';
import React from 'react';

function ChartComponent({ sortedTransactions }) {
  // Ensure sortedTransactions is an array
  const transactionsArray = Array.isArray(sortedTransactions) ? sortedTransactions : [];

  // Create the data array for the line chart
  const data = transactionsArray.map((item) => ({
    date: item.date,
    amount: item.amount,
  }));

  // Filter and map transactions to get spending data
  const spendingData = transactionsArray
    .filter((transaction) => transaction.type === "expense")
    .map((transaction) => ({
      tag: transaction.tag,
      amount: transaction.amount,
    }));

  // Reduce spendingData to aggregate amounts by tag
  const finalSpendings = spendingData.reduce((acc, obj) => {
    const key = obj.tag;
    if (!acc[key]) {
      acc[key] = { tag: obj.tag, amount: obj.amount }; // create new obj with same properties
    } else {
      acc[key].amount += obj.amount;
    }
    return acc;
  }, {});

  // Convert finalSpendings object to an array for Pie chart data
  const spendingDataArray = Object.values(finalSpendings);

  // Line chart configuration
  const config = {
    height: 400,
    width: 600,
    data: data,
    xField: 'date',
    yField: 'amount',
    autoFit: true,
  };

  // Pie chart configuration
  const spendingConfig = {
    height: 400,
    width: 500,
    data: spendingDataArray,
    angleField: 'amount',
    colorField: 'tag',
  };

  return (
    <div className='charts-wrapper'>
      <div>
        <h2 style={{ marginTop: 0 }}>Your Analytics</h2>
        <Line {...config} />
      </div>

      <div>
        <h2>Your Spendings</h2>
        {spendingDataArray.length === 0 ? (
          <p>Seems like you haven't spent anything till now...</p>
        ) : (
          <Pie {...spendingConfig} />
        )}
      </div>
    </div>
  );
}

export default ChartComponent;
