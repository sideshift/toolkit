export type DepositMethod = {
  displayName: string;
  asset: string;
  invoice?: boolean;
  invoiceRequiresAmount?: boolean;
  enabled: boolean;
};
