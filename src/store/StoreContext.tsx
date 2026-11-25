import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { defaultSettings, seedMoods, seedOrders, seedProducts } from '../data/seed';
import { translate, type TranslationKey } from '../lib/i18n';
import type { CartItem, Language, Mood, Order, OrderStatus, Product, Settings } from '../types';

const STORAGE_KEY = 'scentology-bd-v1';

interface PersistedState {
  products: Product[];
  moods: Mood[];
  orders: Order[];
  settings: Settings;
  cart: CartItem[];
  language: Language;
}

interface StoreValue extends PersistedState {
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  setLanguage: (language: Language) => void;
  addToCart: (productId: string, qty?: number) => void;
  setQty: (productId: string, qty: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  saveProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  saveMood: (mood: Mood) => void;
  deleteMood: (id: string) => void;
  addOrder: (order: Order) => void;
  setOrderStatus: (id: string, status: OrderStatus) => void;
  confirmPayment: (id: string) => void;
  saveSettings: (settings: Settings) => void;
}

const StoreContext = createContext<StoreValue | null>(null);

function loadState(): PersistedState {
  const fallback: PersistedState = {
    products: seedProducts,
    moods: seedMoods,
    orders: seedOrders,
    settings: defaultSettings,
    cart: [],
    language: 'en',
  };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw) as Partial<PersistedState>;
    return {
      products: Array.isArray(parsed.products) ? parsed.products : fallback.products,
      moods: Array.isArray(parsed.moods) ? parsed.moods : fallback.moods,
      orders: Array.isArray(parsed.orders) ? parsed.orders : fallback.orders,
      settings: { ...defaultSettings, ...parsed.settings },
      cart: Array.isArray(parsed.cart) ? parsed.cart : [],
      language: parsed.language === 'bn' ? 'bn' : 'en',
    };
  } catch {
    return fallback;
  }
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PersistedState>(loadState);
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  useEffect(() => {
    document.documentElement.lang = state.language;
    document.title = `${translate(state.language, 'footer.tagline')} | Scentology BD`;
  }, [state.language]);

  const patch = useCallback((changes: Partial<PersistedState>) => {
    setState((current) => ({ ...current, ...changes }));
  }, []);

  const value = useMemo<StoreValue>(() => ({
    ...state,
    cartOpen,
    setCartOpen,
    setLanguage: (language) => patch({ language }),
    addToCart: (productId, qty = 1) => {
      setState((current) => {
        const existing = current.cart.find((item) => item.productId === productId);
        const cart = existing
          ? current.cart.map((item) => item.productId === productId ? { ...item, qty: item.qty + qty } : item)
          : [...current.cart, { productId, qty }];
        return { ...current, cart };
      });
      setCartOpen(true);
    },
    setQty: (productId, qty) => setState((current) => ({
      ...current,
      cart: qty <= 0
        ? current.cart.filter((item) => item.productId !== productId)
        : current.cart.map((item) => item.productId === productId ? { ...item, qty } : item),
    })),
    removeFromCart: (productId) => setState((current) => ({
      ...current,
      cart: current.cart.filter((item) => item.productId !== productId),
    })),
    clearCart: () => patch({ cart: [] }),
    saveProduct: (product) => setState((current) => ({
      ...current,
      products: current.products.some((p) => p.id === product.id)
        ? current.products.map((p) => p.id === product.id ? product : p)
        : [...current.products, product],
    })),
    deleteProduct: (id) => setState((current) => ({
      ...current,
      products: current.products.filter((p) => p.id !== id),
      cart: current.cart.filter((item) => item.productId !== id),
    })),
    saveMood: (mood) => setState((current) => ({
      ...current,
      moods: current.moods.some((m) => m.id === mood.id)
        ? current.moods.map((m) => m.id === mood.id ? mood : m)
        : [...current.moods, mood],
    })),
    deleteMood: (id) => setState((current) => ({
      ...current,
      moods: current.moods.filter((m) => m.id !== id),
      products: current.products.map((p) => p.moodId === id ? { ...p, moodId: current.moods.find((m) => m.id !== id)?.id ?? '' } : p),
    })),
    addOrder: (order) => setState((current) => ({ ...current, orders: [order, ...current.orders] })),
    setOrderStatus: (id, status) => setState((current) => ({
      ...current,
      orders: current.orders.map((order) => order.id === id ? { ...order, status } : order),
    })),
    confirmPayment: (id) => setState((current) => ({
      ...current,
      orders: current.orders.map((order) => order.id === id
        ? { ...order, payment: { ...order.payment, status: 'Confirmed' }, status: 'Confirmed' }
        : order),
    })),
    saveSettings: (settings) => patch({ settings }),
  }), [state, cartOpen, patch]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreValue {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used inside StoreProvider');
  return context;
}

export function useT() {
  const { language } = useStore();
  return {
    language,
    t: (key: TranslationKey) => translate(language, key),
    pick: (en: string, bn: string) => (language === 'bn' && bn.trim() ? bn : en),
  };
}
