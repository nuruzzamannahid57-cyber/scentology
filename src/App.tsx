import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { FloatingHelp } from './components/FloatingHelp';
import { Home } from './pages/Home';
import { Collection } from './pages/Collection';
import { ProductDetail } from './pages/ProductDetail';
import { Checkout } from './pages/Checkout';
import { OrderSuccess } from './pages/OrderSuccess';
import { TrackOrder } from './pages/TrackOrder';
import { Admin } from './pages/admin/Admin';
import { Invoice } from './pages/admin/Invoice';
import { StoreProvider } from './store/StoreContext';

function StoreLayout() {
  return (
    <div className="site-shell">
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/collection" element={<Collection />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order/:id" element={<OrderSuccess />} />
          <Route path="/track" element={<TrackOrder />} />
          <Route path="*" element={<div className="page-shell shell empty-state"><h1 className="page-title">Page not found</h1><Link to="/" className="btn btn-gold">Back home</Link></div>} />
        </Routes>
      </main>
      <Footer />
      <CartDrawer />
      <FloatingHelp />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <StoreProvider>
        <Routes>
          <Route path="/admin/invoice/:id" element={<Invoice />} />
          <Route path="/admin/*" element={<Admin />} />
          <Route path="/*" element={<StoreLayout />} />
        </Routes>
      </StoreProvider>
    </BrowserRouter>
  );
}
