import './App.css';
import { Form } from './components/Register';
import { ElectronicCoupon } from './components/ElectronicCoupon'
import { Route, Routes } from "react-router-dom";
import {Example} from './components/Date'


function App() {
  return (
    <div>
      {/* <Example/> */}

      <Routes>
        <Route path="/" exact element={<Form />} />
        <Route path="/coupon/:id" element={<ElectronicCoupon />} />
      </Routes>

    </div>
  );
}

export default App;
