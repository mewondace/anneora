// Anneora website — Footer. Wordmark, social icon row (Lucide), mailing-list
// capsule, and a faint copyright. Social glyphs use Lucide via IconButton.
const { IconButton, Input } = window.AnneoraDesignSystem_7f3db2;

// Minimal inline Lucide-style paths (stroke, 1.5) — Spotify-ish / IG / mail / yt
function Glyph({ d, viewBox = '0 0 24 24', fill = false }) {
  return (
    <svg width="18" height="18" viewBox={viewBox} fill={fill ? 'currentColor' : 'none'}
      stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      {d}
    </svg>
  );
}

function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid var(--veil-08)',
      padding: '54px 24px 40px',
      textAlign: 'center',
    }}>
      <div style={{
        fontFamily: "'Cinzel', serif", fontWeight: 500, fontSize: '1.1rem',
        letterSpacing: '0.28em', color: 'var(--bone-50)', textShadow: '0 0 20px rgba(255,255,255,0.15)',
      }}>ANNEORA</div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: 14, margin: '28px 0' }}>
        <IconButton label="Instagram" size="md"><Glyph d={<><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.6" fill="currentColor"/></>} /></IconButton>
        <IconButton label="Spotify" size="md"><Glyph d={<><circle cx="12" cy="12" r="9"/><path d="M7 9.5c3-1 6-0.8 9 0.8M7.5 12.6c2.4-0.8 4.8-0.6 7 0.7M8 15.4c1.9-0.6 3.7-0.4 5.4 0.5"/></>} /></IconButton>
        <IconButton label="YouTube" size="md"><Glyph d={<><rect x="3" y="6" width="18" height="12" rx="3"/><path d="M11 9.5l4 2.5-4 2.5z" fill="currentColor" stroke="none"/></>} /></IconButton>
        <IconButton label="Email" size="md"><Glyph d={<><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3.5 7l8.5 6 8.5-6"/></>} /></IconButton>
      </div>

      <div style={{ maxWidth: 340, margin: '0 auto 30px' }}>
        <Input variant="capsule" type="email" placeholder="you@void.com" label="Join the mailing list" />
      </div>

      <div style={{ fontSize: '0.65rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--bone-400)' }}>
        © 2025 Anneora · voice from the void
      </div>
    </footer>
  );
}

window.Footer = Footer;
