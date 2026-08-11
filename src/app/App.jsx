import { BrowserRouter, Routes } from "react-router-dom";
import { AuthProvider } from "./providers/AuthProvider";
import { ThemeProvider } from "./providers/ThemeProvider";
import PublicRoutes from "./routes/PublicRoutes";
import AdminRoutes from "./routes/AdminRoutes";
import CitizenRoutes from "./routes/CitizenRoutes";
import StaffRoutes from "./routes/StaffRoutes";

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          {/* Route group components are called as functions, not rendered as
              JSX (<AdminRoutes />) — React Router's <Routes> reads <Route>
              elements from its direct children, and won't see through a
              custom component boundary. Calling them returns the <Route>
              elements (and Fragments, which Routes does flatten) directly. */}
          <Routes>
            {PublicRoutes()}
            {CitizenRoutes()}
            {StaffRoutes()}
            {AdminRoutes()}
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
