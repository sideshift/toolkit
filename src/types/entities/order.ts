import { PaymentDestination } from '../core';

export type Order = {
  id: string;
  /**
   * @deprecated Use id
   */
  orderId: string;
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
  /**
   * The identifier of the quote the shift is based on if the shift
   * type is fixed.
   */
  quoteId: string | undefined;
  /**
   * The amount that must be deposited if the shift type is fixed.
   */
  depositAmount: string | undefined;
  /**
   * The amount that will be settled if the shift type is fixed.
   */
  settleAmount: string | undefined;
};
