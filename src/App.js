import './App.css';
import { Form } from './components/Register';
import { ElectronicCoupon } from './components/ElectronicCoupon'
import { Route, Routes } from "react-router-dom";
import { NotFound } from './components/NotFound';

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" exact element={<Form />} />
        <Route path="/coupon/:id" element={<ElectronicCoupon />} />
        <Route path="*" element={<NotFound />} />
      </Routes>

    </div>
  );
}

export default App;
