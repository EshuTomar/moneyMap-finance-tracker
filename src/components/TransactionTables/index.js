import { Radio, Select, Table } from 'antd';
import React, { useState } from 'react';
import searchImg from "../../assets/search.svg";
import "./style.css";

function TransactionTable({ transactions }) {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [sortKey, setSortKey] = useState("");
  // const [selectedTag, setSelectedTag] = useState("");
  // const [searchTerm, setSearchTerm] = useState("");
  const {Option} = Select;

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
    },
    {
      title: 'Tag',
      dataIndex: 'tag',
      key: 'tag',
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
    },
  ];

  const filteredTransactions = transactions.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase()) && item.type.includes(typeFilter)
  );

  // const filteredTransactions = transactions.filter((transaction) => {
  //   const searchMatch = searchTerm
  //     ? transaction.name.toLowerCase().includes(searchTerm.toLowerCase())
  //     : true;
  //   const tagMatch = selectedTag ? transaction.tag === selectedTag : true;
  //   const typeMatch = typeFilter ? transaction.type === typeFilter : true;

  //   return searchMatch && tagMatch && typeMatch;
  // });

  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    if (sortKey === "date") {
      return new Date(a.date) - new Date(b.date);
    } else if (sortKey === "amount") {
      return a.amount - b.amount;
    } else {
      return 0;
    }
  });

  

  const dataSource = sortedTransactions.map((transaction, index) => ({
    key: index,
    ...transaction,
  }));


  return (
    <>
      <div
      style={{
        width: "95%",
        padding: "0rem 2rem",
      }}
    >
    <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "1rem",
          alignItems: "center",
          marginBottom: "1rem",
        }}
      >

        
        <div className='input-flex'>
            <img src={searchImg} width="16" />
            <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name"
        />
        </div>
     

      <Select
        className='select-input'
        onChange={(value)=> setTypeFilter(value)}
        value={typeFilter}
        placeholder="Filter"
        allowClear
      >
        <Option value="">All</Option>
        <Option value="income">Income</Option>
        <Option value="expense">Expense</Option>

      </Select>
      </div>
      <div className="my-table">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            marginBottom: "1rem",
          }}
        >
          <h2>Your Transactions</h2>

      <Radio.Group
            className="input-radio"
            onChange={(e) => setSortKey(e.target.value)}
            value={sortKey}
          >
            <Radio.Button value="">No Sort</Radio.Button>
            <Radio.Button value="date">Sort by Date</Radio.Button>
            <Radio.Button value="amount">Sort by Amount</Radio.Button>
          </Radio.Group>
          </div>
      <Table dataSource={dataSource} columns={columns} />
      </div>
      </div>
    </>
  );
}

export default TransactionTable;

