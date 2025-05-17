
import React, { useState, useRef, ChangeEvent } from "react";
import { useToast } from "../hooks/use-toast";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Calendar } from "./ui/calendar";
import { format, addDays } from "date-fns";
import { Calendar as CalendarIcon, Printer, Save, Image, ChevronDown, Copy } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

// Preset interfaces
interface CompanyPreset {
  id: string;
  name: string;
  details: string;
  logo?: string;
}

interface ClientPreset {
  id: string;
  name: string;
  details: string;
}

interface PaymentPreset {
  id: string;
  name: string;
  details: string;
}

// Default presets
const defaultCompanyPresets: CompanyPreset[] = [
  {
    id: "1",
    name: "3DPRS",
    details: "3DPRS\nkhaledreez22@gmail.com\nhttps://www.behance.net/3dprs",
    logo: "/lovable-uploads/1993e3a5-e3c0-48f2-bfdc-ab95ade9cd82.png"
  }
];

const defaultClientPresets: ClientPreset[] = [
  {
    id: "1",
    name: "Sanbo Group",
    details: "KvK: 88481492\nBTW: NL864645958B01\nNaam: Sanbo Group BV\nAdres: Meerheide 105, 5521DX, Eersel, NL"
  }
];

const defaultPaymentPresets: PaymentPreset[] = [
  {
    id: "1",
    name: "Bank Transfer",
    details: "IBAN: BG76MYFN401210E1860019\nKhaled Güir"
  }
];

