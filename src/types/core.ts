export type PaymentDestination = {
  address?: string;
  uri?: string;
  invoiceId?: string;
};

export type SendReceipt = {
  txHash: string;
  txKey?: string;
  invoiceId?: string;
};
