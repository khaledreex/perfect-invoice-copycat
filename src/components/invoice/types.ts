
export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

export interface CompanyPreset {
  id: string;
  name: string;
  details: string;
  logo?: string;
}

export interface ClientPreset {
  id: string;
  name: string;
  details: string;
}

export interface PaymentPreset {
  id: string;
  name: string;
  details: string;
}
