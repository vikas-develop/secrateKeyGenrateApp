"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { generateSecret, type GeneratorAlgorithm, type GeneratorConfig } from "@/lib/secret-generators";
import { PasswordStrengthIndicator } from "@/components/password-strength-indicator";
import { SecretHistory } from "@/components/secret-history";
import { QRCodeDisplay } from "@/components/qr-code-display";
import { CustomCharacterSet } from "@/components/custom-character-set";
import { useSecretStore } from "@/store/secret-store";
import { calculatePasswordStrength } from "@/lib/password-strength";
import { exportSecret, exportBatchSecrets, copyMultipleSecrets } from "@/lib/export-utils";
import { Download, Layers, CheckSquare, Square } from "lucide-react";
import { 
  Copy, 
  RefreshCw, 
  Key, 
  Lock, 
  Hash, 
  Code, 
  Fingerprint, 
  Shield, 
  Link, 
  CreditCard, 
  FileKey, 
  Binary,
  Sparkles,
  CheckCircle2
} from "lucide-react";

// Constants moved outside component for optimization
const algorithmNames: Record<GeneratorAlgorithm, string> = {
  alphanumeric: "Alphanumeric",
  "with-symbols": "With Symbols",
  hexadecimal: "Hexadecimal",
  base64: "Base64",
  uuid: "UUID v4",
  "secure-random": "Secure Random",
  "api-key": "API Key",
  "numeric-pin": "Numeric PIN",
  password: "Password",
  "binary-key": "Binary Key",
};

const algorithmDescriptions: Record<GeneratorAlgorithm, string> = {
  alphanumeric: "Random string with letters and numbers (A-Z, a-z, 0-9)",
  "with-symbols": "Random string with letters, numbers, and special characters",
  hexadecimal: "Hexadecimal string (0-9, a-f)",
  base64: "Base64-like character set (A-Z, a-z, 0-9, +, /)",
  uuid: "UUID version 4 (standard format)",
  "secure-random": "Cryptographically secure random bytes (Base64 encoded)",
  "api-key": "API key format (xxxx-xxxx-xxxx-xxxx)",
  "numeric-pin": "Numeric PIN code (0-9)",
  password: "Password with customizable character requirements",
  "binary-key": "Binary key displayed as hexadecimal",
};

const algorithmIcons: Record<GeneratorAlgorithm, React.ReactNode> = {
  alphanumeric: <Key className="h-4 w-4" />,
  "with-symbols": <Lock className="h-4 w-4" />,
  hexadecimal: <Hash className="h-4 w-4" />,
  base64: <Code className="h-4 w-4" />,
  uuid: <Fingerprint className="h-4 w-4" />,
  "secure-random": <Shield className="h-4 w-4" />,
  "api-key": <Link className="h-4 w-4" />,
  "numeric-pin": <CreditCard className="h-4 w-4" />,
  password: <FileKey className="h-4 w-4" />,
  "binary-key": <Binary className="h-4 w-4" />,
};

const algorithmBadges: Record<GeneratorAlgorithm, { label: string; variant: "default" | "secondary" | "outline" }> = {
  alphanumeric: { label: "Standard", variant: "default" },
  "with-symbols": { label: "Enhanced", variant: "secondary" },
  hexadecimal: { label: "Hex", variant: "outline" },
  base64: { label: "Base64", variant: "outline" },
  uuid: { label: "Standard", variant: "default" },
  "secure-random": { label: "Most Secure", variant: "default" },
  "api-key": { label: "Formatted", variant: "secondary" },
  "numeric-pin": { label: "Numeric", variant: "outline" },
  password: { label: "Customizable", variant: "secondary" },
  "binary-key": { label: "Binary", variant: "outline" },
};

