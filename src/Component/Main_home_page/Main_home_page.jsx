import React from 'react'
import { useState } from 'react';
import Total_value from '../Total_value/Total_value'
import Updated from '../Updated/Updated';
import New_buy_stake from '../New_buy_stake/New_buy_stake';

function Main_home_page() {
  
  return (
    <div>
    {/* <New_buy_stake/> */}
    <Total_value   />
    <Updated/>
    </div>
  )
}

export default Main_home_page
