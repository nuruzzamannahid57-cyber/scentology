/**
 * Payment gateway seam.
 *
 * COD and manual bKash / Nagad transfers are handled inline in Checkout.tsx.
 * To go live with SSLCommerz or the bKash API, implement this adapter and add
 * it to `gatewayAdapters`; Checkout renders the enabled adapters automatically.
 */
export interface PaymentGatewayAdapter {
  id: string;
  label: string;
  enabled: boolean;
  startCheckout: (orderId: string, amount: number) => Promise<{ redirectUrl: string }>;
}

export const gatewayAdapters: PaymentGatewayAdapter[] = [
  {
    id: 'sslcommerz',
    label: 'Card / SSLCommerz',
    enabled: false,
    startCheckout: async () => {
      throw new Error('Gateway adapter not configured yet.');
    },
  },
];
