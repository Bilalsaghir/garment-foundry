import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import "@/index.css";
import "@/App.css";
import { Toaster } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SiteMeta from "@/components/SiteMeta";
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
import Blog from "@/pages/Blog";
import BlogPost from "@/pages/BlogPost";
import CaseStudies from "@/pages/CaseStudies";
import Unsubscribe from "@/pages/Unsubscribe";
import NotFound from "@/pages/NotFound";

import AdminLogin from "@/admin/AdminLogin";
import AdminLayout from "@/admin/AdminLayout";
import AdminDashboard from "@/admin/AdminDashboard";
import AdminBlog from "@/admin/AdminBlog";
import AdminCaseStudies from "@/admin/AdminCaseStudies";
import { AdminQuotes, AdminQuoteDetail } from "@/admin/AdminQuotes";
import AdminContacts from "@/admin/AdminContacts";
import AdminFAQs from "@/admin/AdminFAQs";
import AdminSubscribers from "@/admin/AdminSubscribers";
import AdminCampaigns from "@/admin/AdminCampaigns";
import AdminSettings from "@/admin/AdminSettings";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function PublicLayout({ children }) {
  return (<><Navbar /><main>{children}</main><Footer /></>);
}

function Public({ Page }) {
  return <PublicLayout><Page /></PublicLayout>;
}

export default function App() {
  return (
    <div className="App bg-black min-h-screen">
      <SiteMeta />
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          {/* Public */}
          <Route path="/" element={<Public Page={Home} />} />
          <Route path="/about" element={<Public Page={About} />} />
          <Route path="/capabilities" element={<Public Page={Capabilities} />} />
          <Route path="/categories" element={<Public Page={Categories} />} />
          <Route path="/process" element={<Public Page={Process} />} />
          <Route path="/sourcing" element={<Public Page={Sourcing} />} />
          <Route path="/quality" element={<Public Page={Quality} />} />
          <Route path="/quote" element={<Public Page={Quote} />} />
          <Route path="/faqs" element={<Public Page={FAQs} />} />
          <Route path="/contact" element={<Public Page={Contact} />} />
          <Route path="/blog" element={<Public Page={Blog} />} />
          <Route path="/blog/:slug" element={<Public Page={BlogPost} />} />
          <Route path="/case-studies" element={<Public Page={CaseStudies} />} />
          <Route path="/unsubscribe" element={<Public Page={Unsubscribe} />} />

          {/* Admin */}

          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="blog" element={<AdminBlog />} />
            <Route path="case-studies" element={<AdminCaseStudies />} />
            <Route path="quotes" element={<AdminQuotes />} />
            <Route path="quotes/:ref" element={<AdminQuoteDetail />} />
            <Route path="contacts" element={<AdminContacts />} />
            <Route path="faqs" element={<AdminFAQs />} />
            <Route path="subscribers" element={<AdminSubscribers />} />
            <Route path="campaigns" element={<AdminCampaigns />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>

          {/* 404 catch-all — must be last */}
          <Route path="*" element={<Public Page={NotFound} />} />
        </Routes>
      </BrowserRouter>
      <Toaster theme="dark" position="top-center" />
    </div>
  );
}
