# Scentology BD

A mood-first niche perfume storefront for Bangladesh. **Scented your mood.**

## Run locally

```bash
npm install
npm run dev
```

The dev server binds to `0.0.0.0` so it works behind the Arena preview proxy.

## What's here

- **Mood-led storefront** — seven moods (Calm, Romantic, Bold, Fresh, Mysterious, Joyful, Focus), each with its own glow colour. Hero niches, mood labels under every bottle, an interactive "Choose your mood" section that lights matching perfumes and dims the rest, and mood filters on the collection page.
- **Brand identity** — crisp SVG text logo (`/logo.svg`, `src/components/Logo.tsx`) with the tagline underneath, `৳` pricing, and "Scented your mood" in the document title and footer.
- **Bangladesh checkout** — Cash on Delivery by default, manual bKash / Nagad with a transaction ID for admin verification, BD phone validation (`01XXXXXXXXX`), district selector with Dhaka / outside-Dhaka charges and a free-delivery threshold.
- **Admin panel** — `/admin` (demo password: `scentology`). Dashboard, product editor with a Mood field, Moods manager with editable colours, order management with status transitions and payment confirmation, store settings, and a print-ready invoice / delivery slip at `/admin/invoice/:id`.
- **Order tracking** — `/track` lets a customer look up an order by ID and phone.
- **Floating WhatsApp / Messenger** button and Facebook / Instagram links in the footer; URLs are editable in admin settings.
- **Bangla / English toggle** in the header. All UI copy is centralised in `src/lib/i18n.ts`, and products and moods carry Bangla name/description fields.

## Data & persistence

Products, moods, orders, settings, cart and language are stored in the browser's `localStorage` under `scentology-bd-v1` (seeded on first load). This makes the full buyer + admin flow demoable without a backend. To connect a real backend later, replace the persistence boundary in `src/store/StoreContext.tsx`.

## Payment gateway hook

`src/lib/payments.ts` defines a small adapter interface. COD / bKash / Nagad manual flows are live; SSLCommerz or bKash API can be plugged in by enabling an adapter without rewriting checkout.
