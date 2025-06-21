
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Chat from "./pages/Chat";
import NotFound from "./pages/NotFound";
import Simulator from "./pages/Simulator";
import SimulatorResults from './pages/SimulatorResults'; // 새로 만들 컴포넌트
import SplashScreen from './pages/SplashScreen'; // 경로에 맞게 수정
import OnboardingScreen from './pages/OnboardingScreen'; // 경로에 맞게 수정
import MainScreen from './pages/MainScreen'; // 경로에 맞게 수정
import PolicyListScreen from './pages/PolicyListScreen'; // 새로 만들 컴포넌트
import PolicyList from './pages/PolicyList'; // 정책 목록 페이지 컴포넌트
import PolicyDetailScreen from './pages/PolicyDetailScreen';

const queryClient = new QueryClient();

// const App = () => (
//   <QueryClientProvider client={queryClient}>
//     <TooltipProvider>
//       <Toaster />
//       <Sonner />
//       <BrowserRouter>
//         <Routes>
//           <Route path="/" element={<Index />} />
//           <Route path="/chat" element={<Chat />} />
//           <Route path="/simulator" element={<Simulator />} />
//           <Route path="/simulator/results" element={<SimulatorResults />} />
//           {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
//           <Route path="*" element={<NotFound />} />
//         </Routes>
//       </BrowserRouter>
//     </TooltipProvider>
//   </QueryClientProvider>
// );

// export default App;
const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SplashScreen />} />
          <Route path="/onboarding" element={<OnboardingScreen />} />
          <Route path="/main" element={<MainScreen />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/simulator" element={<Simulator />} />
          <Route path="/simulatorresults" element={<SimulatorResults />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
          <Route path="/policy-list" element={<PolicyListScreen />} />
          <Route path="/policy" element={<PolicyList />} />
          <Route path="/policy/:id" element={<PolicyDetailScreen />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
