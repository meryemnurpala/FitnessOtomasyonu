import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { UserProvider } from "./context/UserContext";
import { AppointmentProvider } from "./context/AppointmentContext";
import { MembershipProvider } from "./context/MembershipContext";
import { PaymentProvider } from "./context/PaymentContext";
import { AdminProvider } from "./context/AdminContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { router } from "./router";

function App() {
  return (
    <AuthProvider>
      <UserProvider>
        <AppointmentProvider>
          <MembershipProvider>
            <PaymentProvider>
              <AdminProvider>
                <RouterProvider 
                  router={router} 
                  future={{
                    v7_startTransition: true,
                    v7_relativeSplatPath: true
                  }}
                />
                <ToastContainer />
              </AdminProvider>
            </PaymentProvider>
          </MembershipProvider>
        </AppointmentProvider>
      </UserProvider>
    </AuthProvider>
  );
}

export default App; 