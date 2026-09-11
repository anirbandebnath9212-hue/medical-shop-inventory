import React from "react";
import Inventory from "./pages/Inventory";
import "./App.css";

function App() {
  return (
    <div className="app">
      <header className="header">
        <h1>Medical Shop Inventory</h1>
        <p>Medicine Stock Management</p>
      </header>

      <main>
        <Inventory />
      </main>
    </div>
  );
}

export default App;