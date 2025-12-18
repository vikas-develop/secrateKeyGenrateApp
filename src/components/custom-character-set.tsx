"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { excludeSimilarCharacters, getSimilarCharacters } from "@/lib/secret-generators";
import { Settings, Info, AlertCircle, CheckCircle2 } from "lucide-react";

interface CustomCharacterSetProps {
  value: string;
  onChange: (value: string) => void;
  excludeSimilar: boolean;
  onExcludeSimilarChange: (value: boolean) => void;
  useCustom: boolean;
  onUseCustomChange: (value: boolean) => void;
}

const CHARACTER_SET_PRESETS = {
  alphanumeric: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  numbers: '0123456789',
  symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
  alphanumericSafe: 'abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789', // Excludes similar
  hex: '0123456789abcdef',
  base64: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/',
};

export function CustomCharacterSet({
  value,
  onChange,
  excludeSimilar,
  onExcludeSimilarChange,
  useCustom,
  onUseCustomChange,
}: CustomCharacterSetProps) {
  const [previewValue, setPreviewValue] = useState(value);

  // Calculate effective character set
  const effectiveCharset = useMemo(() => {
    if (!value) return '';
    return excludeSimilar ? excludeSimilarCharacters(value) : value;
  }, [value, excludeSimilar]);

  // Validation
  const isValid = effectiveCharset.length > 0;
  const hasDuplicates = value.length !== new Set(value.split('')).size;
  const duplicateCount = value.length - new Set(value.split('')).size;

  const handlePresetClick = (preset: string) => {
    onChange(preset);
    setPreviewValue(preset);
  };

  const handleInputChange = (newValue: string) => {
    onChange(newValue);
    setPreviewValue(newValue);
  };

  return (
    <Card className="border-2">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg font-semibold">Custom Character Set</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="use-custom-charset"
              checked={useCustom}
              onCheckedChange={(checked) => onUseCustomChange(checked === true)}
              className="h-5 w-5"
            />
            <Label htmlFor="use-custom-charset" className="cursor-pointer text-sm font-medium">
              Use Custom Set
            </Label>
          </div>
        </div>
        <CardDescription>
          Define your own character set for secret generation
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {useCustom && (
          <>
            {/* Character Set Input */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="custom-charset" className="text-sm font-medium">
                  Character Set
                </Label>
                <Badge variant="outline" className="text-xs">
                  {value.length} chars
                </Badge>
              </div>
              <Input
                id="custom-charset"
                value={value}
                onChange={(e) => handleInputChange(e.target.value)}
                placeholder="Enter characters (e.g., abc123!@#)"
                className="font-mono text-sm"
              />
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                {isValid ? (
                  <>
                    <CheckCircle2 className="h-3 w-3 text-green-500" />
                    <span>Valid character set ({effectiveCharset.length} characters after filtering)</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="h-3 w-3 text-red-500" />
                    <span>Character set is empty or invalid</span>
                  </>
                )}
              </div>
              {hasDuplicates && (
                <div className="flex items-center gap-2 text-xs text-yellow-600 dark:text-yellow-400">
                  <AlertCircle className="h-3 w-3" />
                  <span>Warning: {duplicateCount} duplicate character(s) found</span>
                </div>
              )}
            </div>

            {/* Exclude Similar Characters */}
            <div className="flex items-center space-x-3 p-4 rounded-lg bg-muted/30 border border-border/50">
              <Checkbox
                id="exclude-similar"
                checked={excludeSimilar}
                onCheckedChange={(checked) => onExcludeSimilarChange(checked === true)}
                className="h-5 w-5"
              />
              <div className="flex-1">
                <Label htmlFor="exclude-similar" className="cursor-pointer text-sm font-medium">
                  Exclude Similar Characters
                </Label>
                <p className="text-xs text-muted-foreground mt-1">
                  Removes confusing characters like 0/O, 1/l/I, 5/S, 2/Z
                </p>
              </div>
            </div>

            {/* Preview */}
            {effectiveCharset && (
              <div className="space-y-2">
                <Label className="text-sm font-medium">Preview (After Filtering)</Label>
                <div className="p-3 bg-muted/50 rounded-md border border-border/50">
                  <code className="text-xs font-mono break-all">
                    {effectiveCharset || '(empty)'}
                  </code>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Info className="h-3 w-3" />
                  <span>
                    {effectiveCharset.length} unique character{effectiveCharset.length !== 1 ? 's' : ''} available
                  </span>
                </div>
              </div>
            )}

            <Separator />

            {/* Presets */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Quick Presets</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {Object.entries(CHARACTER_SET_PRESETS).map(([name, preset]) => (
                  <Button
                    key={name}
                    variant="outline"
                    size="sm"
                    onClick={() => handlePresetClick(preset)}
                    className="text-xs justify-start font-mono"
                  >
                    {name}
                  </Button>
                ))}
              </div>
            </div>

            {/* Similar Characters Info */}
            {excludeSimilar && (
              <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800">
                <div className="flex items-start gap-2">
                  <Info className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5" />
                  <div className="flex-1 space-y-1">
                    <p className="text-xs font-medium text-blue-900 dark:text-blue-100">
                      Excluded Similar Characters:
                    </p>
                    <p className="text-xs text-blue-700 dark:text-blue-300">
                      {`0/O/o, 1/l/I/i/|, 5/S/s, 2/Z/z`}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {!useCustom && (
          <div className="p-4 rounded-lg bg-muted/30 border border-dashed text-center">
            <p className="text-sm text-muted-foreground">
              Enable &quot;Use Custom Set&quot; to define your own character set
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

