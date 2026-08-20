import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import Services from "./pages/Services";
import About from "./pages/About";
import Team from "./pages/Team";
import Portfolio from "./pages/Portfolio";
import NotFound from "./pages/NotFound";
import HireDeveloper from "./pages/HireDeveloper";
import Contact from "./pages/Contact";
import Blog from "./pages/Blog";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsConditions from "./pages/TermsConditions";
import CookiePolicy from "./pages/CookiePolicy";
import Pricing from "./pages/Pricing";
import ServiceDetailPage from "./pages/ServiceDetailPage";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminBlog from "./pages/AdminBlog";
import AdminLandingPages from "./pages/AdminLandingPages";
import AdminResources from "./pages/AdminResources";
import AdminQueries from "./pages/AdminQueries";
import AdminLinks from "./pages/AdminLinks";
import AdminContent from "./pages/AdminContent";
import AdminSecurity from "./pages/AdminSecurity";
import AdminBookings from "./pages/AdminBookings";
import LandingPage from "./pages/LandingPage";
import ProtectedRoute from "./components/admin/ProtectedRoute";
import BookingWidget from "./components/BookingWidget";
import MarketNewsWidget from "./components/MarketNewsWidget";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/services" element={<Services />} />
            <Route path="/about" element={<About />} />
            <Route path="/team" element={<Team />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/hire" element={<HireDeveloper />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-conditions" element={<TermsConditions />} />
            <Route path="/cookie-policy" element={<CookiePolicy />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/services/:slug" element={<ServiceDetailPage />} />
            <Route path="/p/:slug" element={<LandingPage />} />

            {/* Admin Routes */}
            <Route path="/admin/zaplogin" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/blog" element={<ProtectedRoute><AdminBlog /></ProtectedRoute>} />
            <Route path="/admin/landing-pages" element={<ProtectedRoute><AdminLandingPages /></ProtectedRoute>} />
            <Route path="/admin/resources" element={<ProtectedRoute><AdminResources /></ProtectedRoute>} />
            
            <Route path="/admin/queries" element={<ProtectedRoute><AdminQueries /></ProtectedRoute>} />
            <Route path="/admin/links" element={<ProtectedRoute><AdminLinks /></ProtectedRoute>} />
            <Route path="/admin/content" element={<ProtectedRoute><AdminContent /></ProtectedRoute>} />
            <Route path="/admin/security" element={<ProtectedRoute><AdminSecurity /></ProtectedRoute>} />
            <Route path="/admin/bookings" element={<ProtectedRoute><AdminBookings /></ProtectedRoute>} />

            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <BookingWidget />
          <MarketNewsWidget />
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
