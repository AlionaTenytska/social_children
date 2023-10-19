import logo from './logo.svg';
import './App.css';
import { Form } from './components/Register';
import { ElectronicCoupon } from './components/ElectronicCoupon'
import { Route, Routes } from "react-router-dom";


function App() {
  return (
    <div>
      <Routes>
        <Route path="/" exact element={<Form />} />
        <Route path="/coupon/:id" element={<ElectronicCoupon />} />
      </Routes>

    </div>
  );
}

export default App;
