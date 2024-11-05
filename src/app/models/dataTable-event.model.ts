export enum eventType{
  details = "details",
  delete = "delete",
  modify = "modify",
  add = "add"
}

export enum tableType{
  PurchaseInvoice="PurchaseInvoice", SaleInvoice="SaleInvoice", otherSaleInvoice="otherSaleInvoice", Student="Student"
}

export interface TableEvent{
    type: eventType;
    tableType : tableType;
    target?: number | String;
  }