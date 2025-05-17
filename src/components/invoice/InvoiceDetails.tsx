
import React from "react";
import { Card, CardContent } from "../ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Calendar } from "../ui/calendar";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Switch } from "../ui/switch";

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
}) => {
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
  );
};

export default InvoiceDetails;
