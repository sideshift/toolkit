import * as t from 'io-ts';
import { SendReceipt, PaymentDestination } from './core';

export type GetDepositResponse = {
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

export type GetOrderResponse = {
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
  depositAddress: PaymentDestination;
  settleAddress: PaymentDestination;
  depositMethodId: string;
  settleMethodId: string;
  depositMin?: string;
  depositMax?: string;
  deposits: Omit<GetDepositResponse, 'orderId' | 'quoteId'>[];
};

export type CreateOrderResponse = GetOrderResponse;

export const createOrderInputDecoder = t.type({
  depositMethodId: t.string,
  settleMethodId: t.string,
  settleAddress: t.string,
  amount: t.union([t.string, t.undefined, t.null]),
  affiliateId: t.union([t.string, t.undefined, t.null]),
  refundAddress: t.union([t.string, t.undefined, t.null]),
  sessionSecret: t.union([t.string, t.undefined, t.null]),
  type: t.union([
    t.literal('variable'),
    t.literal('fixed'),
    t.undefined,
    t.null,
  ]),
  settleAmount: t.union([t.string, t.undefined, t.null]),
});

export type CreateOrderInput = Pick<
  t.TypeOf<typeof createOrderInputDecoder>,
  'depositMethodId' | 'settleAddress' | 'settleMethodId'
> &
  Partial<
    Omit<
      t.TypeOf<typeof createOrderInputDecoder>,
      'depositMethodId' | 'settleAddress' | 'settleMethodId'
    >
  >;

export type GetFactsResponse = {
  assets: {
    [assetId in string]: {
      id: string;
      name: string;
    };
  };
  depositMethods: {
    [depositMethodId in string]: {
      displayName: string;
      asset: string;
      invoice?: boolean;
      invoiceRequiresAmount?: boolean;
      enabled: boolean;
    };
  };
  settleMethods: {
    [depositMethodId in string]: {
      displayName: string;
      asset: string;
      enabled: boolean;
    };
  };
};

export type GetPairResponse = {
  rate: string | null;
  min: string | null;
  max: string | null;
};
