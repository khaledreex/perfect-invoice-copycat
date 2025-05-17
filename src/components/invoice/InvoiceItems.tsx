
import React from "react";
import { Card, CardContent } from "../ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Trash2 } from "lucide-react";

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

interface InvoiceItemsProps {
  items: InvoiceItem[];
  handleAddItem: () => void;
  handleRemoveItem: (id: string) => void;
  handleItemChange: (id: string, field: keyof InvoiceItem, value: any) => void;
  subtotal: number;
  total: number;
}

const InvoiceItems: React.FC<InvoiceItemsProps> = ({
  items,
  handleAddItem,
  handleRemoveItem,
  handleItemChange,
  subtotal,
  total
}) => {
  return (
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
  );
};

export default InvoiceItems;
