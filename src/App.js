import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Main from "./Main";
import LootboxComponent from "./LootboxComponent";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/lootbeers_github_pages" element={<Main />} />
        <Route index element={<Main />} />
        {/* <Route path="Main" element={<Main />} /> */}
        <Route path="/lootbeers_github_pages/LootboxComponent" element={<LootboxComponent />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
