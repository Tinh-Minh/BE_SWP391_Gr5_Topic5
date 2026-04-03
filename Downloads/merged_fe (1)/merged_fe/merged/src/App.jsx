import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import OrderDetail from "./pages/OrderDetail";
import Profile from "./pages/Profile";
import ProductDetail from "./pages/ProductDetail";
import ProductCatalog from "./pages/ProductCatalog";
import EyeProfile from "./pages/EyeProfile";
import DesignGlasses from "./pages/DesignGlasses";
import AdminDashboard from "./pages/admin/AdminDashboard";
import StaffDashboard from "./pages/StaffDashboard";
import OperationDashboard from "./pages/OperationDashboard";
import ShipperDashboard from "./pages/ShipperDashboard";

function App() {
  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/product/:type/:id" element={<ProductDetail />} />
        <Route path="/catalog" element={<ProductCatalog />} />

        {/* Customer */}
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/orders/:orderId" element={<OrderDetail />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/eye-profile" element={<EyeProfile />} />
        <Route path="/design-glasses" element={<DesignGlasses />} />

        {/* Staff */}
        <Route path="/staff" element={<StaffDashboard />} />

        {/* Operation */}
        <Route path="/operation" element={<OperationDashboard />} />

        {/* Shipper */}
        <Route path="/shipper" element={<ShipperDashboard />} />

        {/* Admin */}
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
