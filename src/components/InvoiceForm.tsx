
import React, { useState, useRef, ChangeEvent } from "react";
import { useToast } from "../hooks/use-toast";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Calendar } from "./ui/calendar";
import { format, addDays } from "date-fns";
import { Calendar as CalendarIcon, Printer, Save, Image, ChevronDown, Copy, Trash2, Settings } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog";

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
    details: "3DPRS\nkhaledreez22@gmail.com\nwww.behance.net/3dprs",
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
  
  // Preset dialogs
  const [isSaveCompanyOpen, setIsSaveCompanyOpen] = useState(false);
  const [isSaveClientOpen, setIsSaveClientOpen] = useState(false);
  const [isSavePaymentOpen, setIsSavePaymentOpen] = useState(false);
  const [newCompanyPresetName, setNewCompanyPresetName] = useState("");
  const [newClientPresetName, setNewClientPresetName] = useState("");
  const [newPaymentPresetName, setNewPaymentPresetName] = useState("");
  
  // Company Info
  const [companyDetails, setCompanyDetails] = useState(defaultCompanyPresets[0].details);
  const [companyLogo, setCompanyLogo] = useState(defaultCompanyPresets[0].logo || "");

  // Invoice Details
  const [invoiceNumber, setInvoiceNumber] = useState("16");
  const [invoiceDate, setInvoiceDate] = useState<Date | undefined>(today);
  const [dueDate, setDueDate] = useState<Date | undefined>(addDays(today, 7));
  const [enableDueDate, setEnableDueDate] = useState(true);
  const [currency, setCurrency] = useState("USD ($)");

  // Client Details
  const [billTo, setBillTo] = useState(defaultClientPresets[0].details);

  // Invoice Items
  const [items, setItems] = useState<InvoiceItem[]>([
    {
      id: "1",
      description: "Dehumidifier Render",
      quantity: 4,
      rate: 25,
      amount: 100,
    },
  ]);

  // Payment Details
  const [paymentDetails, setPaymentDetails] = useState(
    "IBAN: BG76MYFN401210E1860019\nKhaled Güir"
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

  // Preset handling functions with name support
  const saveCompanyPreset = () => {
    if (!newCompanyPresetName.trim()) {
      toast({
        title: "Preset name required",
        description: "Please enter a name for your company preset.",
        variant: "destructive"
      });
      return;
    }
    
    // Check if preset with same name exists
    const existingIndex = companyPresets.findIndex(p => p.name === newCompanyPresetName);
    
    if (existingIndex >= 0) {
      // Replace existing preset
      const updatedPresets = [...companyPresets];
      updatedPresets[existingIndex] = {
        ...updatedPresets[existingIndex],
        details: companyDetails,
        logo: companyLogo
      };
      setCompanyPresets(updatedPresets);
    } else {
      // Create new preset
      const newPreset: CompanyPreset = {
        id: Date.now().toString(),
        name: newCompanyPresetName,
        details: companyDetails,
        logo: companyLogo
      };
      setCompanyPresets([...companyPresets, newPreset]);
    }
    
    setIsSaveCompanyOpen(false);
    setNewCompanyPresetName("");
    toast({
      title: "Company Preset Saved",
      description: `Company preset "${newCompanyPresetName}" has been saved!`,
    });
  };

  const saveClientPreset = () => {
    if (!newClientPresetName.trim()) {
      toast({
        title: "Preset name required",
        description: "Please enter a name for your client preset.",
        variant: "destructive"
      });
      return;
    }
    
    // Check if preset with same name exists
    const existingIndex = clientPresets.findIndex(p => p.name === newClientPresetName);
    
    if (existingIndex >= 0) {
      // Replace existing preset
      const updatedPresets = [...clientPresets];
      updatedPresets[existingIndex] = {
        ...updatedPresets[existingIndex],
        details: billTo
      };
      setClientPresets(updatedPresets);
    } else {
      // Create new preset
      const newPreset: ClientPreset = {
        id: Date.now().toString(),
        name: newClientPresetName,
        details: billTo
      };
      setClientPresets([...clientPresets, newPreset]);
    }
    
    setIsSaveClientOpen(false);
    setNewClientPresetName("");
    toast({
      title: "Client Preset Saved",
      description: `Client preset "${newClientPresetName}" has been saved!`,
    });
  };

  const savePaymentPreset = () => {
    if (!newPaymentPresetName.trim()) {
      toast({
        title: "Preset name required",
        description: "Please enter a name for your payment preset.",
        variant: "destructive"
      });
      return;
    }
    
    // Check if preset with same name exists
    const existingIndex = paymentPresets.findIndex(p => p.name === newPaymentPresetName);
    
    if (existingIndex >= 0) {
      // Replace existing preset
      const updatedPresets = [...paymentPresets];
      updatedPresets[existingIndex] = {
        ...updatedPresets[existingIndex],
        details: paymentDetails
      };
      setPaymentPresets(updatedPresets);
    } else {
      // Create new preset
      const newPreset: PaymentPreset = {
        id: Date.now().toString(),
        name: newPaymentPresetName,
        details: paymentDetails
      };
      setPaymentPresets([...paymentPresets, newPreset]);
    }
    
    setIsSavePaymentOpen(false);
    setNewPaymentPresetName("");
    toast({
      title: "Payment Preset Saved",
      description: `Payment preset "${newPaymentPresetName}" has been saved!`,
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

  // Add delete preset functionality
  const deleteCompanyPreset = (presetId: string) => {
    setCompanyPresets(companyPresets.filter(preset => preset.id !== presetId));
    toast({
      title: "Company Preset Deleted",
      description: "The company preset has been deleted.",
    });
  };

  const deleteClientPreset = (presetId: string) => {
    setClientPresets(clientPresets.filter(preset => preset.id !== presetId));
    toast({
      title: "Client Preset Deleted",
      description: "The client preset has been deleted.",
    });
  };

  const deletePaymentPreset = (presetId: string) => {
    setPaymentPresets(paymentPresets.filter(preset => preset.id !== presetId));
    toast({
      title: "Payment Preset Deleted",
      description: "The payment preset has been deleted.",
    });
  };

  // Logo display component for direct image upload
  const LogoDisplay = () => {
    if (companyLogo) {
      return (
        <div className="relative w-full h-20 mb-3 border border-dashed border-gray-300 rounded-md bg-gray-50 flex justify-center items-center overflow-hidden group">
          <img 
            src={companyLogo} 
            alt="Company Logo" 
            className="h-full w-auto object-contain"
          />
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={triggerFileInput}
              className="text-white"
            >
              <Image className="h-4 w-4 mr-2" />
              Change Logo
            </Button>
          </div>
        </div>
      );
    }
    
    return (
      <div className="mb-3">
        <input 
          type="file" 
          ref={fileInputRef}
          className="hidden" 
          accept="image/*" 
          onChange={handleLogoUpload} 
        />
        <Button 
          variant="outline" 
          size="sm" 
          onClick={triggerFileInput}
          className="w-full justify-center border-dashed border-gray-300 bg-gray-50"
        >
          <Image className="h-4 w-4 mr-2" />
          Upload Logo
        </Button>
      </div>
    );
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
          <h1 className="text-xl font-bold">3DPRS Invoice</h1>
        </div>
        <div className="flex space-x-2">
          <Button 
            variant="ghost" 
            size="icon"
            className="text-white"
          >
            <CalendarIcon className="h-5 w-5" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            className="text-white"
          >
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="p-6 space-y-6 bg-gray-50">
        {/* Grid layout with 2 rows of 2 cards each */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Company Details Section */}
          <Card className="border-0 shadow-sm overflow-hidden h-auto">
            <CardContent className="p-0">
              <div className="bg-white p-4 flex justify-between items-center border-b">
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
                        <DropdownMenuItem key={preset.id} className="flex items-center justify-between">
                          <span onClick={() => loadCompanyPreset(preset)}>{preset.name}</span>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteCompanyPreset(preset.id);
                            }}
                            className="h-7 w-7 text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-8"
                    onClick={() => setIsSaveCompanyOpen(true)}
                  >
                    Save Preset
                  </Button>
                </div>
              </div>
              <div className="p-4">
                <LogoDisplay />
                <Textarea
                  value={companyDetails}
                  onChange={(e) => setCompanyDetails(e.target.value)}
                  className="resize-none min-h-[150px] text-sm border bg-gray-50"
                  placeholder="Company name, email, website"
                />
              </div>
            </CardContent>
          </Card>

          {/* Invoice Details Section */}
          <Card className="border-0 shadow-sm overflow-hidden h-auto">
            <CardContent className="p-0">
              <div className="bg-white p-4 border-b">
                <Label className="text-base font-medium text-blue-600">Invoice Details</Label>
              </div>
              <div className="bg-white p-4 space-y-4">
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
                    <option value="USD ($)">USD ($)</option>
                    <option value="EUR (€)">EUR (€)</option>
                    <option value="GBP (£)">GBP (£)</option>
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
                        className={enableDueDate ? "bg-blue-600" : ""}
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

          {/* Client Information */}
          <Card className="border-0 shadow-sm overflow-hidden h-auto">
            <CardContent className="p-0">
              <div className="bg-white p-4 flex justify-between items-center border-b">
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
                        <DropdownMenuItem key={preset.id} className="flex items-center justify-between">
                          <span onClick={() => loadClientPreset(preset)}>{preset.name}</span>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteClientPreset(preset.id);
                            }}
                            className="h-7 w-7 text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-8"
                    onClick={() => setIsSaveClientOpen(true)}
                  >
                    Save Preset
                  </Button>
                </div>
              </div>
              <div className="p-4">
                <Textarea
                  value={billTo}
                  onChange={(e) => setBillTo(e.target.value)}
                  className="resize-none min-h-[150px] text-sm border bg-gray-50"
                  placeholder="Client details"
                />
              </div>
            </CardContent>
          </Card>

          {/* Payment Details - Moved to be after invoice details */}
          <Card className="border-0 shadow-sm overflow-hidden h-auto">
            <CardContent className="p-0">
              <div className="bg-white p-4 flex justify-between items-center border-b">
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
                        <DropdownMenuItem key={preset.id} className="flex items-center justify-between">
                          <span onClick={() => loadPaymentPreset(preset)}>{preset.name}</span>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={(e) => {
                              e.stopPropagation();
                              deletePaymentPreset(preset.id);
                            }}
                            className="h-7 w-7 text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-8"
                    onClick={() => setIsSavePaymentOpen(true)}
                  >
                    Save Preset
                  </Button>
                </div>
              </div>
              <div className="p-4 bg-white space-y-4">
                <div>
                  <Label className="text-sm mb-1 block">Instructions</Label>
                  <Textarea
                    value={paymentDetails}
                    onChange={(e) => setPaymentDetails(e.target.value)}
                    className="resize-none min-h-[80px] text-sm border bg-gray-50"
                    placeholder="Bank account details, payment instructions, etc."
                  />
                </div>
                
                <div>
                  <Label className="text-sm mb-1 block">Note</Label>
                  <Textarea
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    className="resize-none min-h-[80px] text-sm border bg-gray-50"
                    placeholder="Thank you note or additional information"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Items Table */}
        <Card className="border-0 shadow-sm overflow-hidden">
          <CardContent className="p-0">
            <div className="p-4 bg-white border-b">
              <Label className="text-base font-medium text-blue-600">Invoice Items</Label>
            </div>
            <div className="bg-white">
              <table className="w-full">
                <thead>
                  <tr className="text-left border-b border-gray-200">
                    <th className="px-4 py-3 text-sm font-medium text-gray-600">Description</th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-gray-600 w-24">Quantity</th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-gray-600 w-24">Rate</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-600 w-32">Amount</th>
                    <th className="w-16 px-4 py-3 text-sm font-medium text-gray-600 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
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
                          className="text-center border-gray-200 text-sm"
                          min="0"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <Input
                          type="number"
                          value={item.rate}
                          onChange={(e) => handleItemChange(item.id, "rate", Number(e.target.value))}
                          className="text-center border-gray-200 text-sm"
                          min="0"
                          step="0.01"
                        />
                      </td>
                      <td className="px-4 py-3 text-right font-medium text-sm">
                        ${item.amount.toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {items.length > 1 && (
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleRemoveItem(item.id)}
                            className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              <div className="p-4">
                <Button
                  onClick={handleAddItem}
                  variant="outline"
                  size="sm"
                  className="text-blue-600 border-blue-200 hover:bg-blue-50 text-sm"
                >
                  + Add Item
                </Button>
              </div>
              
              <div className="border-t border-gray-200 bg-white">
                <div className="flex justify-between p-4">
                  <div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-gray-600 text-xs border-gray-300"
                    >
                      Split Payment
                    </Button>
                  </div>
                  <div className="text-right">
                    <div className="mb-2">
                      <span className="font-medium">Total:</span>
                      <span className="font-bold text-lg ml-2">${total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
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

      {/* Save Preset Dialogs */}
      <Dialog open={isSaveCompanyOpen} onOpenChange={setIsSaveCompanyOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Save Company Preset</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="company-preset-name">Preset Name</Label>
              <Input
                id="company-preset-name" 
                value={newCompanyPresetName}
                onChange={(e) => setNewCompanyPresetName(e.target.value)}
                placeholder="Enter preset name"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSaveCompanyOpen(false)}>Cancel</Button>
            <Button onClick={saveCompanyPreset}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isSaveClientOpen} onOpenChange={setIsSaveClientOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Save Client Preset</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="client-preset-name">Preset Name</Label>
              <Input
                id="client-preset-name" 
                value={newClientPresetName}
                onChange={(e) => setNewClientPresetName(e.target.value)}
                placeholder="Enter preset name"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSaveClientOpen(false)}>Cancel</Button>
            <Button onClick={saveClientPreset}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isSavePaymentOpen} onOpenChange={setIsSavePaymentOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Save Payment Preset</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="payment-preset-name">Preset Name</Label>
              <Input
                id="payment-preset-name" 
                value={newPaymentPresetName}
                onChange={(e) => setNewPaymentPresetName(e.target.value)}
                placeholder="Enter preset name"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSavePaymentOpen(false)}>Cancel</Button>
            <Button onClick={savePaymentPreset}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InvoiceForm;
