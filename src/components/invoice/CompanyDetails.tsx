
import React, { useRef, ChangeEvent } from "react";
import { Card, CardContent } from "../ui/card";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { ChevronDown, Image, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CompanyPreset {
  id: string;
  name: string;
  details: string;
  logo?: string;
}

interface CompanyDetailsProps {
  companyDetails: string;
  setCompanyDetails: (value: string) => void;
  companyLogo: string;
  setCompanyLogo: (value: string) => void;
  companyPresets: CompanyPreset[];
  deleteCompanyPreset: (id: string) => void;
  loadCompanyPreset: (preset: CompanyPreset) => void;
  openSavePresetDialog: () => void;
}

const CompanyDetails: React.FC<CompanyDetailsProps> = ({
  companyDetails,
  setCompanyDetails,
  companyLogo,
  setCompanyLogo,
  companyPresets,
  deleteCompanyPreset,
  loadCompanyPreset,
  openSavePresetDialog
}) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

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
              onClick={openSavePresetDialog}
            >
              Save Preset
            </Button>
          </div>
        </div>
        <div className="p-4">
          <Textarea
            value={companyDetails}
            onChange={(e) => setCompanyDetails(e.target.value)}
            className="resize-none min-h-[150px] text-sm border bg-gray-50"
            placeholder="Company name, email, website"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default CompanyDetails;
