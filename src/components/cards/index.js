import React from 'react'
import "./style.css";
import { Card, Row } from 'antd';
import Button from "../Button"

function Cards({income, expense, totalBalance, showExpenseModal,showIncomeModal,resetBalance}) {
  return (
    <div>
      <Row className='my-row'>

      <Card className='my-card' title="Current Balance"  >
        <p>₹{totalBalance}</p>
        <Button blue={true}  text="Reset Balance" onClick={resetBalance}/>
        
        </Card>

        <Card className='my-card' title="Total Income"  >
        <p>₹{income}</p>
        <Button text="Add Income"  blue={true} onClick={showIncomeModal} />
        
        </Card>

        <Card className='my-card' title="Total Expenses" >
        <p>₹{expense}</p>
        <Button text="Add Expense"  blue={true} onClick={showExpenseModal} />
        
        </Card>

        

      </Row>
    </div>
  )
}

export default Cards;
