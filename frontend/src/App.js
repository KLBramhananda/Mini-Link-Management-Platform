import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from "./pages/entering-page/login";
import Signup from "./pages/entering-page/signup";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </Router>
  );
}

export default App;
