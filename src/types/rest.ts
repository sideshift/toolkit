import * as t from 'io-ts';
import { Deposit, Order, DepositMethod, SettleMethod } from './entities';

export type GetDepositResponse = Deposit;

export type GetOrderResponse = Order & {
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
