import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ReactNode, useEffect } from "react";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import LoginPage from "@/pages/LoginPage";
import PortalLayout from "@/components/portal/PortalLayout";
import AcademicsPage from "@/pages/portal/AcademicsPage";
import CareerPage from "@/pages/portal/CareerPage";
import PracticePage from "@/pages/portal/PracticePage";
import ResourcePage from "@/pages/portal/ResourcePage";
import ProfilePage from "@/pages/portal/ProfilePage";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { FacultyAuthProvider, useFacultyAuth } from "@/context/FacultyAuthContext";
import FacultyLoginPage from "@/pages/faculty/FacultyLoginPage";
import FacultyDashboard from "@/pages/faculty/FacultyDashboard";

const queryClient = new QueryClient();

function ProtectedPortal({ children }: { children: ReactNode }) {
  const { isLoggedIn } = useAuth();
  const [, navigate] = useLocation();
  useEffect(() => { if (!isLoggedIn) navigate("/student/login"); }, [isLoggedIn]);
  if (!isLoggedIn) return null;
  return <>{children}</>;
}

function ProtectedFaculty({ children }: { children: ReactNode }) {
  const { isLoggedIn } = useFacultyAuth();
  const [, navigate] = useLocation();
  useEffect(() => { if (!isLoggedIn) navigate("/faculty/login"); }, [isLoggedIn]);
  if (!isLoggedIn) return null;
  return <>{children}</>;
}

function PortalRouter() {
  return (
    <ProtectedPortal>
      <PortalLayout>
        <Switch>
          <Route path="/student/academics" component={AcademicsPage} />
          <Route path="/student/career"    component={CareerPage} />
          <Route path="/student/practice"  component={PracticePage} />
          <Route path="/student/resource"  component={ResourcePage} />
          <Route path="/student/profile"   component={ProfilePage} />
          <Route path="/student"           component={AcademicsPage} />
        </Switch>
      </PortalLayout>
    </ProtectedPortal>
  );
}

function FacultyRouter() {
  return (
    <ProtectedFaculty>
      <Switch>
        <Route path="/faculty/dashboard" component={FacultyDashboard} />
        <Route path="/faculty"           component={FacultyDashboard} />
      </Switch>
    </ProtectedFaculty>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/"                component={Home} />
      <Route path="/student/login"   component={LoginPage} />
      <Route path="/student/:rest*"  component={PortalRouter} />
      <Route path="/faculty/login"   component={FacultyLoginPage} />
      <Route path="/faculty/:rest*"  component={FacultyRouter} />
      <Route path="/faculty"         component={FacultyRouter} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <FacultyAuthProvider>
          <TooltipProvider>
            <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
              <Router />
            </WouterRouter>
            <Toaster />
          </TooltipProvider>
        </FacultyAuthProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
