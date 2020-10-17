import React from 'react';
import logo from './logo.svg';
import './App.css';

import AddRide from './screens/AddRide';
import Body from './screens/body';

function App() {
    window.passengersId = ""
  return (
    <div className="App">
      <Body/>
    </div>
  );
}

export default App;
