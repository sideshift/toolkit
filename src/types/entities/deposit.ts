import { SendReceipt, PaymentDestination } from '../core';

export type Deposit = {
  id: string;
  /**
   * @deprecated Use id
   */
  depositId: string;
  /**
   * @deprecated Use createdAtISO
   */
  createdAt: string;
  createdAtISO: string;
  depositAmount: string;
  settleRate?: string;
  settleAmount?: string;
  networkFeeAmount?: string;
  status: string;
  settleTx?: SendReceipt;
  refundAddress?: PaymentDestination;
  refundTx?: SendReceipt;
  reason?: string;
  orderId: string;
  /**
   * The deposit transaction of the shift. The receipt type varies by the order's `depositMethodId`.
   */
  depositTx: SendReceipt;
};
