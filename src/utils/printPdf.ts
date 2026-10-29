import { FeynmanDeck } from '../types/deck';

/**
 * Universal Print to PDF utility with iframe security sandbox fallback
 */
export function printDeckToPdf(deck: FeynmanDeck) {
  if (!deck) return;

  // 1. First attempt standard window.print()
  let printSucceeded = false;
  try {
    if (typeof window !== 'undefined' && window.print) {
      window.print();
      printSucceeded = true;
    }
  } catch (e) {
    console.warn('Direct window.print() failed (iframe security restriction):', e);
  }

  // 2. Fallback: If window.print() threw an error or iframe blocked printing, open popup print document
  if (!printSucceeded) {
    try {
      const printWin = window.open('', '_blank');
      if (!printWin) {
        alert('Browser popup blocker prevented opening the print document window. Please allow popups or use Copy Markdown.');
        return;
      }

      const cardsHtml = deck.cards
        .map(
          (c, idx) => `
        <div style="page-break-inside: avoid; break-inside: avoid; margin-bottom: 1.5rem; padding: 1.25rem; border: 1px solid #e5e7eb; border-radius: 12px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #ffffff;">
          <div style="font-size: 10px; font-weight: 700; font-family: monospace; color: #2563eb; text-transform: uppercase; margin-bottom: 4px;">
            ${c.levelNumber !== undefined ? `LEVEL ${c.levelNumber} · ` : ''}${c.badgeText || 'TRAINING CARD'}
          </div>
          <h2 style="font-size: 18px; font-weight: 800; color: #111827; margin: 0 0 6px 0; line-height: 1.3;">${idx + 1}. ${c.title}</h2>
          ${c.subtitle ? `<p style="font-size: 12px; color: #4b5563; margin: 0 0 10px 0;">${c.subtitle}</p>` : ''}
          <p style="font-size: 13px; color: #1f2937; line-height: 1.5; margin: 0 0 12px 0;">${c.feynmanExplanation}</p>

          ${
            c.criticalRules && c.criticalRules.length > 0
              ? `<div style="margin-top: 10px; padding-top: 10px; border-top: 1px solid #f3f4f6;">
                  <div style="font-size: 11px; font-weight: 700; color: #dc2626; text-transform: uppercase; margin-bottom: 6px;">Critical Red Lines:</div>
                  <ul style="margin: 0; padding-left: 18px; font-size: 12px; color: #374151;">
                    ${c.criticalRules
                      .map(
                        (r) =>
                          `<li style="margin-bottom: 4px;"><strong>[${(r.type || 'MUST_DO').toUpperCase()}]</strong> ${
                            r.rule && r.rule !== 'undefined' ? r.rule : 'Adhere to operational standard'
                          } <span style="color: #6b7280;">(Failure Risk: ${
                            r.consequenceOfFailure && r.consequenceOfFailure !== 'undefined'
                              ? r.consequenceOfFailure
                              : 'Operational non-compliance'
                          })</span></li>`
                      )
                      .join('')}
                  </ul>
                </div>`
              : ''
          }

          ${
            c.steps && c.steps.length > 0
              ? `<div style="margin-top: 10px; padding-top: 10px; border-top: 1px solid #f3f4f6;">
                  <div style="font-size: 11px; font-weight: 700; color: #2563eb; text-transform: uppercase; margin-bottom: 6px;">Execution Steps:</div>
                  <ol style="margin: 0; padding-left: 18px; font-size: 12px; color: #374151;">
                    ${c.steps
                      .map((s, sIdx) => {
                        const sTitle =
                          s.title && s.title !== 'undefined'
                            ? s.title
                            : `Step ${s.stepNumber || sIdx + 1}`;
                        const sAction =
                          s.action && s.action !== 'undefined'
                            ? s.action
                            : 'Execute step protocol';
                        const sWhy =
                          s.whyItMatters && s.whyItMatters !== 'undefined'
                            ? s.whyItMatters
                            : 'Ensures operational compliance';
                        return `<li style="margin-bottom: 6px;"><strong>${sTitle}</strong>: ${sAction} <br/><span style="font-size: 11px; color: #4b5563;"><em>Why: ${sWhy}</em></span></li>`;
                      })
                      .join('')}
                  </ol>
                </div>`
              : ''
          }

          ${
            c.pitfalls && c.pitfalls.length > 0
              ? `<div style="margin-top: 10px; padding-top: 10px; border-top: 1px solid #f3f4f6;">
                  <div style="font-size: 11px; font-weight: 700; color: #7c3aed; text-transform: uppercase; margin-bottom: 6px;">Troubleshooting & Fixes:</div>
                  <ul style="margin: 0; padding-left: 18px; font-size: 12px; color: #374151;">
                    ${c.pitfalls
                      .map(
                        (p) =>
                          `<li style="margin-bottom: 6px;"><strong>Issue:</strong> ${
                            p.symptomOrMistake && p.symptomOrMistake !== 'undefined'
                              ? p.symptomOrMistake
                              : 'Operational anomaly'
                          } <br/><span style="font-size: 11px; color: #059669;"><strong>Action:</strong> ${
                            p.immediateFix && p.immediateFix !== 'undefined'
                              ? p.immediateFix
                              : 'Execute recovery protocol'
                          }</span></li>`
                      )
                      .join('')}
                  </ul>
                </div>`
              : ''
          }
        </div>
      `
        )
        .join('');

      printWin.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>${deck.title} - Training Deck Study Guide</title>
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif; padding: 24px; max-width: 800px; margin: 0 auto; color: #111; background: #fff; }
              h1 { font-size: 24px; font-weight: 800; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px; margin-bottom: 8px; }
              .summary { font-size: 13px; color: #4b5563; margin-bottom: 20px; line-height: 1.5; font-style: italic; }
              .no-print-bar { background: #111; color: #fff; padding: 12px 18px; border-radius: 12px; font-weight: 600; font-size: 13px; display: flex; align-items: center; justify-between; margin-bottom: 20px; }
              .print-btn { background: #fff; color: #000; border: none; padding: 6px 16px; border-radius: 20px; font-weight: 700; font-size: 12px; cursor: pointer; }
              @media print { .no-print-bar { display: none !important; } }
            </style>
          </head>
          <body>
            <div class="no-print-bar">
              <span>📄 Printable SOP Training Deck</span>
              <button class="print-btn" onclick="window.print()">Save as PDF / Print</button>
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
        </html>
      `);
      printWin.document.close();
    } catch (popupErr) {
      console.error('Failed to launch popup print document:', popupErr);
    }
  }
}
