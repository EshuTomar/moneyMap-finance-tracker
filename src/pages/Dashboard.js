import React, { useEffect, useState } from 'react'
import Header from '../components/Header'
import Cards from '../components/cards'
import { Modal } from 'antd';
import moment from "moment";
import AddExpense from '../components/modals/addExpense';
import AddIncome from '../components/modals/addIncome';
import { toast } from 'react-toastify';
import { addDoc, collection, deleteDoc, doc, getDocs, query } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import TransactionTable from '../components/TransactionTables';
import ChartComponent from '../components/Charts';
import NoTransactions from '../components/NoTransactions';


function Dashboard() {

  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [user] = useAuthState(auth);
  const [isExpenseModalVisible, setIsExpenseModalVisible] = useState(false);
  const [isIncomeModalVisible, setIsIncomeModalVisible] = useState(false);
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [totalBalance, setTotalBalance] = useState(0);

  const showExpenseModal = () => {
    setIsExpenseModalVisible(true);
  };
  
  const showIncomeModal = () => {
    setIsIncomeModalVisible(true);
  };
  
  const handleExpenseCancel = () => {
    setIsExpenseModalVisible(false);
  };
  
  const handleIncomeCancel = () => {
    setIsIncomeModalVisible(false);
  };

  const onFinish = (values, type) => {
    const newTransaction = {
      type: type,
      date: values.date.format("YYYY-MM-DD"),
      amount: parseFloat(values.amount),
      tag: values.tag,
      name: values.name,
    };
      
    addTransaction(newTransaction);
  };

  async function addTransaction(transaction) {
    try {
      const docRef = await addDoc(
        collection(db, `users/${user.uid}/transactions`),
        transaction
      );
      toast.success("Transaction Added!");
      let newArr = [...transactions, { ...transaction, id: docRef.id }];
      setTransactions(newArr);
      calculateBalance();
    } catch (e) {
      console.error("Error adding document: ", e);
      toast.error("Couldn't add transaction");
    }
  }

  useEffect(() => {
    fetchTransactions();
  }, [user]);

  async function fetchTransactions() {
    setLoading(true);
    if (user) {
      const q = query(collection(db, `users/${user.uid}/transactions`));
      const querySnapshot = await getDocs(q);
      let transactionsArray = [];
      querySnapshot.forEach((doc) => {
        transactionsArray.push({ ...doc.data(), id: doc.id });
      });
      setTransactions(transactionsArray);
      toast.success("Transactions Fetched!");
    }
    setLoading(false);
  }

  useEffect(() => {
    calculateBalance();
  }, [transactions]);

  const calculateBalance = () => {
    let incomeTotal = 0;
    let expensesTotal = 0;

    transactions.forEach((transaction) => {
      if (transaction.type === "income") {
        incomeTotal += transaction.amount;
      } else {
        expensesTotal += transaction.amount;
      }
    });

    setIncome(incomeTotal);
    setExpense(expensesTotal);
    setTotalBalance(incomeTotal - expensesTotal);
  };

  const resetBalance = async () => {
    setLoading(true);
    try {
      for (const transaction of transactions) {
        const docRef = doc(db, `users/${user.uid}/transactions`, transaction.id);
        await deleteDoc(docRef);
      }
      setTransactions([]);
      setIncome(0);
      setExpense(0);
      setTotalBalance(0);
      toast.success("Balance Reset Successfully!");
    } catch (error) {
      console.error("Error resetting balance: ", error);
      toast.error("Couldn't reset balance");
    }
    setLoading(false);
  };

  let sortedTransactions = transactions.sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <div>
      <Header />
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <Cards
            income={income}
            expense={expense}
            totalBalance={totalBalance}
            showExpenseModal={showExpenseModal}
            showIncomeModal={showIncomeModal}
            resetBalance={resetBalance}
          />
          {transactions && transactions.length !== 0 ? (
            <ChartComponent sortedTransactions={sortedTransactions} />
          ) : (
            <NoTransactions />
          )}
          <AddExpense
            isExpenseModalVisible={isExpenseModalVisible}
            handleExpenseCancel={handleExpenseCancel}
            onFinish={onFinish}
          />
          <AddIncome
            isIncomeModalVisible={isIncomeModalVisible}
            handleIncomeCancel={handleIncomeCancel}
            onFinish={onFinish}
          />
          <TransactionTable transactions={transactions} />
        </>
      )}
    </div>
  );
}

export default Dashboard;
