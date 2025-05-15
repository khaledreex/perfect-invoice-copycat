
import React, { useState } from "react";
import { useToast } from "../hooks/use-toast";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Calendar } from "./ui/calendar";
import { format } from "date-fns";
import { Plus, Check } from "lucide-react";

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

const InvoiceForm: React.FC = () => {
  const { toast } = useToast();
  const today = new Date();
  
  // Company Info
  const [companyName, setCompanyName] = useState("3DPRS");
  const [companyEmail, setCompanyEmail] = useState("khaledreez22@gmail.com");
  const [companyWebsite, setCompanyWebsite] = useState("https://www.behance.net/3dprs");
  const [companyLogo, setCompanyLogo] = useState("/lovable-uploads/1993e3a5-e3c0-48f2-bfdc-ab95ade9cd82.png");

  // Invoice Details
  const [invoiceNumber, setInvoiceNumber] = useState("38");
  const [invoiceDate, setInvoiceDate] = useState<Date | undefined>(today);
  const [paymentTerms, setPaymentTerms] = useState("");
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [poNumber, setPoNumber] = useState("");

  // Client Details
  const [billTo, setBillTo] = useState(
    "KvK: 88481492\nBTW: NL864645958B01\nNaam: Sanbo Group BV\nAdres: Meerheide 105, 5521DX, Eersel, NL"
  );
  const [shipTo, setShipTo] = useState("");

  // Invoice Items
  const [items, setItems] = useState<InvoiceItem[]>([
    {
      id: "1",
      description: "Erikssen Tower Fan Interior Renders",
      quantity: 4,
      rate: 25,
      amount: 100,
    },
  ]);

  // Notes and Terms
  const [notes, setNotes] = useState(
    "Bank Transfer Details:\nFEROZE SHAHEEN\nBE92 9676 4363 9523"
  );
  const [terms, setTerms] = useState(
    "Terms and conditions - late fees, payment methods, delivery schedule"
  );

  // Calculations
  const [taxPercentage, setTaxPercentage] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [shipping, setShipping] = useState(0);
  const [amountPaid, setAmountPaid] = useState(0);

  // Calculate totals
  const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
  const taxAmount = (subtotal * taxPercentage) / 100;
  const total = subtotal + taxAmount + shipping - discount;
  const balanceDue = total - amountPaid;

  const handleAddItem = () => {
    const newItem: InvoiceItem = {
      id: Date.now().toString(),
      description: "",
      quantity: 1,
      rate: 0,
      amount: 0,
    };
    setItems([...items, newItem]);
  };

  const handleItemChange = (id: string, field: keyof InvoiceItem, value: any) => {
    setItems(
      items.map((item) => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value };
          
          if (field === "quantity" || field === "rate") {
            updatedItem.amount = updatedItem.quantity * updatedItem.rate;
          }
          
          return updatedItem;
        }
        return item;
      })
    );
  };

  const handlePrint = () => {
    window.print();
    toast({
      title: "Invoice Created",
      description: "Your invoice is ready to be sent!",
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-5 invoice-container print:shadow-none">
      <div className="print:hidden mb-4">
        <Button onClick={handlePrint} className="bg-invoice-accent hover:bg-blue-700">
          Generate Invoice PDF
        </Button>
      </div>
      
      <div className="invoice-content">
        <div className="flex justify-between items-start mb-8">
          <div className="logo-section">
            <div className="bg-blue-600 h-[106px] w-[106px] p-4">
              <img src={companyLogo} alt="Company Logo" className="w-full" />
            </div>
            <div className="mt-2">
              <textarea
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                rows={1}
                className="invoice-input w-full"
              />
              <textarea
                value={companyEmail}
                onChange={(e) => setCompanyEmail(e.target.value)}
                rows={1}
                className="invoice-input w-full mt-1"
              />
              <textarea
                value={companyWebsite}
                onChange={(e) => setCompanyWebsite(e.target.value)}
                rows={1}
                className="invoice-input w-full mt-1"
              />
            </div>
          </div>
          
          <div className="text-right">
            <h1 className="text-4xl font-bold mb-4">INVOICE</h1>
            <div className="flex items-center justify-end">
              <span className="mr-2">#</span>
              <input
                type="text"
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                className="invoice-input"
              />
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <div className="mb-4">
              <label className="block text-invoice-muted mb-1">Bill To</label>
              <textarea
                value={billTo}
                onChange={(e) => setBillTo(e.target.value)}
                rows={6}
                className="invoice-input w-full"
              />
            </div>
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-4">
              <label className="text-invoice-muted">Ship To</label>
              <textarea
                value={shipTo}
                onChange={(e) => setShipTo(e.target.value)}
                placeholder="(optional)"
                rows={6}
                className="invoice-input w-full"
              />
            </div>
            
            <div className="flex justify-between items-center mb-2">
              <label className="text-invoice-muted">Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="invoice-input w-40 justify-start text-left font-normal">
                    {invoiceDate ? format(invoiceDate, "MMM dd, yyyy") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-invoice-input">
                  <Calendar
                    mode="single"
                    selected={invoiceDate}
                    onSelect={setInvoiceDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="flex justify-between items-center mb-2">
              <label className="text-invoice-muted">Payment Terms</label>
              <input
                type="text"
                value={paymentTerms}
                onChange={(e) => setPaymentTerms(e.target.value)}
                className="invoice-input w-40"
              />
            </div>
            
            <div className="flex justify-between items-center mb-2">
              <label className="text-invoice-muted">Due Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="invoice-input w-40 justify-start text-left font-normal">
                    {dueDate ? format(dueDate, "MMM dd, yyyy") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-invoice-input">
                  <Calendar
                    mode="single"
                    selected={dueDate}
                    onSelect={setDueDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="flex justify-between items-center">
              <label className="text-invoice-muted">PO Number</label>
              <input
                type="text"
                value={poNumber}
                onChange={(e) => setPoNumber(e.target.value)}
                className="invoice-input w-40"
              />
            </div>
          </div>
        </div>
        
        <div className="mb-8">
          <div className="grid grid-cols-12 gap-4 mb-2 text-invoice-muted">
            <div className="col-span-6">Item</div>
            <div className="col-span-2 text-right">Quantity</div>
            <div className="col-span-2 text-right">Rate</div>
            <div className="col-span-2 text-right">Amount</div>
          </div>
          
          {items.map((item) => (
            <div key={item.id} className="grid grid-cols-12 gap-4 mb-2">
              <div className="col-span-6">
                <input
                  type="text"
                  value={item.description}
                  onChange={(e) => handleItemChange(item.id, "description", e.target.value)}
                  className="invoice-input w-full"
                />
              </div>
              <div className="col-span-2">
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => handleItemChange(item.id, "quantity", Number(e.target.value))}
                  className="invoice-input w-full text-right"
                />
              </div>
              <div className="col-span-2">
                <div className="flex items-center justify-end">
                  <span className="mr-1">€</span>
                  <input
                    type="number"
                    value={item.rate}
                    onChange={(e) => handleItemChange(item.id, "rate", Number(e.target.value))}
                    className="invoice-input w-full text-right"
                  />
                </div>
              </div>
              <div className="col-span-2 text-right flex items-center justify-end">
                €{item.amount.toFixed(2)}
              </div>
            </div>
          ))}
          
          <button
            onClick={handleAddItem}
            className="flex items-center text-green-500 mt-4 hover:text-green-400 transition-colors border border-invoice-border rounded-md px-3 py-2"
          >
            <Plus size={16} className="mr-1" /> Line Item
          </button>
        </div>
        
        <div className="grid grid-cols-2 gap-8">
          <div>
            <div className="mb-4">
              <label className="block text-invoice-muted mb-1">Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                className="invoice-input w-full"
              />
            </div>
            
            <div>
              <label className="block text-invoice-muted mb-1">Terms</label>
              <textarea
                value={terms}
                onChange={(e) => setTerms(e.target.value)}
                rows={2}
                className="invoice-input w-full"
              />
            </div>
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-invoice-muted">Subtotal</span>
              <span>€{subtotal.toFixed(2)}</span>
            </div>
            
            <div className="flex justify-between items-center mb-2">
              <span className="text-invoice-muted">Tax</span>
              <div className="flex items-center">
                <input
                  type="number"
                  value={taxPercentage}
                  onChange={(e) => setTaxPercentage(Number(e.target.value))}
                  className="invoice-input w-20 text-right mr-2"
                />
                <span className="mr-2">%</span>
                <button className="bg-invoice-input rounded-full p-1">
                  <Check size={16} />
                </button>
              </div>
            </div>
            
            <div className="flex justify-between items-center mb-2">
              <button className="flex items-center text-invoice-accent hover:text-blue-400 transition-colors">
                <Plus size={16} className="mr-1" /> Discount
              </button>
              {discount > 0 && (
                <span>€{discount.toFixed(2)}</span>
              )}
            </div>
            
            <div className="flex justify-between items-center mb-4">
              <button className="flex items-center text-invoice-accent hover:text-blue-400 transition-colors">
                <Plus size={16} className="mr-1" /> Shipping
              </button>
              {shipping > 0 && (
                <span>€{shipping.toFixed(2)}</span>
              )}
            </div>
            
            <div className="flex justify-between items-center mb-2 font-bold">
              <span>Total</span>
              <span>€{total.toFixed(2)}</span>
            </div>
            
            <div className="flex justify-between items-center mb-2">
              <span className="text-invoice-muted">Amount Paid</span>
              <div className="flex items-center">
                <span className="mr-1">€</span>
                <input
                  type="number"
                  value={amountPaid}
                  onChange={(e) => setAmountPaid(Number(e.target.value))}
                  className="invoice-input w-24 text-right"
                />
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-invoice-muted">Balance Due</span>
              <span>€{balanceDue.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceForm;
