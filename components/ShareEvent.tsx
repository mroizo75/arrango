"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Share2, Check, Copy, Mail } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface ShareEventProps {
  eventName: string;
  eventUrl: string;
  eventDescription?: string;
  variant?: "default" | "outline" | "secondary";
  size?: "default" | "sm" | "lg";
  className?: string;
}

export function ShareEvent({
  eventName,
  eventUrl,
  eventDescription = "",
  variant = "outline",
  size = "default",
  className = ""
}: ShareEventProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(eventUrl);
      setCopied(true);
      toast({
        title: "Lenke kopiert til utklippstavlen!",
        description: "Lim lenken inn i det sosiale mediet du vil dele til.",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({
        title: "Kunne ikke kopiere lenke",
        variant: "destructive",
      });
    }
  };


 

  const shareToFacebook = () => {
    // Legg til timestamp og cache-buster for å unngå caching av metadata
    const shareUrl = `${eventUrl}?fb_refresh=${Date.now()}&utm_source=facebook&utm_medium=social`;
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(`${eventName} - ${eventDescription}`)}`;
    try {
      const popup = window.open(url, 'facebook-share', 'width=600,height=400,scrollbars=yes,resizable=yes');
      if (!popup || popup.closed) {
        handleCopyLink();
        toast({
          title: "Facebook-deling blokkert",
          description: "Lenken er kopiert. Lim den inn i Facebook for å dele med bilde.",
        });
      } else {
        toast({
          title: "Facebook-deling åpnet",
          description: "Bildet vil vises når du deler lenken.",
        });
      }
    } catch {
      handleCopyLink();
      toast({
        title: "Deling feilet",
        description: "Lenken er kopiert. Lim den inn i Facebook for å dele med bilde.",
        variant: "destructive",
      });
    }
  };

  const shareToX = () => {
    const text = `Sjekk ut ${eventName}! ${eventDescription}`;
    const shareUrl = `${eventUrl}?x_refresh=${Date.now()}&utm_source=twitter&utm_medium=social`;
    const url = `https://x.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`;
    try {
      const popup = window.open(url, 'X-share', 'width=600,height=400,scrollbars=yes,resizable=yes');
      if (!popup || popup.closed) {
        handleCopyLink();
        toast({
          title: "X-deling blokkert",
          description: "Lenken er kopiert. Lim den inn i X for å dele med bilde.",
        });
      } else {
        toast({
          title: "X-deling åpnet",
          description: "Bildet vil vises i tweeten.",
        });
      }
    } catch {
      handleCopyLink();
      toast({
        title: "Deling feilet",
        description: "Lenken er kopiert. Lim den inn i X for å dele med bilde.",
        variant: "destructive",
      });
    }
  };

  const shareToLinkedIn = () => {
    const shareUrl = `${eventUrl}?li_refresh=${Date.now()}&utm_source=linkedin&utm_medium=social`;
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(eventName)}&summary=${encodeURIComponent(eventDescription)}`;
    try {
      const popup = window.open(url, 'linkedin-share', 'width=600,height=400,scrollbars=yes,resizable=yes');
      if (!popup || popup.closed) {
        handleCopyLink();
        toast({
          title: "LinkedIn-deling blokkert",
          description: "Lenken er kopiert. Lim den inn i LinkedIn for å dele med bilde.",
        });
      } else {
        toast({
          title: "LinkedIn-deling åpnet",
          description: "Bildet vil vises når du deler lenken.",
        });
      }
    } catch {
      handleCopyLink();
      toast({
        title: "Deling feilet",
        description: "Lenken er kopiert. Lim den inn i LinkedIn for å dele med bilde.",
        variant: "destructive",
      });
    }
  };

  const shareToWhatsApp = () => {
    const text = `Sjekk ut ${eventName}: ${eventUrl}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const shareByEmail = () => {
    const subject = encodeURIComponent(`Sjekk ut arrangementet: ${eventName}`);
    const body = encodeURIComponent(`${eventDescription}\n\n${eventUrl}`);
    window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={variant}
          size={size}
          className={`flex items-center gap-2 ${className}`}
        >
          <Share2 className="w-4 h-4" />
          Del arrangement
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Del arrangement</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleCopyLink}>
          {copied ? (
            <>
              <Check className="mr-2 h-4 w-4 text-green-600" />
              <span>Kopiert!</span>
            </>
          ) : (
            <>
              <Copy className="mr-2 h-4 w-4" />
              <span>Kopier lenke</span>
            </>
          )}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={shareToFacebook}>
          <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
          <span>Facebook</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={shareToX}>
          <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
          </svg>
          <span>X</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={shareToLinkedIn}>
          <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
          </svg>
          <span>LinkedIn</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={shareToWhatsApp}>
          <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.867 9.867 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
          </svg>
          <span>WhatsApp</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={shareByEmail}>
          <Mail className="mr-2 h-4 w-4" />
          <span>Send på e-post</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
