import React, { useState } from 'react';
import { X, Printer, Download, Copy, Check, FileText, Sparkles } from 'lucide-react';
import { FeynmanDeck } from '../types/deck';

interface PrintPdfModalProps {
  isOpen: boolean;
  onClose: () => void;
  deck: FeynmanDeck;
}

export const PrintPdfModal: React.FC<PrintPdfModalProps> = ({
  isOpen,
  onClose,
  deck,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !deck) return null;

  // Direct Browser Print Trigger
  const handleDirectPrint = () => {
    try {
      window.print();
    } catch (e) {
      console.warn('Standard window.print() unavailable:', e);
    }
  };

  // Standalone HTML File Download (Instant PDF export file that opens in browser with 1 click)
  const handleDownloadHtmlDoc = () => {
    const cardsHtml = deck.cards
      .map(
        (c, idx) => `
      <div style="page-break-inside: avoid; break-inside: avoid; margin-bottom: 1.5rem; padding: 1.25rem; border: 1px solid #d1d5db; border-radius: 12px; background: #ffffff;">
        <div style="font-size: 10px; font-weight: 700; font-family: monospace; color: #2563eb; text-transform: uppercase; margin-bottom: 4px;">
          ${c.levelNumber !== undefined ? `LEVEL ${c.levelNumber} · ` : ''}${c.badgeText || 'TRAINING CARD'}
        </div>
        <h2 style="font-size: 18px; font-weight: 800; color: #111827; margin: 0 0 6px 0;">${idx + 1}. ${c.title}</h2>
        ${c.subtitle ? `<p style="font-size: 12px; color: #4b5563; margin: 0 0 10px 0;">${c.subtitle}</p>` : ''}
        <p style="font-size: 13px; color: #1f2937; line-height: 1.5; margin: 0 0 12px 0;">${c.feynmanExplanation}</p>

        ${
          c.criticalRules && c.criticalRules.length > 0
            ? `<div style="margin-top: 10px; padding-top: 10px; border-top: 1px solid #e5e7eb;">
                <div style="font-size: 11px; font-weight: 700; color: #dc2626; text-transform: uppercase; margin-bottom: 6px;">Critical Red Lines:</div>
                <ul style="margin: 0; padding-left: 18px; font-size: 12px; color: #374151;">
                  ${c.criticalRules.map((r) => `<li style="margin-bottom: 4px;"><strong>[${r.type.toUpperCase()}]</strong> ${r.rule} <span style="color: #6b7280;">(Risk: ${r.consequenceOfFailure})</span></li>`).join('')}
                </ul>
              </div>`
            : ''
        }

        ${
          c.steps && c.steps.length > 0
            ? `<div style="margin-top: 10px; padding-top: 10px; border-top: 1px solid #e5e7eb;">
                <div style="font-size: 11px; font-weight: 700; color: #2563eb; text-transform: uppercase; margin-bottom: 6px;">Execution Steps:</div>
                <ol style="margin: 0; padding-left: 18px; font-size: 12px; color: #374151;">
                  ${c.steps.map((s) => `<li style="margin-bottom: 6px;"><strong>${s.title}</strong>: ${s.action} <br/><span style="font-size: 11px; color: #4b5563;"><em>Why: ${s.whyItMatters}</em></span></li>`).join('')}
                </ol>
              </div>`
            : ''
        }

        ${
          c.pitfalls && c.pitfalls.length > 0
            ? `<div style="margin-top: 10px; padding-top: 10px; border-top: 1px solid #e5e7eb;">
                <div style="font-size: 11px; font-weight: 700; color: #7c3aed; text-transform: uppercase; margin-bottom: 6px;">Troubleshooting:</div>
                <ul style="margin: 0; padding-left: 18px; font-size: 12px; color: #374151;">
                  ${c.pitfalls.map((p) => `<li style="margin-bottom: 6px;"><strong>Issue:</strong> ${p.symptomOrMistake} <br/><span style="font-size: 11px; color: #059669;"><strong>Fix:</strong> ${p.immediateFix}</span></li>`).join('')}
                </ul>
              </div>`
            : ''
        }
      </div>
    `
      )
      .join('');

    const docContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${deck.title} - Printable Training Deck</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 24px; max-width: 800px; margin: 0 auto; color: #111; background: #fff; }
    h1 { font-size: 24px; font-weight: 800; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px; margin-bottom: 8px; }
    .summary { font-size: 13px; color: #4b5563; margin-bottom: 20px; line-height: 1.5; font-style: italic; }
    .no-print-bar { background: #000; color: #fff; padding: 12px 18px; border-radius: 12px; font-weight: 600; font-size: 13px; display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
    .btn { background: #fff; color: #000; border: none; padding: 6px 16px; border-radius: 20px; font-weight: 700; font-size: 12px; cursor: pointer; }
    @media print { .no-print-bar { display: none !important; } }
  </style>
</head>
<body>
  <div class="no-print-bar">
    <span>📄 SOP Training Deck Study Guide</span>
    <button class="btn" onclick="window.print()">Save as PDF / Print</button>
  </div>
  <h1>${deck.title}</h1>
  <div class="summary">${deck.summary}</div>
  <div>${cardsHtml}</div>
  <script>
    setTimeout(function() {
      try { window.print(); } catch (e) {}
    }, 400);
  </script>
</body>
</html>`;

    const blob = new Blob([docContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${deck.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-study-guide.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Copy Markdown Study Guide
  const handleCopyMarkdown = () => {
    let md = `# ${deck.title}\n\n`;
    md += `> ${deck.summary}\n\n`;
    deck.cards.forEach((c, idx) => {
      md += `### ${idx + 1}. ${c.title}\n`;
      md += `${c.feynmanExplanation}\n\n`;
      if (c.criticalRules) {
        c.criticalRules.forEach((r) => {
          md += `- **[${r.type.toUpperCase()}]** ${r.rule} *(Risk: ${r.consequenceOfFailure})*\n`;
        });
      }
      if (c.steps) {
        c.steps.forEach((s) => {
          md += `${s.stepNumber}. **${s.title}**: ${s.action} *(Why: ${s.whyItMatters})*\n`;
        });
      }
      md += `\n`;
    });

    navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-2xl animate-in fade-in duration-200">
      <div className="w-full max-w-3xl max-h-[90vh] bg-neutral-950 border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col relative overflow-hidden text-white">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.08] shrink-0 no-print">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Printer className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                Print & Export SOP Study Guide
              </h2>
              <p className="text-xs text-neutral-400">
                {deck.cards.length} cards ready for PDF export
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full text-neutral-400 hover:text-white bg-neutral-900 border border-white/10 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action Buttons Toolbar */}
        <div className="py-4 border-b border-white/[0.08] flex flex-wrap items-center justify-between gap-3 shrink-0 no-print">
          <div className="flex flex-wrap items-center gap-2">
            {/* Primary Print / Save PDF */}
            <button
              type="button"
              onClick={handleDirectPrint}
              className="min-h-[42px] px-5 py-2 bg-white hover:bg-neutral-200 text-black text-xs font-bold rounded-full shadow-lg transition-all active:scale-95 flex items-center gap-2 cursor-pointer"
            >
              <Printer className="w-4 h-4 text-black" />
              <span>Save as PDF / Print</span>
            </button>

            {/* Standalone HTML File Download */}
            <button
              type="button"
              onClick={handleDownloadHtmlDoc}
              className="min-h-[42px] px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white border border-white/15 text-xs font-semibold rounded-full transition-all active:scale-95 flex items-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4 text-blue-400" />
              <span>Download PDF File (.html)</span>
            </button>
          </div>

          {/* Copy Markdown */}
          <button
            type="button"
            onClick={handleCopyMarkdown}
            className="min-h-[42px] px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-white/15 text-xs font-semibold rounded-full transition-all active:scale-95 flex items-center gap-2 cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-300">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy Markdown</span>
              </>
            )}
          </button>
        </div>

        {/* Printable Document Preview Content Area */}
        <div className="flex-1 overflow-y-auto pt-6 space-y-6 pr-2 font-sans selection:bg-neutral-800">
          <div className="p-6 rounded-2xl bg-neutral-900/50 border border-white/10 space-y-3">
            <h1 className="text-2xl font-extrabold text-white">{deck.title}</h1>
            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-normal">
              {deck.summary}
            </p>
          </div>

          <div className="space-y-4">
            {deck.cards.map((c, idx) => (
              <div
                key={c.id}
                className="p-5 rounded-2xl bg-neutral-900/60 border border-white/10 space-y-3 print-card-break"
              >
                <div className="text-[10px] font-bold font-mono tracking-wider text-blue-400 uppercase">
                  {c.levelNumber !== undefined ? `LEVEL ${c.levelNumber} · ` : ''}
                  {c.badgeText || 'TRAINING CARD'}
                </div>

                <h3 className="text-base sm:text-lg font-bold text-white">
                  {idx + 1}. {c.title}
                </h3>

                {c.subtitle && (
                  <p className="text-xs text-neutral-400 font-medium">
                    {c.subtitle}
                  </p>
                )}

                <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-normal">
                  {c.feynmanExplanation}
                </p>

                {/* Critical Rules */}
                {c.criticalRules && c.criticalRules.length > 0 && (
                  <div className="pt-3 border-t border-white/10 space-y-2">
                    <div className="text-[11px] font-bold text-red-400 uppercase">
                      Critical Red Lines:
                    </div>
                    <div className="space-y-1.5 text-xs">
                      {c.criticalRules.map((r, i) => (
                        <div key={i} className="p-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-200">
                          <strong className="text-red-300">[{r.type.toUpperCase()}]</strong> {r.rule}{' '}
                          <span className="text-neutral-400 block text-[11px] mt-0.5">Risk: {r.consequenceOfFailure}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Workflow Steps */}
                {c.steps && c.steps.length > 0 && (
                  <div className="pt-3 border-t border-white/10 space-y-2">
                    <div className="text-[11px] font-bold text-blue-400 uppercase">
                      Execution Steps:
                    </div>
                    <div className="space-y-2 text-xs">
                      {c.steps.map((s, i) => (
                        <div key={i} className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-100">
                          <strong className="text-white">{s.stepNumber}. {s.title}</strong>: {s.action}
                          <div className="text-[11px] text-neutral-400 mt-0.5">Why: {s.whyItMatters}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
