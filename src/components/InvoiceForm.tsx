
import React, { useState } from "react";
import { useToast } from "../hooks/use-toast";
import { Button } from "./ui/button";
import { format, addDays } from "date-fns";
import { CalendarIcon, Printer, Save, Settings } from "lucide-react";
import CompanyDetails from "./invoice/CompanyDetails";
import InvoiceDetails from "./invoice/InvoiceDetails";
import ClientDetails from "./invoice/ClientDetails";
import PaymentDetails from "./invoice/PaymentDetails";
import InvoiceItems from "./invoice/InvoiceItems";
import PresetDialog from "./invoice/PresetDialog";
import { CompanyPreset, ClientPreset, PaymentPreset, InvoiceItem } from "./invoice/types";

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
          <CompanyDetails 
            companyDetails={companyDetails}
            setCompanyDetails={setCompanyDetails}
            companyLogo={companyLogo}
            setCompanyLogo={setCompanyLogo}
            companyPresets={companyPresets}
            deleteCompanyPreset={deleteCompanyPreset}
            loadCompanyPreset={loadCompanyPreset}
            openSavePresetDialog={() => setIsSaveCompanyOpen(true)}
          />

          {/* Invoice Details Section */}
          <InvoiceDetails 
            invoiceNumber={invoiceNumber}
            setInvoiceNumber={setInvoiceNumber}
            invoiceDate={invoiceDate}
            setInvoiceDate={setInvoiceDate}
            dueDate={dueDate}
            setDueDate={setDueDate}
            enableDueDate={enableDueDate}
            setEnableDueDate={setEnableDueDate}
            currency={currency}
            setCurrency={setCurrency}
          />

          {/* Client Information */}
          <ClientDetails 
            billTo={billTo}
            setBillTo={setBillTo}
            clientPresets={clientPresets}
            deleteClientPreset={deleteClientPreset}
            loadClientPreset={loadClientPreset}
            openSavePresetDialog={() => setIsSaveClientOpen(true)}
          />

          {/* Payment Details */}
          <PaymentDetails 
            paymentDetails={paymentDetails}
            setPaymentDetails={setPaymentDetails}
            noteText={noteText}
            setNoteText={setNoteText}
            paymentPresets={paymentPresets}
            deletePaymentPreset={deletePaymentPreset}
            loadPaymentPreset={loadPaymentPreset}
            openSavePresetDialog={() => setIsSavePaymentOpen(true)}
          />
        </div>

        {/* Items Table */}
        <InvoiceItems 
          items={items}
          handleAddItem={handleAddItem}
          handleRemoveItem={handleRemoveItem}
          handleItemChange={handleItemChange}
          subtotal={subtotal}
          total={total}
        />
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

      {/* Preset Dialogs */}
      <PresetDialog 
        isOpen={isSaveCompanyOpen}
        onOpenChange={setIsSaveCompanyOpen}
        title="Save Company Preset"
        presetName={newCompanyPresetName}
        setPresetName={setNewCompanyPresetName}
        onSave={saveCompanyPreset}
      />

      <PresetDialog 
        isOpen={isSaveClientOpen}
        onOpenChange={setIsSaveClientOpen}
        title="Save Client Preset"
        presetName={newClientPresetName}
        setPresetName={setNewClientPresetName}
        onSave={saveClientPreset}
      />

      <PresetDialog 
        isOpen={isSavePaymentOpen}
        onOpenChange={setIsSavePaymentOpen}
        title="Save Payment Preset"
        presetName={newPaymentPresetName}
        setPresetName={setNewPaymentPresetName}
        onSave={savePaymentPreset}
      />
    </div>
  );
};

export default InvoiceForm;
