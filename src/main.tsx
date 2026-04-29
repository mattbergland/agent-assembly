import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import Home from "./pages/Home";
import Toolkit from "./pages/Toolkit";
import TemplateLibrary from "./pages/TemplateLibrary";
import ROICalculator from "./pages/ROICalculator";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/toolkit" element={<Toolkit />} />
        <Route path="/toolkit/templates" element={<TemplateLibrary />} />
        <Route path="/toolkit/roi-calculator" element={<ROICalculator />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
