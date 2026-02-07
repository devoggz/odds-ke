import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import OddsPage from "./pages/OddsPage";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/odds/:slug" element={<OddsPage />} />
      </Routes>
    </Router>
  );
}

export default App;
