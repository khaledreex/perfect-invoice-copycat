
import React from "react";
import { Card, CardContent } from "../ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Calendar } from "../ui/calendar";
import { format } from "date-fns";
import { Calendar as CalendarIcon, ChevronDown, Trash2, Edit, Copy } from "lucide-react";
import { Switch } from "../ui/switch";
import { Textarea } from "../ui/textarea";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";

interface PaymentPreset {
  id: string;
  name: string;
  details: string;
}

interface InvoiceDetailsProps {
  invoiceNumber: string;
  setInvoiceNumber: (value: string) => void;
  invoiceDate: Date | undefined;
  setInvoiceDate: (date: Date | undefined) => void;
  dueDate: Date | undefined;
  setDueDate: (date: Date | undefined) => void;
  enableDueDate: boolean;
  setEnableDueDate: (value: boolean) => void;
  currency: string;
  setCurrency: (value: string) => void;
  paymentDetails: string;
  setPaymentDetails: (value: string) => void;
  noteText: string;
  setNoteText: (value: string) => void;
  paymentPresets: PaymentPreset[];
  deletePaymentPreset: (id: string) => void;
  loadPaymentPreset: (preset: PaymentPreset) => void;
  openSavePresetDialog: () => void;
}

const InvoiceDetails: React.FC<InvoiceDetailsProps> = ({
  invoiceNumber,
  setInvoiceNumber,
  invoiceDate,
  setInvoiceDate,
  dueDate,
  setDueDate,
  enableDueDate,
  setEnableDueDate,
  currency,
  setCurrency,
  paymentDetails,
  setPaymentDetails,
  noteText,
  setNoteText,
  paymentPresets,
  deletePaymentPreset,
  loadPaymentPreset,
  openSavePresetDialog,
}) => {
  const handleTodayToggle = (checked: boolean) => {
    if (checked) {
      setInvoiceDate(new Date());
    }
  };
  return (
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
                <Label htmlFor="today-toggle" className="text-xs mr-2">Today</Label>
                <Switch 
                  id="today-toggle" 
                  checked={invoiceDate && format(invoiceDate, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')}
                  onCheckedChange={handleTodayToggle}
                  className="data-[state=checked]:bg-blue-600"
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
                    {invoiceDate ? format(invoiceDate, "dd.MM.yyyy") : "Select date"}
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
          
          <div>
            <div className="flex items-center justify-between mb-1">
              <Label htmlFor="due-date" className="text-sm">Due Date</Label>
              <div className="flex items-center">
                <Label htmlFor="due-date-toggle" className="text-xs mr-2">Due Date</Label>
                <Switch 
                  id="due-date-toggle" 
                  checked={enableDueDate} 
                  onCheckedChange={setEnableDueDate}
                  className="data-[state=checked]:bg-blue-600"
                />
              </div>
            </div>
            {enableDueDate && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start text-left border-gray-200 bg-gray-50 text-sm h-10"
                  >
                    {dueDate ? format(dueDate, "dd.MM.yyyy") : "Select date"}
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
            )}
          </div>
        </div>
        
        {/* Payment Details Section */}
        <div className="border-t">
          <div className="bg-white p-4 flex justify-between items-center border-b">
            <Label className="text-base font-medium text-blue-600">Payment Details</Label>
            <div className="flex gap-1">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8">
                    Load <ChevronDown size={14} className="ml-1" />
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
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Edit className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="p-4 bg-white space-y-4">
            <div>
              <Textarea
                value={paymentDetails}
                onChange={(e) => setPaymentDetails(e.target.value)}
                className="resize-none min-h-[80px] text-sm border bg-gray-50"
                placeholder="e.g., Bank Name, Account Number, SWIFT Code, Or PayPal: user@example.com"
              />
            </div>
            
            <div>
              <Label className="text-sm mb-1 block">Note</Label>
              <Textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                className="resize-none min-h-[80px] text-sm border bg-gray-50"
                placeholder="Thank you for your business!"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InvoiceDetails;
