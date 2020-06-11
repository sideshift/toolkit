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
  /**
   * @deprecated Use orderId
   */
  quoteId: string;
  orderId: string;
};
