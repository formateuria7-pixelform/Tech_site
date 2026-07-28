import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { Layout } from './components/layout/Layout';
import { Home } from './pages/Home';

/* Découpage du bundle : seule la page d'accueil est chargée immédiatement. */
const About = React.lazy(() => import('./pages/About').then((m) => ({ default: m.About })));
const Services = React.lazy(() => import('./pages/Services').then((m) => ({ default: m.Services })));
const ServiceDetail = React.lazy(() =>
import('./pages/ServiceDetail').then((m) => ({ default: m.ServiceDetail }))
);
const Realisations = React.lazy(() =>
import('./pages/Realisations').then((m) => ({ default: m.Realisations }))
);
const Shop = React.lazy(() => import('./pages/Shop').then((m) => ({ default: m.Shop })));
const ProductDetail = React.lazy(() =>
import('./pages/ProductDetail').then((m) => ({ default: m.ProductDetail }))
);
const Cart = React.lazy(() => import('./pages/Cart').then((m) => ({ default: m.Cart })));
const Checkout = React.lazy(() => import('./pages/Checkout').then((m) => ({ default: m.Checkout })));
const OrderConfirmation = React.lazy(() =>
import('./pages/OrderConfirmation').then((m) => ({ default: m.OrderConfirmation }))
);
const OrderTracking = React.lazy(() =>
import('./pages/OrderTracking').then((m) => ({ default: m.OrderTracking }))
);
const QuoteRequest = React.lazy(() => import('./pages/QuoteRequest').then((m) => ({ default: m.QuoteRequest })));
const Booking = React.lazy(() => import('./pages/Booking').then((m) => ({ default: m.Booking })));
const Blog = React.lazy(() => import('./pages/Blog').then((m) => ({ default: m.Blog })));
const BlogPost = React.lazy(() => import('./pages/BlogPost').then((m) => ({ default: m.BlogPost })));
const Faq = React.lazy(() => import('./pages/Faq').then((m) => ({ default: m.Faq })));
const Contact = React.lazy(() => import('./pages/Contact').then((m) => ({ default: m.Contact })));
const Login = React.lazy(() => import('./pages/Login').then((m) => ({ default: m.Login })));
const Register = React.lazy(() => import('./pages/Register').then((m) => ({ default: m.Register })));
const ForgotPassword = React.lazy(() =>
import('./pages/ForgotPassword').then((m) => ({ default: m.ForgotPassword }))
);
const Account = React.lazy(() => import('./pages/Account').then((m) => ({ default: m.Account })));
const Admin = React.lazy(() => import('./pages/Admin').then((m) => ({ default: m.Admin })));
const Legal = React.lazy(() => import('./pages/Legal').then((m) => ({ default: m.Legal })));
const NotFound = React.lazy(() => import('./pages/NotFound').then((m) => ({ default: m.NotFound })));
const ServerError = React.lazy(() => import('./pages/ServerError').then((m) => ({ default: m.ServerError })));

function RouteFallback() {
  return (
    <div className="flex min-h-[60vh] w-full items-center justify-center" role="status" aria-live="polite">
      <div className="flex flex-col items-center gap-4">
        <span className="h-9 w-9 animate-spin rounded-full border-2 border-paper/15 border-t-volt" />
        <span className="font-mono text-[11px] uppercase tracking-[0.24em] text-fog">Chargement</span>
      </div>
    </div>);

}

export function App() {
  return (
    <BrowserRouter>
      <Toaster
        theme="dark"
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#12141A',
            border: '1px solid rgba(244,242,237,0.12)',
            color: '#F4F2ED'
          }
        }} />
      
      <React.Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/a-propos" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/services/:slug" element={<ServiceDetail />} />
            <Route path="/realisations" element={<Realisations />} />
            <Route path="/boutique" element={<Shop />} />
            <Route path="/boutique/categorie/:category" element={<Shop />} />
            <Route path="/boutique/produit/:slug" element={<ProductDetail />} />
            <Route path="/panier" element={<Cart />} />
            <Route path="/paiement" element={<Checkout />} />
            <Route path="/commande/:ref" element={<OrderConfirmation />} />
            <Route path="/suivi-commande" element={<OrderTracking />} />
            <Route path="/devis" element={<QuoteRequest />} />
            <Route path="/rendez-vous" element={<Booking />} />
            <Route path="/actualites" element={<Blog />} />
            <Route path="/actualites/:slug" element={<BlogPost />} />
            <Route path="/faq" element={<Faq />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/connexion" element={<Login />} />
            <Route path="/inscription" element={<Register />} />
            <Route path="/mot-de-passe-oublie" element={<ForgotPassword />} />
            <Route path="/compte" element={<Account />} />
            <Route path="/compte/:section" element={<Account />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/admin/:section" element={<Admin />} />
            <Route path="/mentions-legales" element={<Legal kind="mentions" />} />
            <Route path="/confidentialite" element={<Legal kind="confidentialite" />} />
            <Route path="/cgv" element={<Legal kind="cgv" />} />
            <Route path="/erreur-serveur" element={<ServerError />} />
            <Route path="/404" element={<NotFound />} />
            <Route path="*" element={<NotFound />} />
          </Route>
          <Route path="/home" element={<Navigate to="/" replace />} />
        </Routes>
      </React.Suspense>
    </BrowserRouter>);

}