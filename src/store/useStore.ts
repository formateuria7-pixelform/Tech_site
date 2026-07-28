/**
 * État applicatif persistant (localStorage) : compte, panier, favoris,
 * commandes, devis, rendez-vous, notifications, contenus administrables.
 *
 * Chaque action correspond à un point d'API REST à brancher côté serveur.
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { products as seedProducts, type Product } from '../data/catalog';
import { posts as seedPosts, type Post } from '../data/content';
import { reference, TAX_RATE, SHIPPING_FLAT, FREE_SHIPPING_THRESHOLD } from '../lib/format';

export type Role = 'client' | 'admin';

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company?: string;
  role: Role;
  password: string;
  createdAt: string;
  address: Address;
};

export type Address = {
  line1: string;
  postalCode: string;
  city: string;
  country: string;
};

export type CartLine = {slug: string;quantity: number;};

export type OrderStatus = 'en-attente' | 'payee' | 'preparation' | 'expediee' | 'livree' | 'annulee';

export type Order = {
  id: string;
  ref: string;
  userId: string;
  createdAt: string;
  status: OrderStatus;
  lines: {slug: string;name: string;unitPrice: number;quantity: number;}[];
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  couponCode?: string;
  paymentMethod: 'carte' | 'virement' | 'paypal' | 'mobile-money';
  shippingAddress: Address;
  billingAddress: Address;
  timeline: {label: string;date: string;}[];
};

export type QuoteStatus = 'nouvelle' | 'en-etude' | 'envoye' | 'accepte' | 'refuse';

export type Quote = {
  id: string;
  ref: string;
  userId: string | null;
  createdAt: string;
  status: QuoteStatus;
  serviceSlug: string;
  serviceName: string;
  contact: {name: string;email: string;phone: string;company?: string;};
  address: string;
  description: string;
  urgency: 'normale' | 'prioritaire' | 'urgente';
  budget: string;
  attachments: string[];
  amount?: number;
  messages: {author: string;date: string;text: string;}[];
};

export type AppointmentStatus = 'demande' | 'confirme' | 'annule' | 'termine';

export type Appointment = {
  id: string;
  ref: string;
  userId: string | null;
  createdAt: string;
  status: AppointmentStatus;
  serviceSlug: string;
  serviceName: string;
  date: string;
  slot: string;
  mode: 'sur-site' | 'atelier' | 'visio';
  contact: {name: string;email: string;phone: string;};
  address: string;
  note: string;
};

export type Notification = {
  id: string;
  userId: string | null;
  title: string;
  body: string;
  date: string;
  read: boolean;
  kind: 'commande' | 'devis' | 'rendez-vous' | 'systeme';
};

export type Comment = {
  id: string;
  postSlug: string;
  author: string;
  email: string;
  text: string;
  date: string;
  status: 'en-moderation' | 'publie' | 'rejete';
};

export type Coupon = {code: string;percent: number;label: string;active: boolean;};

type State = {
  users: User[];
  currentUserId: string | null;
  cart: CartLine[];
  favorites: string[];
  orders: Order[];
  quotes: Quote[];
  appointments: Appointment[];
  notifications: Notification[];
  comments: Comment[];
  coupons: Coupon[];
  appliedCoupon: string | null;
  catalog: Product[];
  journal: Post[];
  logs: {id: string;date: string;actor: string;action: string;}[];
};

type Actions = {
  // Authentification
  register: (input: Omit<User, 'id' | 'role' | 'createdAt' | 'address'> & {address?: Address;}) => {ok: boolean;error?: string;};
  login: (email: string, password: string) => {ok: boolean;error?: string;};
  logout: () => void;
  updateProfile: (patch: Partial<Omit<User, 'id' | 'role'>>) => void;
  requestPasswordReset: (email: string) => {ok: boolean;error?: string;};
  // Panier
  addToCart: (slug: string, quantity?: number) => void;
  setQuantity: (slug: string, quantity: number) => void;
  removeFromCart: (slug: string) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => {ok: boolean;error?: string;};
  removeCoupon: () => void;
  // Favoris
  toggleFavorite: (slug: string) => void;
  // Commandes
  placeOrder: (input: {
    paymentMethod: Order['paymentMethod'];
    shippingAddress: Address;
    billingAddress: Address;
  }) => Order | null;
  advanceOrder: (id: string, status: OrderStatus) => void;
  cancelOrder: (id: string) => void;
  // Devis
  createQuote: (input: Omit<Quote, 'id' | 'ref' | 'createdAt' | 'status' | 'userId' | 'messages'>) => Quote;
  setQuoteStatus: (id: string, status: QuoteStatus, amount?: number) => void;
  addQuoteMessage: (id: string, text: string, author: string) => void;
  // Rendez-vous
  createAppointment: (input: Omit<Appointment, 'id' | 'ref' | 'createdAt' | 'status' | 'userId'>) => Appointment;
  setAppointmentStatus: (id: string, status: AppointmentStatus) => void;
  rescheduleAppointment: (id: string, date: string, slot: string) => void;
  // Avis & commentaires
  addProductReview: (slug: string, author: string, rating: number, comment: string) => void;
  addComment: (postSlug: string, author: string, email: string, text: string) => void;
  setCommentStatus: (id: string, status: Comment['status']) => void;
  // Notifications
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  // Administration
  saveProduct: (product: Product) => void;
  deleteProduct: (slug: string) => void;
  setStock: (slug: string, stock: number) => void;
  savePost: (post: Post) => void;
  deletePost: (slug: string) => void;
  saveCoupon: (coupon: Coupon) => void;
  deleteCoupon: (code: string) => void;
  setUserRole: (id: string, role: Role) => void;
};

const ADMIN_SEED: User = {
  id: 'usr-admin',
  firstName: 'Admin',
  lastName: 'OHMEGA',
  email: 'admin@ohmega-solutions.fr',
  phone: '+33 4 28 91 44 10',
  role: 'admin',
  password: 'Ohmega!2026',
  createdAt: '2026-01-05T09:00:00.000Z',
  address: { line1: '18 rue des Ateliers', postalCode: '69007', city: 'Lyon', country: 'France' }
};

const DEMO_CLIENT: User = {
  id: 'usr-demo',
  firstName: 'Claire',
  lastName: 'Delmas',
  email: 'claire.delmas@exemple.fr',
  phone: '+33 6 12 45 78 90',
  company: 'Cabinet Delmas & Associés',
  role: 'client',
  password: 'Client!2026',
  createdAt: '2026-02-18T10:20:00.000Z',
  address: { line1: '7 quai Saint-Antoine', postalCode: '69002', city: 'Lyon', country: 'France' }
};

const SEED_COUPONS: Coupon[] = [
{ code: 'OHMEGA10', percent: 10, label: 'Bienvenue — 10 %', active: true },
{ code: 'PRO5', percent: 5, label: 'Compte professionnel — 5 %', active: true },
{ code: 'ETE2025', percent: 15, label: 'Opération été 2025 (expirée)', active: false }];


function now(): string {
  return new Date().toISOString();
}

function id(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

export const useStore = create<State & Actions>()(
  persist(
    (set, get) => ({
      users: [ADMIN_SEED, DEMO_CLIENT],
      currentUserId: null,
      cart: [],
      favorites: [],
      orders: [],
      quotes: [],
      appointments: [],
      notifications: [],
      comments: [],
      coupons: SEED_COUPONS,
      appliedCoupon: null,
      catalog: seedProducts,
      journal: seedPosts,
      logs: [],

      register: (input) => {
        const exists = get().users.some((u) => u.email.toLowerCase() === input.email.toLowerCase());
        if (exists) return { ok: false, error: 'Un compte existe déjà avec cette adresse e-mail.' };
        const user: User = {
          ...input,
          id: id('usr'),
          role: 'client',
          createdAt: now(),
          address: input.address ?? { line1: '', postalCode: '', city: '', country: 'France' }
        };
        set((s) => ({
          users: [...s.users, user],
          currentUserId: user.id,
          notifications: [
          {
            id: id('ntf'),
            userId: user.id,
            title: 'Bienvenue chez OHMEGA',
            body: 'Votre compte est actif. Vous pouvez suivre vos devis, commandes et rendez-vous ici.',
            date: now(),
            read: false,
            kind: 'systeme'
          },
          ...s.notifications],

          logs: [{ id: id('log'), date: now(), actor: user.email, action: 'Création de compte' }, ...s.logs]
        }));
        return { ok: true };
      },

      login: (email, password) => {
        const user = get().users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
        if (!user || user.password !== password) {
          return { ok: false, error: 'Identifiants incorrects.' };
        }
        set((s) => ({
          currentUserId: user.id,
          logs: [{ id: id('log'), date: now(), actor: user.email, action: 'Connexion' }, ...s.logs]
        }));
        return { ok: true };
      },

      logout: () => set({ currentUserId: null }),

      updateProfile: (patch) =>
      set((s) => ({
        users: s.users.map((u) => u.id === s.currentUserId ? { ...u, ...patch } : u),
        logs: [{ id: id('log'), date: now(), actor: 'client', action: 'Mise à jour du profil' }, ...s.logs]
      })),

      requestPasswordReset: (email) => {
        const user = get().users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
        if (!user) return { ok: false, error: 'Aucun compte associé à cette adresse.' };
        set((s) => ({
          notifications: [
          {
            id: id('ntf'),
            userId: user.id,
            title: 'Réinitialisation du mot de passe',
            body: `Un lien de réinitialisation a été envoyé à ${user.email}. Il expire dans 30 minutes.`,
            date: now(),
            read: false,
            kind: 'systeme'
          },
          ...s.notifications]

        }));
        return { ok: true };
      },

      addToCart: (slug, quantity = 1) =>
      set((s) => {
        const line = s.cart.find((l) => l.slug === slug);
        const product = s.catalog.find((p) => p.slug === slug);
        const max = product?.stock ?? 99;
        if (line) {
          return {
            cart: s.cart.map((l) =>
            l.slug === slug ? { ...l, quantity: Math.min(max, l.quantity + quantity) } : l
            )
          };
        }
        return { cart: [...s.cart, { slug, quantity: Math.min(max, quantity) }] };
      }),

      setQuantity: (slug, quantity) =>
      set((s) => ({
        cart:
        quantity <= 0 ?
        s.cart.filter((l) => l.slug !== slug) :
        s.cart.map((l) => l.slug === slug ? { ...l, quantity } : l)
      })),

      removeFromCart: (slug) => set((s) => ({ cart: s.cart.filter((l) => l.slug !== slug) })),

      clearCart: () => set({ cart: [], appliedCoupon: null }),

      applyCoupon: (code) => {
        const coupon = get().coupons.find((c) => c.code.toUpperCase() === code.trim().toUpperCase());
        if (!coupon) return { ok: false, error: 'Ce code promotionnel est inconnu.' };
        if (!coupon.active) return { ok: false, error: 'Ce code promotionnel n’est plus valide.' };
        set({ appliedCoupon: coupon.code });
        return { ok: true };
      },

      removeCoupon: () => set({ appliedCoupon: null }),

      toggleFavorite: (slug) =>
      set((s) => ({
        favorites: s.favorites.includes(slug) ?
        s.favorites.filter((f) => f !== slug) :
        [...s.favorites, slug]
      })),

      placeOrder: ({ paymentMethod, shippingAddress, billingAddress }) => {
        const s = get();
        if (s.cart.length === 0) return null;
        const lines = s.cart.map((l) => {
          const product = s.catalog.find((p) => p.slug === l.slug)!;
          return { slug: l.slug, name: product.name, unitPrice: product.price, quantity: l.quantity };
        });
        const subtotal = lines.reduce((a, l) => a + l.unitPrice * l.quantity, 0);
        const coupon = s.coupons.find((c) => c.code === s.appliedCoupon && c.active);
        const discount = coupon ? subtotal * coupon.percent / 100 : 0;
        const shipping = subtotal - discount >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FLAT;
        const tax = (subtotal - discount) * TAX_RATE;
        const order: Order = {
          id: id('ord'),
          ref: reference('CMD'),
          userId: s.currentUserId ?? 'invite',
          createdAt: now(),
          status: 'payee',
          lines,
          subtotal,
          discount,
          shipping,
          tax,
          total: subtotal - discount + shipping + tax,
          couponCode: coupon?.code,
          paymentMethod,
          shippingAddress,
          billingAddress,
          timeline: [
          { label: 'Commande enregistrée', date: now() },
          { label: 'Paiement confirmé', date: now() }]

        };
        set((st) => ({
          orders: [order, ...st.orders],
          cart: [],
          appliedCoupon: null,
          catalog: st.catalog.map((p) => {
            const line = lines.find((l) => l.slug === p.slug);
            return line ? { ...p, stock: Math.max(0, p.stock - line.quantity) } : p;
          }),
          notifications: [
          {
            id: id('ntf'),
            userId: st.currentUserId,
            title: `Commande ${order.ref} confirmée`,
            body: 'Votre facture est disponible au téléchargement dans votre espace client.',
            date: now(),
            read: false,
            kind: 'commande'
          },
          ...st.notifications],

          logs: [{ id: id('log'), date: now(), actor: 'boutique', action: `Commande ${order.ref} créée` }, ...st.logs]
        }));
        return order;
      },

      advanceOrder: (orderId, status) =>
      set((s) => ({
        orders: s.orders.map((o) =>
        o.id === orderId ?
        { ...o, status, timeline: [...o.timeline, { label: `Statut : ${status}`, date: now() }] } :
        o
        ),
        notifications: [
        {
          id: id('ntf'),
          userId: s.orders.find((o) => o.id === orderId)?.userId ?? null,
          title: 'Mise à jour de commande',
          body: `Votre commande est désormais au statut « ${status} ».`,
          date: now(),
          read: false,
          kind: 'commande'
        },
        ...s.notifications]

      })),

      cancelOrder: (orderId) =>
      set((s) => ({
        orders: s.orders.map((o) =>
        o.id === orderId ?
        { ...o, status: 'annulee', timeline: [...o.timeline, { label: 'Commande annulée', date: now() }] } :
        o
        )
      })),

      createQuote: (input) => {
        const quote: Quote = {
          ...input,
          id: id('dev'),
          ref: reference('DEV'),
          userId: get().currentUserId,
          createdAt: now(),
          status: 'nouvelle',
          messages: [
          {
            author: 'OHMEGA',
            date: now(),
            text: 'Votre demande est enregistrée. Un technicien la qualifie sous 2 heures ouvrées.'
          }]

        };
        set((s) => ({
          quotes: [quote, ...s.quotes],
          notifications: [
          {
            id: id('ntf'),
            userId: s.currentUserId,
            title: `Demande de devis ${quote.ref} reçue`,
            body: 'Un accusé de réception vous a été envoyé par e-mail avec le récapitulatif PDF.',
            date: now(),
            read: false,
            kind: 'devis'
          },
          ...s.notifications],

          logs: [{ id: id('log'), date: now(), actor: input.contact.email, action: `Devis ${quote.ref} déposé` }, ...s.logs]
        }));
        return quote;
      },

      setQuoteStatus: (quoteId, status, amount) =>
      set((s) => ({
        quotes: s.quotes.map((q) =>
        q.id === quoteId ?
        {
          ...q,
          status,
          amount: amount ?? q.amount,
          messages: [
          ...q.messages,
          { author: 'OHMEGA', date: now(), text: `Statut mis à jour : ${status}.` }]

        } :
        q
        ),
        notifications: [
        {
          id: id('ntf'),
          userId: s.quotes.find((q) => q.id === quoteId)?.userId ?? null,
          title: 'Votre devis a évolué',
          body: `Nouveau statut : ${status}.`,
          date: now(),
          read: false,
          kind: 'devis'
        },
        ...s.notifications]

      })),

      addQuoteMessage: (quoteId, text, author) =>
      set((s) => ({
        quotes: s.quotes.map((q) =>
        q.id === quoteId ? { ...q, messages: [...q.messages, { author, date: now(), text }] } : q
        )
      })),

      createAppointment: (input) => {
        const appointment: Appointment = {
          ...input,
          id: id('rdv'),
          ref: reference('RDV'),
          userId: get().currentUserId,
          createdAt: now(),
          status: 'confirme'
        };
        set((s) => ({
          appointments: [appointment, ...s.appointments],
          notifications: [
          {
            id: id('ntf'),
            userId: s.currentUserId,
            title: `Rendez-vous ${appointment.ref} confirmé`,
            body: `${appointment.serviceName} — ${new Date(appointment.date).toLocaleDateString('fr-FR')} à ${appointment.slot}.`,
            date: now(),
            read: false,
            kind: 'rendez-vous'
          },
          ...s.notifications],

          logs: [
          { id: id('log'), date: now(), actor: input.contact.email, action: `Rendez-vous ${appointment.ref} créé` },
          ...s.logs]

        }));
        return appointment;
      },

      setAppointmentStatus: (appointmentId, status) =>
      set((s) => ({
        appointments: s.appointments.map((a) => a.id === appointmentId ? { ...a, status } : a)
      })),

      rescheduleAppointment: (appointmentId, date, slot) =>
      set((s) => ({
        appointments: s.appointments.map((a) =>
        a.id === appointmentId ? { ...a, date, slot, status: 'confirme' } : a
        )
      })),

      addProductReview: (slug, author, rating, comment) =>
      set((s) => ({
        catalog: s.catalog.map((p) =>
        p.slug === slug ?
        { ...p, reviews: [{ author, rating, date: now(), comment }, ...p.reviews] } :
        p
        )
      })),

      addComment: (postSlug, author, email, text) =>
      set((s) => ({
        comments: [
        { id: id('cmt'), postSlug, author, email, text, date: now(), status: 'en-moderation' },
        ...s.comments]

      })),

      setCommentStatus: (commentId, status) =>
      set((s) => ({
        comments: s.comments.map((c) => c.id === commentId ? { ...c, status } : c)
      })),

      markNotificationRead: (notificationId) =>
      set((s) => ({
        notifications: s.notifications.map((n) => n.id === notificationId ? { ...n, read: true } : n)
      })),

      markAllNotificationsRead: () =>
      set((s) => ({ notifications: s.notifications.map((n) => ({ ...n, read: true })) })),

      saveProduct: (product) =>
      set((s) => ({
        catalog: s.catalog.some((p) => p.slug === product.slug) ?
        s.catalog.map((p) => p.slug === product.slug ? product : p) :
        [product, ...s.catalog],
        logs: [{ id: id('log'), date: now(), actor: 'admin', action: `Produit enregistré : ${product.name}` }, ...s.logs]
      })),

      deleteProduct: (slug) =>
      set((s) => ({
        catalog: s.catalog.filter((p) => p.slug !== slug),
        cart: s.cart.filter((l) => l.slug !== slug),
        logs: [{ id: id('log'), date: now(), actor: 'admin', action: `Produit supprimé : ${slug}` }, ...s.logs]
      })),

      setStock: (slug, stock) =>
      set((s) => ({ catalog: s.catalog.map((p) => p.slug === slug ? { ...p, stock } : p) })),

      savePost: (post) =>
      set((s) => ({
        journal: s.journal.some((p) => p.slug === post.slug) ?
        s.journal.map((p) => p.slug === post.slug ? post : p) :
        [post, ...s.journal],
        logs: [{ id: id('log'), date: now(), actor: 'admin', action: `Article enregistré : ${post.title}` }, ...s.logs]
      })),

      deletePost: (slug) =>
      set((s) => ({
        journal: s.journal.filter((p) => p.slug !== slug),
        logs: [{ id: id('log'), date: now(), actor: 'admin', action: `Article supprimé : ${slug}` }, ...s.logs]
      })),

      saveCoupon: (coupon) =>
      set((s) => ({
        coupons: s.coupons.some((c) => c.code === coupon.code) ?
        s.coupons.map((c) => c.code === coupon.code ? coupon : c) :
        [coupon, ...s.coupons]
      })),

      deleteCoupon: (code) => set((s) => ({ coupons: s.coupons.filter((c) => c.code !== code) })),

      setUserRole: (userId, role) =>
      set((s) => ({ users: s.users.map((u) => u.id === userId ? { ...u, role } : u) }))
    }),
    { name: 'ohmega-platform-v1' }
  )
);

/* ---------- Sélecteurs dérivés ---------- */

export function useCurrentUser(): User | null {
  return useStore((s) => s.users.find((u) => u.id === s.currentUserId) ?? null);
}

export function useCartDetails() {
  return useStore((s) => {
    const lines = s.cart.
    map((l) => {
      const product = s.catalog.find((p) => p.slug === l.slug);
      return product ? { product, quantity: l.quantity } : null;
    }).
    filter((l): l is {product: Product;quantity: number;} => l !== null);
    const subtotal = lines.reduce((a, l) => a + l.product.price * l.quantity, 0);
    const coupon = s.coupons.find((c) => c.code === s.appliedCoupon && c.active) ?? null;
    const discount = coupon ? subtotal * coupon.percent / 100 : 0;
    const shipping = lines.length === 0 || subtotal - discount >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FLAT;
    const tax = (subtotal - discount) * TAX_RATE;
    return {
      lines,
      count: lines.reduce((a, l) => a + l.quantity, 0),
      subtotal,
      coupon,
      discount,
      shipping,
      tax,
      total: subtotal - discount + shipping + tax
    };
  });
}