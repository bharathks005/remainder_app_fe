import "./App.css";
import { Button } from "flowbite-react";
import { Outlet } from "react-router-dom";
import HeaderComponent from "./components/ui/header/header";
import FooterComponent from "./components/ui/footer/footer";
import ToastComponent from "./components/ui/toast/toast";

function App() {
  return (
    <div className="App">
      <HeaderComponent />
      <Outlet />
      <ToastComponent />
      <FooterComponent />
    </div>
  );
}

export default App;
