
import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Palette, Moon, Sun } from "lucide-react";
import { Toggle } from "@/components/ui/toggle";

interface ThemeSettingsProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  accentColor: string;
  setAccentColor: (color: string) => void;
}

const ThemeSettings: React.FC<ThemeSettingsProps> = ({
  isDarkMode,
  toggleDarkMode,
  accentColor,
  setAccentColor
}) => {
  const { toast } = useToast();
  const [hue, setHue] = useState('210');
  const [saturation, setSaturation] = useState('100');
  const [lightness, setLightness] = useState('50');

  // Parse HSL string to individual values on component mount
  useEffect(() => {
    if (accentColor) {
      const match = accentColor.match(/(\d+)\s+(\d+)%\s+(\d+)%/);
      if (match) {
        setHue(match[1]);
        setSaturation(match[2]);
        setLightness(match[3]);
      }
    }
  }, []);

  const updateAccentColor = () => {
    const newColor = `${hue} ${saturation}% ${lightness}%`;
    setAccentColor(newColor);
    
    // Update CSS variable
    document.documentElement.style.setProperty('--invoice-accent', newColor);
    
    toast({
      title: "Theme Updated",
      description: "Your accent color has been updated."
    });
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <Palette className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Theme Settings</SheetTitle>
        </SheetHeader>
        <div className="mt-6 space-y-6">
          <div>
            <div className="flex justify-between items-center mb-4">
              <Label>Theme Mode</Label>
              <Toggle 
                pressed={isDarkMode}
                onPressedChange={toggleDarkMode}
                className="p-0 data-[state=on]:bg-slate-800"
                aria-label="Toggle dark mode"
              >
                {isDarkMode ? (
                  <Moon className="h-5 w-5" />
                ) : (
                  <Sun className="h-5 w-5" />
                )}
              </Toggle>
            </div>
          </div>

          <div className="space-y-4">
            <Label>Accent Color</Label>
            <div className="flex items-center gap-2">
              <div 
                className="w-10 h-10 rounded-full border" 
                style={{ backgroundColor: `hsl(${hue} ${saturation}% ${lightness}%)` }}
              />
              <span className="text-sm">
                HSL({hue}, {saturation}%, {lightness}%)
              </span>
            </div>

            <div className="space-y-2">
              <Label htmlFor="hue">Hue ({hue})</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="hue"
                  type="range"
                  min="0"
                  max="360"
                  value={hue}
                  onChange={(e) => setHue(e.target.value)}
                  className="w-full"
                />
                <Input 
                  type="number" 
                  value={hue} 
                  onChange={(e) => setHue(e.target.value)}
                  className="w-20" 
                  min="0" 
                  max="360"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="saturation">Saturation ({saturation}%)</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="saturation"
                  type="range"
                  min="0"
                  max="100"
                  value={saturation}
                  onChange={(e) => setSaturation(e.target.value)}
                  className="w-full"
                />
                <Input 
                  type="number" 
                  value={saturation} 
                  onChange={(e) => setSaturation(e.target.value)}
                  className="w-20" 
                  min="0" 
                  max="100"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="lightness">Lightness ({lightness}%)</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="lightness"
                  type="range"
                  min="0"
                  max="100"
                  value={lightness}
                  onChange={(e) => setLightness(e.target.value)}
                  className="w-full"
                />
                <Input 
                  type="number" 
                  value={lightness} 
                  onChange={(e) => setLightness(e.target.value)}
                  className="w-20" 
                  min="0" 
                  max="100"
                />
              </div>
            </div>
            
            <Button onClick={updateAccentColor} className="w-full mt-4 invoice-accent-bg invoice-accent-hover">
              <Palette className="mr-2 h-4 w-4" />
              Apply Color
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ThemeSettings;
