
import React from "react";
import { Card, CardContent } from "../ui/card";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { ChevronDown, Trash2 } from "lucide-react";

interface PaymentPreset {
  id: string;
  name: string;
  details: string;
}

interface PaymentDetailsProps {
  paymentDetails: string;
  setPaymentDetails: (value: string) => void;
  noteText: string;
  setNoteText: (value: string) => void;
  paymentPresets: PaymentPreset[];
  deletePaymentPreset: (id: string) => void;
  loadPaymentPreset: (preset: PaymentPreset) => void;
  openSavePresetDialog: () => void;
}

const PaymentDetails: React.FC<PaymentDetailsProps> = ({
  paymentDetails,
  setPaymentDetails,
  noteText,
  setNoteText,
  paymentPresets,
  deletePaymentPreset,
  loadPaymentPreset,
  openSavePresetDialog,
}) => {
  return (
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
              onClick={openSavePresetDialog}
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
  );
};

export default PaymentDetails;
