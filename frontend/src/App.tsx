import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "regenerator-runtime/runtime";
import "./App.css";
import VoiceCommandPage from "./VoiceCommand";
import Transfer from "./transfer";
import Home from "./home";

function App() {
  return (
    <div>
    <Router>
      {/* VoiceCommandPage is now within the Router */}
      <VoiceCommandPage />

      {/* Define your routes */}
      <Routes>
        <Route path="/home" element={<Home />} />
        {/* Transfer Page Route */}
        <Route path="/transfer" element={<Transfer />} />

        {/* Add other routes as needed */}
      </Routes>
    </Router>
    </div>
  );
}

export default App;
