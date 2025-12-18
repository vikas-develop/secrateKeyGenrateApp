"use client";

import { useState, useRef, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, QrCode } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface QRCodeDisplayProps {
  value: string;
  title?: string;
  size?: number;
  showDownload?: boolean;
  className?: string;
}

export function QRCodeDisplay({
  value,
  title = "QR Code",
  size = 200,
  showDownload = true,
  className = "",
}: QRCodeDisplayProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [responsiveSize, setResponsiveSize] = useState(size);
  const qrRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    const updateSize = () => {
      if (window.innerWidth < 640) {
        setResponsiveSize(Math.min(size, 200));
      } else {
        setResponsiveSize(size);
      }
    };
    
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, [size]);

  const handleDownload = async () => {
    if (!qrRef.current) return;

    setIsDownloading(true);
    try {
      const svg = qrRef.current.querySelector("svg");
      if (!svg) {
        throw new Error("SVG not found");
      }

      // Clone the SVG to avoid modifying the original
      const clonedSvg = svg.cloneNode(true) as SVGElement;
      
      // Set background to white
      const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      rect.setAttribute("width", "100%");
      rect.setAttribute("height", "100%");
      rect.setAttribute("fill", "white");
      clonedSvg.insertBefore(rect, clonedSvg.firstChild);

      // Convert SVG to data URL
      const svgData = new XMLSerializer().serializeToString(clonedSvg);
      const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
      const svgUrl = URL.createObjectURL(svgBlob);

      // Create canvas to convert SVG to PNG
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = size + 40; // Add padding
        canvas.height = size + 40;
        const ctx = canvas.getContext("2d");
        
        if (ctx) {
          // White background
          ctx.fillStyle = "white";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          
          // Draw QR code
          ctx.drawImage(img, 20, 20, size, size);
          
          // Convert to blob and download
          canvas.toBlob((blob) => {
            if (blob) {
              const url = URL.createObjectURL(blob);
              const link = document.createElement("a");
              link.href = url;
              link.download = `qr-code-${Date.now()}.png`;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              URL.revokeObjectURL(url);
              URL.revokeObjectURL(svgUrl);
              
              toast({
                title: "Downloaded!",
                description: "QR code has been downloaded.",
              });
            }
          }, "image/png");
        }
      };
      
      img.src = svgUrl;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to download QR code.",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  if (!value) {
    return null;
  }

  return (
    <Card className={`border ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <QrCode className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            <CardTitle className="text-base sm:text-lg font-semibold">{title}</CardTitle>
          </div>
          {showDownload && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
              disabled={isDownloading}
              className="gap-2 w-full sm:w-auto"
            >
              <Download className="h-4 w-4" />
              {isDownloading ? "Downloading..." : "Download"}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center gap-4">
          <div
            ref={qrRef}
            className="p-3 sm:p-4 bg-white rounded-lg border-2 border-border/50 shadow-sm"
          >
            <QRCodeSVG
              value={value}
              size={responsiveSize}
              level="H" // High error correction
              includeMargin={true}
              bgColor="#ffffff"
              fgColor="#000000"
            />
          </div>
          <p className="text-xs text-muted-foreground text-center max-w-xs px-2">
            Scan this QR code with your mobile device to quickly transfer the secret
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

