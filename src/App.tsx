import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppShell } from "@/components/layout/AppShell";
import Index from "./pages/Index";
import Assessment from "./pages/Assessment";
import Careers from "./pages/Careers";
import CareerDetail from "./pages/CareerDetail";
import Skills from "./pages/Skills";
import SkillDetail from "./pages/SkillDetail";
import Certifications from "./pages/Certifications";
import Resources from "./pages/Resources";
import Roadmaps from "./pages/Roadmaps";
import Dashboard from "./pages/Dashboard";
import About from "./pages/About";
import SharedResults from "./pages/SharedResults";
import Reach from "./pages/Reach";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<AppShell />}>
            <Route path="/" element={<Index />} />
            <Route path="/assessment" element={<Assessment />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/careers/:slug" element={<CareerDetail />} />
            <Route path="/skills" element={<Skills />} />
            <Route path="/skills/:slug" element={<SkillDetail />} />
            <Route path="/certifications" element={<Certifications />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/roadmaps" element={<Roadmaps />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/about" element={<About />} />
            <Route path="/reach" element={<Reach />} />
          </Route>
          <Route path="/results/:shareId" element={<SharedResults />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
