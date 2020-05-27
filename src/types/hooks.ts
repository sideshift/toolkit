import * as rest from './rest';

export enum HookEventStatus {
  pending = 'pending',
  success = 'success',
  fail = 'fail',
}

export enum HookEventType {
  orderCreate = 'order:create',
  orderUpdate = 'order:update',
  depositCreate = 'deposit:create',
  depositUpdate = 'deposit:update',
  ping = 'ping',
}

export type HookDeliveryResponse = {
  status: number;
  code: number;
  message: string;
};

export type Hook = {
  id: string;
  sessionId: string;
  name: string | undefined;
  createdAt: string;
  updatedAt: string;
  targetUrl: string;
  enabled: boolean;
  eventTypes: HookEventType[];
};

export type HookEvent = {
  type: HookEventType;
  lastResponse?: HookDeliveryResponse;
};

export type HookMeta = {
  hook: Hook;
};

export type OrderCreateHookPayload = Omit<rest.CreateOrderResponse, 'deposits'>;
export type OrderUpdateHookPayload = Omit<rest.GetOrderResponse, 'deposits'>;
export type DepositCreateHookPayload = Omit<
  rest.GetDepositResponse,
  'deposits'
>;
export type DepositUpdateHookPayload = Omit<
  rest.GetDepositResponse,
  'deposits'
>;
export type PingHookPayload = {};

export type HookPayload =
  | OrderCreateHookPayload
  | OrderUpdateHookPayload
  | DepositCreateHookPayload
  | DepositUpdateHookPayload
  | PingHookPayload;

export type PayloadForEventType<
  P extends HookEventType
> = P extends HookEventType.orderCreate
  ? OrderCreateHookPayload
  : P extends HookEventType.orderUpdate
  ? OrderUpdateHookPayload
  : P extends HookEventType.depositCreate
  ? DepositCreateHookPayload
  : P extends HookEventType.depositUpdate
  ? DepositUpdateHookPayload
  : P extends HookEventType.ping
  ? PingHookPayload
  : never;

export type HookDeliveryFor<T extends HookEventType> = {
  meta: HookMeta;
  type: T;
  payload: PayloadForEventType<T>;
};

export type OrderCreateHookDelivery = HookDeliveryFor<
  HookEventType.orderCreate
>;
export type OrderUpdateHookDelivery = HookDeliveryFor<
  HookEventType.orderUpdate
>;
export type DepositCreateHookDelivery = HookDeliveryFor<
  HookEventType.depositCreate
>;
export type DepositUpdateHookDelivery = HookDeliveryFor<
  HookEventType.depositUpdate
>;
export type PingHookDelivery = HookDeliveryFor<HookEventType.ping>;

export type HookDelivery =
  | OrderCreateHookDelivery
  | OrderUpdateHookDelivery
  | DepositCreateHookDelivery
  | DepositUpdateHookDelivery
  | PingHookDelivery;
