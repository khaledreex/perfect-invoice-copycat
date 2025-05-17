
import React from "react";
import { Card, CardContent } from "../ui/card";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { ChevronDown, Trash2 } from "lucide-react";

interface ClientPreset {
  id: string;
  name: string;
  details: string;
}

interface ClientDetailsProps {
  billTo: string;
  setBillTo: (value: string) => void;
  clientPresets: ClientPreset[];
  deleteClientPreset: (id: string) => void;
  loadClientPreset: (preset: ClientPreset) => void;
  openSavePresetDialog: () => void;
}

const ClientDetails: React.FC<ClientDetailsProps> = ({
  billTo,
  setBillTo,
  clientPresets,
  deleteClientPreset,
  loadClientPreset,
  openSavePresetDialog,
}) => {
  return (
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
              onClick={openSavePresetDialog}
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
  );
};

export default ClientDetails;
