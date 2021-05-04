import * as t from 'io-ts';
import { Deposit, Order, DepositMethod, SettleMethod, Quote } from './entities';

export type GetDepositResponse = Deposit;

export type GetQuoteResponse = Quote;

export type GetOrderResponse = Order & {
  deposits: Omit<GetDepositResponse, 'orderId'>[];
};

export type CreateOrderResponse = GetOrderResponse;

export type RequestQuoteResponse = GetQuoteResponse;

export const createOrderInputDecoder = t.type({
  depositMethodId: t.union([t.string, t.undefined, t.null]),
  settleMethodId: t.union([t.string, t.undefined, t.null]),
  settleAddress: t.string,
  /**
   * @deprecated Create a quote and supply `quoteId`
   */
  depositAmount: t.union([t.string, t.undefined, t.null]),
  /**
   * @deprecated Create a quote and supply `quoteId`
   */
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
  /**
   * The id of the quote to base this order on
   */
  quoteId: t.union([t.string, t.undefined, t.null]),
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

export const createQuoteInputDecoder = t.type({
  depositMethod: t.string,
  settleMethod: t.string,
  depositAmount: t.union([t.string, t.undefined, t.null]),
  settleAmount: t.union([t.string, t.undefined, t.null]),
});

export type CreateQuoteInput = t.TypeOf<typeof createQuoteInputDecoder>;

export type GetFactsResponse = {
  assets: {
    [assetId: string]: {
      id: string;
      name: string;
    };
  };
  depositMethods: {
    [depositMethodId: string]: DepositMethod;
  };
  settleMethods: {
    [settleMethodId: string]: SettleMethod;
  };
};

export type GetPairResponse = {
  rate: string | null;
  min: string | null;
  max: string | null;
};

export const setRefundAddressInputDecoder = t.type({
  orderId: t.string,
  address: t.string,
  memo: t.union([t.string, t.undefined]),
});