export function SecretGenerator() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [batchCount, setBatchCount] = useState(5);
  const [selectedBatchSecrets, setSelectedBatchSecrets] = useState<Set<string>>(new Set());
  const { toast } = useToast();
  
  // Zustand store state
  const algorithm = useSecretStore((state) => state.algorithm) as GeneratorAlgorithm;
  const length = useSecretStore((state) => state.length);
  const includeSymbols = useSecretStore((state) => state.includeSymbols);
  const segments = useSecretStore((state) => state.segments);
  const segmentLength = useSecretStore((state) => state.segmentLength);
  const bytes = useSecretStore((state) => state.bytes);
  const passwordOptions = useSecretStore((state) => state.passwordOptions);
  const generatedSecret = useSecretStore((state) => state.generatedSecret);
  
  // Zustand store actions
  const setAlgorithm = useSecretStore((state) => state.setAlgorithm);
  const setLength = useSecretStore((state) => state.setLength);
  const setIncludeSymbols = useSecretStore((state) => state.setIncludeSymbols);
  const setSegments = useSecretStore((state) => state.setSegments);
  const setSegmentLength = useSecretStore((state) => state.setSegmentLength);
  const setBytes = useSecretStore((state) => state.setBytes);
  const setPasswordOptions = useSecretStore((state) => state.setPasswordOptions);
  const setGeneratedSecret = useSecretStore((state) => state.setGeneratedSecret);
  const addToHistory = useSecretStore((state) => state.addToHistory);
  
  // Batch generation state
  const batchSecrets = useSecretStore((state) => state.batchSecrets);
  const setBatchSecrets = useSecretStore((state) => state.setBatchSecrets);
  const clearBatchSecrets = useSecretStore((state) => state.clearBatchSecrets);
  
  // Custom character set state
  const customCharacterSet = useSecretStore((state) => state.customCharacterSet);
  const setCustomCharacterSet = useSecretStore((state) => state.setCustomCharacterSet);
  const useCustomCharacterSet = useSecretStore((state) => state.useCustomCharacterSet);
  const setUseCustomCharacterSet = useSecretStore((state) => state.setUseCustomCharacterSet);
  const excludeSimilarCharacters = useSecretStore((state) => state.excludeSimilarCharacters);
  const setExcludeSimilarCharacters = useSecretStore((state) => state.setExcludeSimilarCharacters);

  // Memoize config to avoid recreating on every render
  const config = useMemo<GeneratorConfig>(() => ({
    algorithm: algorithm as GeneratorAlgorithm,
    length,
    includeSymbols,
    segments,
    segmentLength,
    bytes,
    passwordOptions: algorithm === "password" ? passwordOptions : undefined,
    customCharacterSet: useCustomCharacterSet ? customCharacterSet : undefined,
    useCustomCharacterSet,
    excludeSimilarCharacters,
  }), [algorithm, length, includeSymbols, segments, segmentLength, bytes, passwordOptions, customCharacterSet, useCustomCharacterSet, excludeSimilarCharacters]);

  const handleGenerate = async () => {
    setIsGenerating(true);
    clearBatchSecrets(); // Clear batch when generating single
    setSelectedBatchSecrets(new Set());
    try {
      const secret = await generateSecret(config);
      setGeneratedSecret(secret);
      
      // Auto-save to history with strength information
      const strengthResult = calculatePasswordStrength(secret);
      addToHistory(secret, algorithm, {
        score: strengthResult.score,
        strength: strengthResult.strength,
        entropy: strengthResult.entropy,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate secret. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = async () => {
    if (!generatedSecret) return;

    try {
      await navigator.clipboard.writeText(generatedSecret);
      toast({
        title: "Copied!",
        description: "Secret has been copied to clipboard.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard.",
        variant: "destructive",
      });
    }
  };

  const handleBatchGenerate = async () => {
    if (batchCount < 1 || batchCount > 100) {
      toast({
        title: "Invalid Count",
        description: "Please enter a number between 1 and 100.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    clearBatchSecrets();
    setSelectedBatchSecrets(new Set());
    setGeneratedSecret(''); // Clear single secret when generating batch

    try {
      const secrets = [];
      for (let i = 0; i < batchCount; i++) {
        const secret = await generateSecret(config);
        const strengthResult = calculatePasswordStrength(secret);
        
        secrets.push({
          id: crypto.randomUUID(),
          secret,
          algorithm,
          timestamp: Date.now(),
        });

        // Auto-save each to history
        addToHistory(secret, algorithm, {
          score: strengthResult.score,
          strength: strengthResult.strength,
          entropy: strengthResult.entropy,
        });
      }

      setBatchSecrets(secrets);
      toast({
        title: "Batch Generated!",
        description: `Successfully generated ${batchCount} secret(s).`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate batch secrets. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleToggleBatchSelect = (id: string) => {
    setSelectedBatchSecrets((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleSelectAllBatch = () => {
    if (selectedBatchSecrets.size === batchSecrets.length) {
      setSelectedBatchSecrets(new Set());
    } else {
      setSelectedBatchSecrets(new Set(batchSecrets.map((item) => item.id)));
    }
  };

  const handleCopyBatchSelected = async () => {
    const secretsToCopy = selectedBatchSecrets.size > 0
      ? batchSecrets.filter((item) => selectedBatchSecrets.has(item.id)).map((item) => item.secret)
      : batchSecrets.map((item) => item.secret);

    if (secretsToCopy.length === 0) {
      toast({
        title: "No Secrets",
        description: "No secrets to copy.",
        variant: "destructive",
      });
      return;
    }

    try {
      await copyMultipleSecrets(secretsToCopy);
      toast({
        title: "Copied!",
        description: `${secretsToCopy.length} secret(s) copied to clipboard.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy secrets.",
        variant: "destructive",
      });
    }
  };

  const handleExportBatch = (format: 'txt' | 'json') => {
    const secretsToExport = selectedBatchSecrets.size > 0
      ? batchSecrets.filter((item) => selectedBatchSecrets.has(item.id))
      : batchSecrets;

    if (secretsToExport.length === 0) {
      toast({
        title: "No Secrets",
        description: "No secrets to export.",
        variant: "destructive",
      });
      return;
    }

    exportBatchSecrets(secretsToExport, { format, includeMetadata: true });
    toast({
      title: "Exported!",
      description: `${secretsToExport.length} secret(s) exported as ${format.toUpperCase()}.`,
    });
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="border-2 shadow-lg">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Secret Generator
              </CardTitle>
              <CardDescription className="text-sm sm:text-base mt-1">
                Generate secure secrets using various cryptographic algorithms
              </CardDescription>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <SecretHistory />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Algorithm Selection */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <Label htmlFor="algorithm" className="text-sm sm:text-base font-semibold">
                Select Algorithm
              </Label>
              <Badge variant={algorithmBadges[algorithm].variant} className="gap-1">
                {algorithmIcons[algorithm]}
                {algorithmBadges[algorithm].label}
              </Badge>
            </div>
            <Select value={algorithm} onValueChange={(value) => setAlgorithm(value)}>
              <SelectTrigger id="algorithm" className="h-12 text-base">
                <div className="flex items-center gap-2">
                  {algorithmIcons[algorithm]}
                  <span>{algorithmNames[algorithm]}</span>
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="alphanumeric">
                  <div className="flex items-center gap-2 whitespace-nowrap">
                    <Key className="h-4 w-4" />
                    <span>Alphanumeric</span>
                  </div>
                </SelectItem>
                <SelectItem value="with-symbols">
                  <div className="flex items-center gap-2 whitespace-nowrap">
                    <Lock className="h-4 w-4" />
                    <span>With Symbols</span>
                  </div>
                </SelectItem>
                <SelectItem value="hexadecimal">
                  <div className="flex items-center gap-2 whitespace-nowrap">
                    <Hash className="h-4 w-4" />
                    <span>Hexadecimal</span>
                  </div>
                </SelectItem>
                <SelectItem value="base64">
                  <div className="flex items-center gap-2 whitespace-nowrap">
                    <Code className="h-4 w-4" />
                    <span>Base64</span>
                  </div>
                </SelectItem>
                <SelectItem value="uuid">
                  <div className="flex items-center gap-2 whitespace-nowrap">
                    <Fingerprint className="h-4 w-4" />
                    <span>UUID v4</span>
                  </div>
                </SelectItem>
                <SelectItem value="secure-random">
                  <div className="flex items-center gap-2 whitespace-nowrap">
                    <Shield className="h-4 w-4" />
                    <span>Secure Random</span>
                  </div>
                </SelectItem>
                <SelectItem value="api-key">
                  <div className="flex items-center gap-2 whitespace-nowrap">
                    <Link className="h-4 w-4" />
                    <span>API Key</span>
                  </div>
                </SelectItem>
                <SelectItem value="numeric-pin">
                  <div className="flex items-center gap-2 whitespace-nowrap">
                    <CreditCard className="h-4 w-4" />
                    <span>Numeric PIN</span>
                  </div>
                </SelectItem>
                <SelectItem value="password">
                  <div className="flex items-center gap-2 whitespace-nowrap">
                    <FileKey className="h-4 w-4" />
                    <span>Password</span>
                  </div>
                </SelectItem>
                <SelectItem value="binary-key">
                  <div className="flex items-center gap-2 whitespace-nowrap">
                    <Binary className="h-4 w-4" />
                    <span>Binary Key</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            <div className="p-3 rounded-lg bg-muted/50 border border-border/50">
              <p className="text-sm text-muted-foreground leading-relaxed">
                {algorithmDescriptions[algorithm]}
              </p>
            </div>
          </div>

          <Separator />

          {/* Configuration Options */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Label className="text-base font-semibold">Configuration</Label>
            </div>
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="basic">Basic Settings</TabsTrigger>
                <TabsTrigger value="advanced">Advanced Options</TabsTrigger>
              </TabsList>
              
              <TabsContent value="basic" className="space-y-4 mt-4">
              {algorithm !== "uuid" && algorithm !== "api-key" && algorithm !== "password" && (
                <div className="space-y-2">
                  <Label htmlFor="length" className="text-sm font-medium">
                    Length {algorithm === "binary-key" ? "(bytes)" : "(characters)"}
                  </Label>
                  <Input
                    id="length"
                    type="number"
                    min={1}
                    max={1000}
                    value={algorithm === "binary-key" ? bytes : length}
                    onChange={(e) => {
                      const value = parseInt(e.target.value) || 1;
                      if (algorithm === "binary-key") {
                        setBytes(value);
                      } else {
                        setLength(value);
                      }
                    }}
                    className="h-11 text-base focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>
              )}

              {algorithm === "with-symbols" && (
                <div className="flex items-center space-x-3 p-4 rounded-lg bg-muted/30 border border-border/50">
                  <Checkbox
                    id="include-symbols"
                    checked={includeSymbols}
                    onCheckedChange={(checked) => setIncludeSymbols(checked === true)}
                    className="h-5 w-5"
                  />
                  <Label htmlFor="include-symbols" className="cursor-pointer text-sm font-medium">
                    Include special characters (!@#$%^&*...)
                  </Label>
                </div>
              )}

              {algorithm === "api-key" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="segments" className="text-sm font-medium">Segments</Label>
                    <Input
                      id="segments"
                      type="number"
                      min={1}
                      max={10}
                      value={segments}
                      onChange={(e) => setSegments(parseInt(e.target.value) || 1)}
                      className="h-11 text-base focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="segment-length" className="text-sm font-medium">Segment Length</Label>
                    <Input
                      id="segment-length"
                      type="number"
                      min={1}
                      max={20}
                      value={segmentLength}
                      onChange={(e) => setSegmentLength(parseInt(e.target.value) || 1)}
                      className="h-11 text-base focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                  </div>
                </div>
              )}

              {algorithm === "numeric-pin" && (
                <div className="space-y-2">
                  <Label htmlFor="pin-length" className="text-sm font-medium">PIN Length</Label>
                  <Input
                    id="pin-length"
                    type="number"
                    min={4}
                    max={16}
                    value={length}
                    onChange={(e) => setLength(parseInt(e.target.value) || 4)}
                    className="h-11 text-base focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>
              )}
            </TabsContent>

            <TabsContent value="advanced" className="space-y-4">
              {algorithm === "password" && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="password-length" className="text-sm font-medium">Password Length</Label>
                    <Input
                      id="password-length"
                      type="number"
                      min={8}
                      max={128}
                      value={length}
                      onChange={(e) => setLength(parseInt(e.target.value) || 8)}
                      className="h-11 text-base focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                  </div>
                  <div className="space-y-3 p-4 rounded-lg bg-muted/30 border border-border/50">
                    <Label className="text-sm font-semibold">Character Requirements</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                      <div className="flex items-center space-x-3 p-2 rounded-md hover:bg-muted/50 transition-colors">
                        <Checkbox
                          id="pw-uppercase"
                          checked={passwordOptions.includeUppercase}
                          onCheckedChange={(checked) =>
                            setPasswordOptions({ includeUppercase: !!checked })
                          }
                          className="h-5 w-5"
                        />
                        <Label htmlFor="pw-uppercase" className="cursor-pointer text-sm font-medium">
                          Include Uppercase (A-Z)
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3 p-2 rounded-md hover:bg-muted/50 transition-colors">
                        <Checkbox
                          id="pw-lowercase"
                          checked={passwordOptions.includeLowercase}
                          onCheckedChange={(checked) =>
                            setPasswordOptions({ includeLowercase: !!checked })
                          }
                          className="h-5 w-5"
                        />
                        <Label htmlFor="pw-lowercase" className="cursor-pointer text-sm font-medium">
                          Include Lowercase (a-z)
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3 p-2 rounded-md hover:bg-muted/50 transition-colors">
                        <Checkbox
                          id="pw-numbers"
                          checked={passwordOptions.includeNumbers}
                          onCheckedChange={(checked) =>
                            setPasswordOptions({ includeNumbers: !!checked })
                          }
                          className="h-5 w-5"
                        />
                        <Label htmlFor="pw-numbers" className="cursor-pointer text-sm font-medium">
                          Include Numbers (0-9)
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3 p-2 rounded-md hover:bg-muted/50 transition-colors">
                        <Checkbox
                          id="pw-symbols"
                          checked={passwordOptions.includeSymbols}
                          onCheckedChange={(checked) =>
                            setPasswordOptions({ includeSymbols: !!checked })
                          }
                          className="h-5 w-5"
                        />
                        <Label htmlFor="pw-symbols" className="cursor-pointer text-sm font-medium">
                          Include Symbols (!@#$%...)
                        </Label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {algorithm === "alphanumeric" && (
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
                    <Label className="text-sm font-semibold mb-3 block">Character Set Options</Label>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <p>This algorithm uses uppercase letters (A-Z), lowercase letters (a-z), and numbers (0-9).</p>
                      <p className="text-xs">Total character set: 62 characters</p>
                    </div>
                  </div>
                </div>
              )}

              {algorithm === "hexadecimal" && (
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
                    <Label className="text-sm font-semibold mb-3 block">Character Set Info</Label>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <p>Hexadecimal uses characters 0-9 and a-f (lowercase).</p>
                      <p className="text-xs">Total character set: 16 characters</p>
                      <p className="text-xs">Commonly used for: API keys, tokens, hash representations</p>
                    </div>
                  </div>
                </div>
              )}

              {algorithm === "base64" && (
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
                    <Label className="text-sm font-semibold mb-3 block">Character Set Info</Label>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <p>Base64-like character set includes A-Z, a-z, 0-9, +, and /.</p>
                      <p className="text-xs">Total character set: 64 characters</p>
                      <p className="text-xs">Commonly used for: Encoding binary data, URLs, tokens</p>
                    </div>
                  </div>
                </div>
              )}

              {algorithm === "uuid" && (
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
                    <Label className="text-sm font-semibold mb-3 block">UUID v4 Information</Label>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <p>UUID v4 is a standard 128-bit identifier with fixed format.</p>
                      <p className="text-xs">Format: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx</p>
                      <p className="text-xs">Length: Fixed at 36 characters (32 hex + 4 hyphens)</p>
                      <p className="text-xs">Commonly used for: Database IDs, distributed systems, unique identifiers</p>
                    </div>
                  </div>
                </div>
              )}

              {algorithm === "secure-random" && (
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
                    <Label className="text-sm font-semibold mb-3 block">Security Information</Label>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <p>Uses Web Crypto API for cryptographically secure random generation.</p>
                      <p className="text-xs">Maximum security: Uses browser&apos;s secure random number generator</p>
                      <p className="text-xs">Output: Base64-encoded binary data (URL-safe)</p>
                      <p className="text-xs">Recommended for: High-security applications, encryption keys</p>
                    </div>
                  </div>
                </div>
              )}

              {algorithm === "api-key" && (
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
                    <Label className="text-sm font-semibold mb-3 block">API Key Format</Label>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <p>Format: Segments separated by hyphens (e.g., xxxx-xxxx-xxxx-xxxx)</p>
                      <p className="text-xs">Each segment uses alphanumeric characters (A-Z, a-z, 0-9)</p>
                      <p className="text-xs">Customize segments and segment length in Basic Settings</p>
                    </div>
                  </div>
                </div>
              )}

              {algorithm === "numeric-pin" && (
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
                    <Label className="text-sm font-semibold mb-3 block">PIN Information</Label>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <p>Numeric PIN uses digits 0-9 only.</p>
                      <p className="text-xs">Recommended length: 4-8 digits for security</p>
                      <p className="text-xs">Commonly used for: Access codes, verification codes, short passwords</p>
                    </div>
                  </div>
                </div>
              )}

              {algorithm === "with-symbols" && (
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
                    <Label className="text-sm font-semibold mb-3 block">Character Set Options</Label>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <p>Includes uppercase, lowercase, numbers, and special characters.</p>
                      <p className="text-xs">Special characters: !@#$%^&*()_+-=[]{}|;:,.&lt;&gt;?</p>
                      <p className="text-xs">Toggle symbol inclusion in Basic Settings</p>
                    </div>
                  </div>
                </div>
              )}

              {algorithm === "binary-key" && (
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
                    <Label className="text-sm font-semibold mb-3 block">Binary Key Information</Label>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <p>Generates binary data displayed as hexadecimal string.</p>
                      <p className="text-xs">Output format: Hexadecimal (0-9, a-f)</p>
                      <p className="text-xs">Each byte is represented as 2 hex characters</p>
                      <p className="text-xs">Commonly used for: Encryption keys, cryptographic operations</p>
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
          </div>

          <Separator />

          {/* Custom Character Set */}
          <CustomCharacterSet
            value={customCharacterSet}
            onChange={setCustomCharacterSet}
            excludeSimilar={excludeSimilarCharacters}
            onExcludeSimilarChange={setExcludeSimilarCharacters}
            useCustom={useCustomCharacterSet}
            onUseCustomChange={setUseCustomCharacterSet}
          />

          <Separator />

          {/* Batch Generation Section */}
          <div className="space-y-4 p-4 rounded-lg bg-muted/30 border border-border/50">
            <div className="flex items-center gap-2 mb-3">
              <Layers className="h-5 w-5 text-primary" />
              <Label className="text-base font-semibold">Batch Generation</Label>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="batch-count" className="text-sm font-medium">
                  Number of Secrets (1-100)
                </Label>
                <Input
                  id="batch-count"
                  type="number"
                  min={1}
                  max={100}
                  value={batchCount}
                  onChange={(e) => {
                    const value = parseInt(e.target.value) || 1;
                    setBatchCount(Math.min(Math.max(value, 1), 100));
                  }}
                  className="h-11 text-base focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>
              <div className="flex items-end">
                <Button
                  onClick={handleBatchGenerate}
                  disabled={isGenerating}
                  variant="outline"
                  className="w-full h-11 gap-2"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Layers className="h-4 w-4" />
                      Generate Batch
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>

          <Separator />

          {/* Generate Button */}
          <div className="space-y-2">
            <Button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full h-12 text-base font-semibold bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl transition-all duration-200"
              size="lg"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="mr-2 h-5 w-5 animate-spin" />
                  Generating Secret...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />
                  Generate Single Secret
                </>
              )}
            </Button>
          </div>

          {/* Generated Secret Display */}
          <AnimatePresence>
            {generatedSecret && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -20 }}
                transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
              >
                <Card className="border-2 border-primary/20 shadow-xl bg-gradient-to-br from-card to-card/50">
              <CardHeader className="pb-3">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-md bg-primary/10">
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-lg sm:text-xl font-bold">Generated Secret</CardTitle>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => exportSecret(generatedSecret, algorithm, { format: 'txt' })}
                      className="gap-2 flex-1 sm:flex-initial"
                      title="Download as TXT"
                    >
                      <Download className="h-4 w-4" />
                      TXT
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => exportSecret(generatedSecret, algorithm, { format: 'json' })}
                      className="gap-2 flex-1 sm:flex-initial"
                      title="Download as JSON"
                    >
                      <Download className="h-4 w-4" />
                      JSON
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      onClick={handleCopy}
                      className="gap-2 shadow-md hover:shadow-lg transition-shadow flex-1 sm:flex-initial"
                    >
                      <Copy className="h-4 w-4" />
                      Copy
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="relative group">
                  <div className="p-3 sm:p-5 bg-background/80 backdrop-blur-sm rounded-lg border-2 border-border/50 break-all font-mono text-xs sm:text-sm leading-relaxed shadow-inner hover:border-primary/30 transition-colors">
                    {generatedSecret}
                  </div>
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Badge variant="secondary" className="text-xs">
                      {generatedSecret.length} chars
                    </Badge>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-muted-foreground">
                  <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                    <span className="flex items-center gap-1">
                      <Shield className="h-3 w-3" />
                      Secure
                    </span>
                    <span>Length: {generatedSecret.length} characters</span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {algorithm}
                  </Badge>
                </div>

                {/* Password Strength Indicator - Shows for all generated secrets */}
                {generatedSecret && (
                  <div className="pt-3 border-t border-border/50">
                    <PasswordStrengthIndicator password={generatedSecret} algorithm={algorithm} />
                  </div>
                )}

                {/* QR Code Display */}
                {generatedSecret && (
                  <div className="pt-3 border-t border-border/50">
                    <QRCodeDisplay
                      value={generatedSecret}
                      title="Secret QR Code"
                      size={200}
                      showDownload={true}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Batch Secrets Display */}
          <AnimatePresence>
            {batchSecrets.length > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -20 }}
                transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
              >
                <Card className="border-2 border-primary/20 shadow-xl bg-gradient-to-br from-card to-card/50">
              <CardHeader className="pb-3">
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-md bg-primary/10">
                      <Layers className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-lg sm:text-xl font-bold">Batch Generated Secrets</CardTitle>
                    <Badge variant="secondary" className="ml-2">
                      {batchSecrets.length}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    {selectedBatchSecrets.size > 0 && (
                      <Badge variant="outline" className="text-xs">
                        {selectedBatchSecrets.size} selected
                      </Badge>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleSelectAllBatch}
                      className="gap-2 text-xs sm:text-sm"
                    >
                      {selectedBatchSecrets.size === batchSecrets.length ? (
                        <>
                          <Square className="h-4 w-4" />
                          <span className="hidden sm:inline">Deselect All</span>
                          <span className="sm:hidden">Deselect</span>
                        </>
                      ) : (
                        <>
                          <CheckSquare className="h-4 w-4" />
                          <span className="hidden sm:inline">Select All</span>
                          <span className="sm:hidden">Select</span>
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCopyBatchSelected}
                      className="gap-2 text-xs sm:text-sm"
                    >
                      <Copy className="h-4 w-4" />
                      <span className="hidden sm:inline">Copy {selectedBatchSecrets.size > 0 ? `Selected (${selectedBatchSecrets.size})` : 'All'}</span>
                      <span className="sm:hidden">Copy</span>
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="gap-2">
                          <Download className="h-4 w-4" />
                          <span className="hidden sm:inline">Export</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleExportBatch('txt')}>
                          <Download className="mr-2 h-4 w-4" />
                          Export as TXT
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleExportBatch('json')}>
                          <Download className="mr-2 h-4 w-4" />
                          Export as JSON
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        clearBatchSecrets();
                        setSelectedBatchSecrets(new Set());
                      }}
                      className="gap-2"
                    >
                      Clear
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="max-h-96 overflow-y-auto space-y-2 pr-2">
                  {batchSecrets.map((item, index) => {
                    const isSelected = selectedBatchSecrets.has(item.id);
                    return (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        whileHover={{ scale: 1.02, x: 4 }}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          isSelected
                            ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                            : 'border-border/50 bg-background/50 hover:border-primary/30'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={() => handleToggleBatchSelect(item.id)}
                            className="mt-1"
                          />
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center justify-between gap-2">
                              <Badge variant="outline" className="text-xs">
                                #{index + 1}
                              </Badge>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={async () => {
                                  try {
                                    await navigator.clipboard.writeText(item.secret);
                                    toast({
                                      title: "Copied!",
                                      description: "Secret copied to clipboard.",
                                    });
                                  } catch (error) {
                                    toast({
                                      title: "Error",
                                      description: "Failed to copy.",
                                      variant: "destructive",
                                    });
                                  }
                                }}
                                className="h-7 px-2 gap-1 flex-shrink-0"
                              >
                                <Copy className="h-3 w-3" />
                                <span className="hidden sm:inline">Copy</span>
                              </Button>
                            </div>
                            <div className="p-2 bg-muted/50 rounded-md break-all font-mono text-xs sm:text-sm">
                              {item.secret}
                            </div>
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1 text-xs text-muted-foreground">
                              <span>Length: {item.secret.length} chars</span>
                              <span>{new Date(item.timestamp).toLocaleTimeString()}</span>
                            </div>
                            {/* QR Code for each batch secret */}
                            <div className="pt-2 border-t border-border/30">
                              <QRCodeDisplay
                                value={item.secret}
                                title={`QR Code #${index + 1}`}
                                size={150}
                                showDownload={true}
                                className="border-0 shadow-none"
                              />
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
      </motion.div>
    </div>
  );
}

