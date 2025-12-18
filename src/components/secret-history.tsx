"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useSecretStore, type SavedSecret } from "@/store/secret-store";
import { useToast } from "@/hooks/use-toast";
import { History, Trash2, Copy, Eye, EyeOff, Shield, RefreshCw, Download, CheckSquare, Square } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { exportHistory, copyMultipleSecrets } from "@/lib/export-utils";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { QRCodeDisplay } from "@/components/qr-code-display";

export function SecretHistory() {
  // Zustand store
  const history = useSecretStore((state) => state.history);
  const removeFromHistory = useSecretStore((state) => state.removeFromHistory);
  const clearHistory = useSecretStore((state) => state.clearHistory);
  const { toast } = useToast();
  const [visibleSecrets, setVisibleSecrets] = useState<Set<string>>(new Set());
  const [selectedSecrets, setSelectedSecrets] = useState<Set<string>>(new Set());
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Ensure component is mounted (client-side only)
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Zustand automatically syncs with localStorage, no manual refresh needed

  const handleCopy = async (secret: string) => {
    try {
      await navigator.clipboard.writeText(secret);
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

  const handleDelete = (id: string) => {
    removeFromHistory(id);
    toast({
      title: "Deleted",
      description: "Secret has been removed from history.",
    });
  };

  const handleClearAll = () => {
    clearHistory();
    setSelectedSecrets(new Set());
    toast({
      title: "History Cleared",
      description: "All saved secrets have been removed.",
    });
  };

  const handleToggleSelect = (id: string) => {
    setSelectedSecrets((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    if (selectedSecrets.size === history.length) {
      setSelectedSecrets(new Set());
    } else {
      setSelectedSecrets(new Set(history.map((item) => item.id)));
    }
  };

  const handleCopySelected = async () => {
    if (selectedSecrets.size === 0) {
      toast({
        title: "No Selection",
        description: "Please select secrets to copy.",
        variant: "destructive",
      });
      return;
    }

    const selectedItems = history.filter((item) => selectedSecrets.has(item.id));
    const secrets = selectedItems.map((item) => item.secret);
    
    try {
      await copyMultipleSecrets(secrets);
      toast({
        title: "Copied!",
        description: `${selectedSecrets.size} secret(s) copied to clipboard.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy secrets.",
        variant: "destructive",
      });
    }
  };

  const handleExportHistory = (format: 'txt' | 'json') => {
    if (history.length === 0) {
      toast({
        title: "No History",
        description: "No secrets to export.",
        variant: "destructive",
      });
      return;
    }

    exportHistory(history, { format, includeMetadata: true });
    toast({
      title: "Exported!",
      description: `History exported as ${format.toUpperCase()}.`,
    });
  };

  const toggleVisibility = (id: string) => {
    setVisibleSecrets((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const maskSecret = (secret: string) => {
    if (secret.length <= 8) {
      return "•".repeat(secret.length);
    }
    const visibleChars = Math.min(4, Math.floor(secret.length * 0.2));
    const masked = "•".repeat(secret.length - visibleChars * 2);
    return secret.substring(0, visibleChars) + masked + secret.substring(secret.length - visibleChars);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <History className="h-4 w-4" />
          History
          {history.length > 0 && (
            <Badge variant="secondary" className="ml-1">
              {history.length}
            </Badge>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col p-0">
        <div className="p-6 pb-4 flex-shrink-0">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <History className="h-5 w-5" />
              Secret History
            </DialogTitle>
            <DialogDescription>
              View and manage your saved secrets. Secrets are stored locally in your browser.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="flex-1 min-h-0 flex flex-col px-6 pb-6">
        {!isMounted ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <History className="h-12 w-12 text-muted-foreground mb-4 opacity-50 animate-pulse" />
            <p className="text-muted-foreground">Loading history...</p>
          </div>
        ) : history.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <History className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
            <p className="text-muted-foreground">No saved secrets yet</p>
            <p className="text-sm text-muted-foreground mt-2">
              Generate a secret and it will be saved here automatically
            </p>
            <div className="space-y-2 mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  // Zustand automatically syncs
                }}
                className="gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Reload from localStorage
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (typeof window !== "undefined") {
                    const stored = localStorage.getItem("secret-generator-history");
                    console.log("Direct localStorage check:", stored);
                    if (stored) {
                      try {
                        const parsed = JSON.parse(stored);
                        console.log("Parsed data:", parsed);
                        console.log("Is array:", Array.isArray(parsed));
                        console.log("Length:", parsed?.length);
                        alert(`Found ${parsed?.length || 0} items in localStorage. Check console for details.`);
                      } catch (e) {
                        console.error("Parse error:", e);
                        alert("Error parsing localStorage data. Check console.");
                      }
                    } else {
                      alert("No data found in localStorage with key 'secret-generator-history'");
                    }
                  }
                }}
                className="gap-2 w-full"
              >
                Debug: Check localStorage
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4 flex-shrink-0">
              <div className="flex items-center gap-3">
                <p className="text-sm text-muted-foreground">
                  {history.length} {history.length === 1 ? "secret" : "secrets"} saved
                </p>
                {selectedSecrets.size > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    {selectedSecrets.size} selected
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2">
                {selectedSecrets.size > 0 && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCopySelected}
                      className="gap-2"
                    >
                      <Copy className="h-4 w-4" />
                      Copy Selected ({selectedSecrets.size})
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleSelectAll}
                      className="gap-2"
                    >
                      {selectedSecrets.size === history.length ? (
                        <>
                          <Square className="h-4 w-4" />
                          Deselect All
                        </>
                      ) : (
                        <>
                          <CheckSquare className="h-4 w-4" />
                          Select All
                        </>
                      )}
                    </Button>
                  </>
                )}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Download className="h-4 w-4" />
                      Export
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleExportHistory('txt')}>
                      <Download className="mr-2 h-4 w-4" />
                      Export as TXT
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleExportHistory('json')}>
                      <Download className="mr-2 h-4 w-4" />
                      Export as JSON
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleClearAll}
                  className="gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Clear All
                </Button>
              </div>
            </div>

            <ScrollArea className="w-full" style={{ height: '500px', maxHeight: 'calc(90vh - 280px)' }}>
              <div className="space-y-3">
                {history.map((item, index) => {
                  const isVisible = visibleSecrets.has(item.id);
                  const displaySecret = isVisible ? item.secret : maskSecret(item.secret);

                  return (
                    <Card key={item.id} className={`border ${selectedSecrets.has(item.id) ? 'ring-2 ring-primary' : ''}`}>
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-start gap-2 flex-1">
                            <Checkbox
                              checked={selectedSecrets.has(item.id)}
                              onCheckedChange={() => handleToggleSelect(item.id)}
                              className="mt-1"
                            />
                            <div className="flex-1 space-y-1">
                              <div className="flex items-center gap-2">
                                <CardTitle className="text-sm font-semibold">
                                  {item.algorithm.charAt(0).toUpperCase() + item.algorithm.slice(1).replace(/-/g, " ")}
                                </CardTitle>
                                {item.strength && (
                                  <Badge
                                    variant="outline"
                                    className={`text-xs ${
                                      item.strength.strength === "weak"
                                        ? "text-red-600"
                                        : item.strength.strength === "medium"
                                        ? "text-yellow-600"
                                        : "text-green-600"
                                    }`}
                                  >
                                    <Shield className="h-3 w-3 mr-1" />
                                    {item.strength.strength}
                                  </Badge>
                                )}
                              </div>
                              <CardDescription className="text-xs">
                                {formatDistanceToNow(new Date(item.timestamp), { addSuffix: true })}
                              </CardDescription>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleVisibility(item.id)}
                              className="h-8 w-8 p-0"
                            >
                              {isVisible ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleCopy(item.secret)}
                              className="h-8 w-8 p-0"
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(item.id)}
                              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0 space-y-3">
                        <div className="p-3 bg-muted rounded-md">
                          <code className="text-sm break-all font-mono">{displaySecret}</code>
                        </div>
                        {item.strength && (
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>Score: {item.strength.score}/100</span>
                            <span>Entropy: {item.strength.entropy} bits</span>
                            <span>Length: {item.secret.length} chars</span>
                          </div>
                        )}
                        {/* QR Code - only show when secret is visible */}
                        {isVisible && (
                          <div className="pt-2 border-t border-border/30">
                            <QRCodeDisplay
                              value={item.secret}
                              title="QR Code"
                              size={150}
                              showDownload={true}
                              className="border-0 shadow-none"
                            />
                          </div>
                        )}
                      </CardContent>
                      {index < history.length - 1 && <Separator className="mt-3" />}
                    </Card>
                  );
                })}
              </div>
            </ScrollArea>
          </>
        )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

