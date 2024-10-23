import logo from "./logo.svg";
import "./App.css";
import { Button } from "flowbite-react";
import { Accordion } from "flowbite-react";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <Button>Edit</Button>
      </header>
    </div>
  );
}

export default App;