const InvoiceForm: React.FC = () => {
  const { toast } = useToast();
  const today = new Date();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Presets
  const [companyPresets, setCompanyPresets] = useState<CompanyPreset[]>(defaultCompanyPresets);
  const [clientPresets, setClientPresets] = useState<ClientPreset[]>(defaultClientPresets);
  const [paymentPresets, setPaymentPresets] = useState<PaymentPreset[]>(defaultPaymentPresets);
  
  // Company Info
  const [companyDetails, setCompanyDetails] = useState(defaultCompanyPresets[0].details);
  const [companyLogo, setCompanyLogo] = useState(defaultCompanyPresets[0].logo || "");

  // Invoice Details
  const [invoiceNumber, setInvoiceNumber] = useState("38");
  const [invoiceDate, setInvoiceDate] = useState<Date | undefined>(today);
  const [dueDate, setDueDate] = useState<Date | undefined>(addDays(today, 7));
  const [enableDueDate, setEnableDueDate] = useState(true);
  const [currency, setCurrency] = useState("€");

  // Client Details
  const [billTo, setBillTo] = useState(defaultClientPresets[0].details);

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
  const [noteText, setNoteText] = useState("Thank you for your business!");

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

  const handleSaveInvoice = () => {
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

  const handleLogoUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setCompanyLogo(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Preset handling functions
  const saveCompanyPreset = () => {
    const newPreset: CompanyPreset = {
      id: Date.now().toString(),
      name: `Company ${companyPresets.length + 1}`,
      details: companyDetails,
      logo: companyLogo
    };
    setCompanyPresets([...companyPresets, newPreset]);
    toast({
      title: "Company Preset Saved",
      description: "Your company preset has been saved!",
    });
  };

  const saveClientPreset = () => {
    const newPreset: ClientPreset = {
      id: Date.now().toString(),
      name: `Client ${clientPresets.length + 1}`,
      details: billTo
    };
    setClientPresets([...clientPresets, newPreset]);
    toast({
      title: "Client Preset Saved",
      description: "Your client preset has been saved!",
    });
  };

  const savePaymentPreset = () => {
    const newPreset: PaymentPreset = {
      id: Date.now().toString(),
      name: `Payment ${paymentPresets.length + 1}`,
      details: paymentDetails
    };
    setPaymentPresets([...paymentPresets, newPreset]);
    toast({
      title: "Payment Preset Saved",
      description: "Your payment preset has been saved!",
    });
  };

  const loadCompanyPreset = (preset: CompanyPreset) => {
    setCompanyDetails(preset.details);
    if (preset.logo) setCompanyLogo(preset.logo);
    toast({
      title: "Company Preset Loaded",
      description: `Loaded "${preset.name}" company preset.`,
    });
  };

  const loadClientPreset = (preset: ClientPreset) => {
    setBillTo(preset.details);
    toast({
      title: "Client Preset Loaded",
      description: `Loaded "${preset.name}" client preset.`,
    });
  };

  const loadPaymentPreset = (preset: PaymentPreset) => {
    setPaymentDetails(preset.details);
    toast({
      title: "Payment Preset Loaded",
      description: `Loaded "${preset.name}" payment preset.`,
    });
  };

  return (
    <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden print:shadow-none">
      {/* Header with logo and title */}
      <div className="p-4 bg-blue-600 text-white flex items-center justify-between print:hidden">
        <div className="flex items-center gap-3">
          <div className="bg-white rounded p-1 flex items-center justify-center">
            {companyLogo ? (
              <img src={companyLogo} alt="Company Logo" className="h-8 w-auto object-contain" />
            ) : (
              <div className="h-8 w-8 bg-blue-100"></div>
            )}
          </div>
          <h1 className="text-xl font-bold">Invoice Generator</h1>
        </div>
        <div className="flex space-x-2">
          <Button 
            onClick={handleSaveInvoice}
            variant="outline"
            className="bg-white/10 hover:bg-white/20 text-white border-white/20"
          >
            <Save size={18} className="mr-2" /> Save
          </Button>
          <Button 
            onClick={handlePrint}
            variant="outline" 
            className="bg-white hover:bg-gray-100 text-blue-700"
          >
            <Printer size={18} className="mr-2" /> Print
          </Button>
        </div>
      </div>

      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Company Details Section */}
          <Card className="border border-gray-200 shadow-sm">
            <CardContent className="p-4">
              <div className="flex justify-between items-center mb-3">
                <Label className="text-base font-medium text-blue-600">Company Details</Label>
                <div className="flex gap-1">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="h-8">
                        Load preset <ChevronDown size={14} className="ml-1" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      {companyPresets.map(preset => (
                        <DropdownMenuItem key={preset.id} onClick={() => loadCompanyPreset(preset)}>
                          {preset.name}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-8"
                    onClick={saveCompanyPreset}
                  >
                    <Copy size={14} className="mr-1" /> Save Preset
                  </Button>
                </div>
              </div>
              <div className="flex items-center mb-3">
                <div 
                  className="bg-gray-100 h-16 w-16 p-2 rounded-md mr-4 flex items-center justify-center cursor-pointer relative overflow-hidden"
                  onClick={triggerFileInput}
                >
                  {companyLogo ? (
                    <img src={companyLogo} alt="Company Logo" className="w-full h-full object-contain" />
                  ) : (
                    <Image className="text-gray-400" />
                  )}
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    className="hidden" 
                    accept="image/*" 
                    onChange={handleLogoUpload} 
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all flex items-center justify-center">
                    <Image className="text-white opacity-0 hover:opacity-100" size={20} />
                  </div>
                </div>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  onClick={triggerFileInput}
                  className="text-xs"
                >
                  Change Logo
                </Button>
              </div>
              <Textarea
                value={companyDetails}
                onChange={(e) => setCompanyDetails(e.target.value)}
                className="resize-none min-h-[120px] text-sm"
                placeholder="Company name, email, website"
              />
            </CardContent>
          </Card>

          {/* Invoice Details Section */}
          <Card className="border border-gray-200 shadow-sm">
            <CardContent className="p-4">
              <Label className="text-base font-medium text-blue-600 mb-3 block">Invoice Details</Label>
              
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <Label htmlFor="invoice-number" className="text-sm">Invoice Number</Label>
                    <div className="flex items-center">
                      <Label htmlFor="auto-number" className="text-xs mr-2">Auto</Label>
                      <Switch id="auto-number" />
                    </div>
                  </div>
                  <Input
                    id="invoice-number"
                    type="text"
                    value={invoiceNumber}
                    onChange={(e) => setInvoiceNumber(e.target.value)}
                    className="bg-gray-50 border-gray-200 text-sm"
                  />
                </div>

                <div>
                  <Label htmlFor="currency" className="text-sm mb-1 block">Currency</Label>
                  <select
                    id="currency"
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full h-10 bg-gray-50 border border-gray-200 rounded-md px-3 py-2 text-sm"
                  >
                    <option value="€">EUR (€)</option>
                    <option value="$">USD ($)</option>
                    <option value="£">GBP (£)</option>
                  </select>
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <Label htmlFor="invoice-date" className="text-sm">Invoice Date</Label>
                    <div className="flex items-center">
                      <Label htmlFor="due-date-toggle" className="text-xs mr-2">Enable Due Date</Label>
                      <Switch 
                        id="due-date-toggle" 
                        checked={enableDueDate} 
                        onCheckedChange={setEnableDueDate} 
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 items-center">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button 
                          variant="outline" 
                          className="w-full justify-start text-left border-gray-200 bg-gray-50 text-sm h-10"
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
                      variant="outline"
                      size="sm"
                      className="text-xs"
                    >
                      Today
                    </Button>
                  </div>
                </div>
                
                {enableDueDate && (
                  <div>
                    <Label htmlFor="due-date" className="text-sm mb-1 block">Due Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button 
                          variant="outline" 
                          className="w-full justify-start text-left border-gray-200 bg-gray-50 text-sm h-10"
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
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Client Information */}
        <Card className="border border-gray-200 shadow-sm">
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-3">
              <Label className="text-base font-medium text-blue-600">Bill To</Label>
              <div className="flex gap-1">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="h-8">
                      Load preset <ChevronDown size={14} className="ml-1" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {clientPresets.map(preset => (
                      <DropdownMenuItem key={preset.id} onClick={() => loadClientPreset(preset)}>
                        {preset.name}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-8"
                  onClick={saveClientPreset}
                >
                  <Copy size={14} className="mr-1" /> Save Preset
                </Button>
              </div>
            </div>
            <Textarea
              value={billTo}
              onChange={(e) => setBillTo(e.target.value)}
              className="resize-none min-h-[120px] text-sm"
              placeholder="Client details"
            />
          </CardContent>
        </Card>

        {/* Items Table */}
        <Card className="border border-gray-200 shadow-sm">
          <CardContent className="p-0">
            <div className="p-4 border-b border-gray-200">
              <Label className="text-base font-medium text-blue-600">Invoice Items</Label>
            </div>
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 text-left border-b border-gray-200">
                  <th className="px-4 py-3 text-sm font-medium text-gray-600">Description</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-600 w-24">Quantity</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-600 w-32">Rate</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-600 w-32">Amount</th>
                  <th className="w-16 px-4 py-3 text-sm font-medium text-gray-600">Action</th>
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
                        <span className="mr-1 text-gray-500">{currency}</span>
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
                    <td className="px-4 py-3 text-right font-medium text-sm">{currency}{item.amount.toFixed(2)}</td>
                    <td className="px-4 py-3 text-center">
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
                className="text-blue-600 border-blue-200 hover:bg-blue-50 text-sm"
              >
                + Add Item
              </Button>
            </div>
            
            <div className="border-t border-gray-200">
              <div className="py-3 px-4 flex items-center justify-between text-sm">
                <span className="font-medium">Total:</span>
                <span className="font-bold text-lg">{currency}{total.toFixed(2)}</span>
              </div>
              <div className="bg-gray-50 p-3 rounded-b-lg">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-gray-600 text-xs border-gray-300"
                >
                  Split Payment
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Details */}
        <Card className="border border-gray-200 shadow-sm">
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-3">
              <Label className="text-base font-medium text-blue-600">Payment Details</Label>
              <div className="flex gap-1">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="h-8">
                      Load preset <ChevronDown size={14} className="ml-1" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {paymentPresets.map(preset => (
                      <DropdownMenuItem key={preset.id} onClick={() => loadPaymentPreset(preset)}>
                        {preset.name}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-8"
                  onClick={savePaymentPreset}
                >
                  <Copy size={14} className="mr-1" /> Save Preset
                </Button>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <Label className="text-sm mb-1 block">Instructions</Label>
                <Textarea
                  value={paymentDetails}
                  onChange={(e) => setPaymentDetails(e.target.value)}
                  className="resize-none min-h-[80px] text-sm"
                  placeholder="Bank account details, payment instructions, etc."
                />
              </div>
              
              <div>
                <Label className="text-sm mb-1 block">Note</Label>
                <Textarea
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  className="resize-none min-h-[80px] text-sm"
                  placeholder="Thank you note or additional information"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer with save button */}
      <div className="p-6 bg-gray-50 border-t border-gray-200 flex justify-end print:hidden">
        <Button 
          onClick={handleSaveInvoice}
          variant="default"
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Save size={18} className="mr-2" /> Save Invoice
        </Button>
      </div>
    </div>
  );
};

export default InvoiceForm;
