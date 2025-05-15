
import React, { useState } from "react";
import { useToast } from "../hooks/use-toast";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Calendar } from "./ui/calendar";
import { format, addDays } from "date-fns";
import { Calendar as CalendarIcon, Printer, Save } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";

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
  const [companyDetails, setCompanyDetails] = useState(
    "3DPRS\nkhaledreez22@gmail.com\nhttps://www.behance.net/3dprs"
  );
  const [companyLogo, setCompanyLogo] = useState("/lovable-uploads/1993e3a5-e3c0-48f2-bfdc-ab95ade9cd82.png");

  // Invoice Details
  const [invoiceNumber, setInvoiceNumber] = useState("38");
  const [invoiceDate, setInvoiceDate] = useState<Date | undefined>(today);
  const [dueDate, setDueDate] = useState<Date | undefined>(addDays(today, 7));

  // Client Details
  const [billTo, setBillTo] = useState(
    "KvK: 88481492\nBTW: NL864645958B01\nNaam: Sanbo Group BV\nAdres: Meerheide 105, 5521DX, Eersel, NL"
  );

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

  // Payment Details
  const [paymentDetails, setPaymentDetails] = useState(
    "Bank Transfer Details:\nFEROZE SHAHEEN\nBE92 9676 4363 9523"
  );

  // Calculations
  const [amountPaid, setAmountPaid] = useState(0);

  // Calculate totals
  const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
  const total = subtotal;
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

  const handleRemoveItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
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

  const handleSave = () => {
    toast({
      title: "Invoice Saved",
      description: "Your invoice has been saved!",
    });
  };

  const setTodayDate = () => {
    const currentDate = new Date();
    setInvoiceDate(currentDate);
    setDueDate(addDays(currentDate, 7));
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden print:shadow-none">
      <div className="p-6 bg-gradient-to-r from-purple-600 to-indigo-800 text-white print:bg-purple-600">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <h1 className="text-3xl font-bold">Invoice Generator</h1>
          <div className="flex space-x-2 mt-4 md:mt-0">
            <Button 
              onClick={handleSave}
              variant="outline"
              className="bg-white/10 hover:bg-white/20 text-white border-white/20"
            >
              <Save size={18} className="mr-2" /> Save
            </Button>
            <Button 
              onClick={handlePrint}
              variant="outline" 
              className="bg-white hover:bg-gray-100 text-purple-700"
            >
              <Printer size={18} className="mr-2" /> Print
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-8">
        {/* Header Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="flex items-center mb-2">
              <div className="bg-purple-600 h-16 w-16 p-2 rounded-md mr-4">
                <img src={companyLogo} alt="Company Logo" className="w-full h-full object-contain" />
              </div>
              <Label className="block text-base font-medium text-gray-600">Company Details</Label>
            </div>
            <Textarea
              value={companyDetails}
              onChange={(e) => setCompanyDetails(e.target.value)}
              className="h-32 border-gray-300 text-sm resize-none"
              placeholder="Company name, email, website"
            />
          </div>

          <div>
            <h2 className="text-2xl font-bold text-purple-800 mb-3">INVOICE</h2>
            <div className="flex items-center justify-end mb-2">
              <span className="mr-2 text-gray-500">Invoice #</span>
              <Input
                type="text"
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                className="w-24 text-right border-gray-300 text-sm"
              />
            </div>

            <div className="flex items-center justify-end mb-2">
              <span className="mr-2 text-gray-500">Date</span>
              <Popover>
                <PopoverTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="w-40 justify-start text-left border-gray-300 text-sm"
                  >
                    {invoiceDate ? format(invoiceDate, "MMM dd, yyyy") : "Select date"}
                    <CalendarIcon className="ml-auto h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={invoiceDate}
                    onSelect={setInvoiceDate}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
              <Button
                onClick={setTodayDate}
                variant="ghost"
                size="sm"
                className="ml-2 text-xs"
              >
                Today
              </Button>
            </div>

            <div className="flex items-center justify-end">
              <span className="mr-2 text-gray-500">Due Date</span>
              <Popover>
                <PopoverTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="w-40 justify-start text-left border-gray-300 text-sm"
                  >
                    {dueDate ? format(dueDate, "MMM dd, yyyy") : "Select date"}
                    <CalendarIcon className="ml-auto h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={dueDate}
                    onSelect={setDueDate}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>

        {/* Client Information */}
        <div className="pt-4 border-t border-gray-200">
          <div>
            <Label className="block text-base font-medium text-gray-600 mb-2">Bill To</Label>
            <Textarea
              value={billTo}
              onChange={(e) => setBillTo(e.target.value)}
              className="h-32 border-gray-300 text-sm resize-none w-full"
            />
          </div>
        </div>

        {/* Items Table */}
        <Card className="border border-gray-200">
          <CardContent className="p-0">
            <table className="w-full">
              <thead>
                <tr className="bg-purple-50">
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Item / Description</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-600 w-20">Quantity</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-600 w-32">Rate</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-600 w-32">Amount</th>
                  <th className="w-10"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {items.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <Input
                        type="text"
                        value={item.description}
                        onChange={(e) => handleItemChange(item.id, "description", e.target.value)}
                        className="border-gray-200 text-sm"
                        placeholder="Item description"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <Input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(item.id, "quantity", Number(e.target.value))}
                        className="text-right border-gray-200 text-sm"
                        min="0"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end">
                        <span className="mr-1 text-gray-500">€</span>
                        <Input
                          type="number"
                          value={item.rate}
                          onChange={(e) => handleItemChange(item.id, "rate", Number(e.target.value))}
                          className="text-right border-gray-200 text-sm"
                          min="0"
                          step="0.01"
                        />
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-sm">€{item.amount.toFixed(2)}</td>
                    <td className="px-4 py-3">
                      {items.length > 1 && (
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleRemoveItem(item.id)}
                          className="h-8 w-8 text-gray-400 hover:text-red-500"
                        >
                          X
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            <div className="p-4 border-t border-gray-200">
              <Button
                onClick={handleAddItem}
                variant="outline"
                size="sm"
                className="text-purple-600 border-purple-200 hover:bg-purple-50 text-sm"
              >
                + Add Item
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Totals and Payment Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          <div className="space-y-4">
            <div>
              <Label className="block text-base font-medium text-gray-600 mb-2">Payment Details</Label>
              <Textarea
                value={paymentDetails}
                onChange={(e) => setPaymentDetails(e.target.value)}
                className="h-32 border-gray-300 text-sm resize-none"
                placeholder="Bank account details, payment instructions, etc."
              />
            </div>
          </div>

          <div>
            <Card className="border border-gray-200 overflow-hidden">
              <table className="w-full">
                <tbody>
                  <tr className="border-b border-gray-200">
                    <td className="px-4 py-3 text-gray-600 text-sm">Subtotal</td>
                    <td className="px-4 py-3 text-right font-medium text-sm">€{subtotal.toFixed(2)}</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="px-4 py-3 text-gray-600 text-sm">Total</td>
                    <td className="px-4 py-3 text-right text-base font-bold">€{total.toFixed(2)}</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="px-4 py-3 text-gray-600 text-sm">Amount Paid</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end">
                        <span className="mr-1 text-gray-500">€</span>
                        <Input
                          type="number"
                          value={amountPaid}
                          onChange={(e) => setAmountPaid(Number(e.target.value))}
                          className="w-24 text-right border-gray-300 text-sm"
                          min="0"
                          step="0.01"
                        />
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium text-purple-800 text-sm">Balance Due</td>
                    <td className="px-4 py-3 text-right text-base font-bold text-purple-800">€{balanceDue.toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>
            </Card>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-6 bg-gray-50 border-t border-gray-200 print:hidden">
        <div className="text-center text-sm text-gray-500">
          Thank you for your business!
        </div>
      </div>
    </div>
  );
};

export default InvoiceForm;
