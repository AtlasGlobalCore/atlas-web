"use client";

import { Shield, Globe, Building2, FileCheck, Mail, Phone, Send } from "lucide-react";
import { useAtlasStore, type LegalTab } from "@/lib/store";

export function Footer() {
  const { navigateToLegal } = useAtlasStore();

  return (
    <footer className="bg-[#0A0A0A] border-t border-[rgba(255,255,255,0.06)]">
      {/* ── EI France Compliance Bar ─────────────────────────────── */}
      <div className="border-b border-[rgba(255,255,255,0.04)]">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Building2 className="w-4 h-4 text-[#00FF41]/70" />
              <div>
                <p className="text-[10px] font-mono-data text-[#C0C0C0]/50 leading-relaxed">
                  <span className="text-[#C0C0C0]/70 font-bold">Operated by:</span> Sergio Monteiro (EI) in cooperation with IAHUB360 LTD
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 flex-wrap">
              <span className="text-[9px] font-mono-data text-[#6B7280] tracking-wider">
                SIREN 790 155 006
              </span>
              <span className="text-[#C0C0C0]/15">|</span>
              <span className="text-[9px] font-mono-data text-[#6B7280] tracking-wider">
                SIRET 79015500600014
              </span>
              <span className="text-[#C0C0C0]/15">|</span>
              <span className="text-[9px] font-mono-data text-[#6B7280] tracking-wider">
                Established 2013 (France)
              </span>
              <span className="text-[#C0C0C0]/15">|</span>
              <span className="text-[9px] font-mono-data text-[#6B7280] tracking-wider">
                Jurisdiction: EU / UK / BR
              </span>
            </div>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <FileCheck className="w-3 h-3 text-[#FFB800]/60" />
            <p className="text-[9px] font-mono-data text-[#6B7280] tracking-wider">
              Technical Service Provider (TSP) — Not a Financial Institution. All payment processing conducted through licensed financial institutions.
            </p>
          </div>
        </div>
      </div>

      {/* ── Main Footer Content ──────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-[#00FF41] rounded-sm flex items-center justify-center">
                <Shield className="w-3.5 h-3.5 text-[#050505]" />
              </div>
              <span className="font-mono-data text-[10px] tracking-[0.2em] text-[#00FF41] glow-green">
                ATLAS GLOBAL CORE v2.1
              </span>
            </div>
            <p className="text-xs text-[#C0C0C0]/60 leading-relaxed max-w-xs">
              High-availability B2B commerce infrastructure. Payment orchestration, CRM, and SaaS marketplace management fused into a single indestructible core.
            </p>
            <div className="flex items-center gap-2 mt-2">
              <Globe className="w-3 h-3 text-[#00F0FF]/60" />
              <span className="text-[9px] font-mono-data text-[#00F0FF]/60 tracking-wider">
                MULTI-REGION: EU &middot; UK &middot; BR
              </span>
            </div>
          </div>

          {/* Navigation & Legal */}
          <div className="space-y-3">
            <h4 className="font-mono-data text-[10px] tracking-[0.15em] text-[#00F0FF] uppercase mb-3">Navigation</h4>
            <div className="grid grid-cols-1 gap-2">
              <button onClick={() => navigateToLegal('terms-of-service')} className="text-xs text-[#C0C0C0]/60 hover:text-[#00FF41] transition-colors text-left">Terms of Service</button>
              <button onClick={() => navigateToLegal('privacy-policy')} className="text-xs text-[#C0C0C0]/60 hover:text-[#00FF41] transition-colors text-left">Privacy Policy</button>
              <button onClick={() => navigateToLegal('compliance-manifesto')} className="text-xs text-[#C0C0C0]/60 hover:text-[#00FF41] transition-colors text-left">Compliance Manifesto</button>
              <button onClick={() => navigateToLegal('refund-policy')} className="text-xs text-[#C0C0C0]/60 hover:text-[#00FF41] transition-colors text-left">Refund Policy</button>
              <button onClick={() => navigateToLegal('structure')} className="text-xs text-[#C0C0C0]/60 hover:text-[#00FF41] transition-colors text-left">Legal Hub (Full)</button>
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-3">
            <h4 className="font-mono-data text-[10px] tracking-[0.15em] text-[#00F0FF] uppercase mb-3">Contact</h4>
            <div className="space-y-2">
              <a href="mailto:support@atlasglobal.digital" className="flex items-center gap-2 text-xs text-[#C0C0C0]/60 hover:text-[#00FF41] transition-colors">
                <Mail className="w-3 h-3 text-[#00FF41]/60 shrink-0" />
                <span>support@atlasglobal.digital</span>
              </a>
              <a href="https://t.me/AtlasCore_Support" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs text-[#C0C0C0]/60 hover:text-[#00F0FF] transition-colors">
                <Send className="w-3 h-3 text-[#00F0FF]/60 shrink-0" />
                <span>@AtlasCore_Support</span>
              </a>
              <a href="tel:+447451221030" className="flex items-center gap-2 text-xs text-[#C0C0C0]/60 hover:text-[#FFB800] transition-colors">
                <Phone className="w-3 h-3 text-[#FFB800]/60 shrink-0" />
                <span>+44 7451 221030</span>
              </a>
            </div>
          </div>

          {/* Compliance Notice */}
          <div className="space-y-3">
            <h4 className="font-mono-data text-[10px] tracking-[0.15em] text-[#00F0FF] uppercase mb-3">Compliance</h4>
            <p className="text-[11px] text-[#C0C0C0]/50 leading-relaxed">
              Compatible with Tier-1 Financial Standards. Atlas Global Core operates as a Technical Service Provider (TSP). We are not a bank. All payment processing is conducted through licensed financial institutions.
            </p>
            <div className="flex items-center gap-3 mt-3 flex-wrap">
              {["Stripe", "Adyen", "Mollie", "Stark Bank", "PCI-DSS", "ISO 27001"].map((name) => (
                <span key={name} className="text-[9px] font-mono-data px-2 py-0.5 bg-[#111111] border border-[rgba(255,255,255,0.04)] rounded text-[#C0C0C0]/40">
                  {name}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-4 border-t border-[rgba(255,255,255,0.04)] flex flex-col md:flex-row justify-between items-center gap-2">
          <p className="text-[10px] font-mono-data text-[#C0C0C0]/30">
            &copy; {new Date().getFullYear()} Atlas Global Core&trade;. All rights reserved. Operated by Sergio Monteiro (EI) in cooperation with IAHUB360 LTD — SIREN 790 155 006 — Est. 2013, France.
          </p>
          <p className="text-[10px] font-mono-data text-[#C0C0C0]/20">
            SYS_BUILD::2.1.0 | NODE::MULTI-REGION | UPTIME::99.97%
          </p>
        </div>
      </div>
    </footer>
  );
}
