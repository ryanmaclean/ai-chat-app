import React from 'react';
import { useTheme } from '../theme/ThemeProvider';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';

export const ThemeSettings: React.FC = () => {
  const { theme, setTheme } = useTheme();
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Appearance</h3>
      
      <RadioGroup 
        value={theme} 
        onValueChange={(value) => setTheme(value as 'light' | 'dark' | 'system')}
        className="space-y-2"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="light" id="theme-light" />
          <Label htmlFor="theme-light">Light</Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="dark" id="theme-dark" />
          <Label htmlFor="theme-dark">Dark</Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="system" id="theme-system" />
          <Label htmlFor="theme-system">System</Label>
        </div>
      </RadioGroup>
      
      <div className="text-sm text-muted-foreground">
        Choose how the application appears to you. You can match your system preferences or choose a specific theme.
      </div>
    </div>
  );
}; 