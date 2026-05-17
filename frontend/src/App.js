import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import "@/index.css";
import "@/App.css";
import { Toaster } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Home from "@/pages/Home";
import About from "@/pages/About";
import Capabilities from "@/pages/Capabilities";
import Categories from "@/pages/Categories";
import Process from "@/pages/Process";
import Sourcing from "@/pages/Sourcing";
import Quality from "@/pages/Quality";
import Quote from "@/pages/Quote";
import FAQs from "@/pages/FAQs";
import Contact from "@/pages/Contact";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

export default function App() {
  return (
    <div className="App bg-black min-h-screen">
      <BrowserRouter>
        <ScrollToTop />
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/capabilities" element={<Capabilities />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/process" element={<Process />} />
            <Route path="/sourcing" element={<Sourcing />} />
            <Route path="/quality" element={<Quality />} />
            <Route path="/quote" element={<Quote />} />
            <Route path="/faqs" element={<FAQs />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>
        <Footer />
      </BrowserRouter>
      <Toaster theme="dark" position="top-center" />
    </div>
  );
}
