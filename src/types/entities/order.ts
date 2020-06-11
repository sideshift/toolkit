import { PaymentDestination } from '../core';

export type Order = {
  id: string;
  /**
   * @deprecated Use id
   */
  orderId: string;
  /**
   * @deprecated Use id
   */
  quoteId: string;
  /**
   * @deprecated Use createdAtISO
   */
  createdAt: string;
  createdAtISO: string;
  /**
   * @deprecated Use expiresAtISO
   */
  expiresAt: string | undefined;
  expiresAtISO: string | undefined;
  depositAddress: PaymentDestination;
  settleAddress: PaymentDestination;
  depositMethodId: string;
  settleMethodId: string;
  depositMin?: string;
  depositMax?: string;
};
