import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import PortalLayout from "@/components/portal/PortalLayout";
import AcademicsPage from "@/pages/portal/AcademicsPage";
import CareerPage from "@/pages/portal/CareerPage";
import PracticePage from "@/pages/portal/PracticePage";
import ResourcePage from "@/pages/portal/ResourcePage";
import ProfilePage from "@/pages/portal/ProfilePage";

const queryClient = new QueryClient();

function PortalRouter() {
  return (
    <PortalLayout>
      <Switch>
        <Route path="/student/academics" component={AcademicsPage} />
        <Route path="/student/career" component={CareerPage} />
        <Route path="/student/practice" component={PracticePage} />
        <Route path="/student/resource" component={ResourcePage} />
        <Route path="/student/profile" component={ProfilePage} />
        <Route path="/student" component={AcademicsPage} />
      </Switch>
    </PortalLayout>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/student/:rest*" component={PortalRouter} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
