// Anneora website — Music section. The real discography from Spotify, as a
// column of glass TrackRows with album art. Click art to play; click title
// to open on Spotify.
const { TrackRow } = window.AnneoraDesignSystem_7f3db2;

const ART = (hash) => `https://i.scdn.co/image/ab67616d00001e02${hash}`;

// Real releases — open.spotify.com/artist/2Ny3eT14SfY0h8owBDWgGQ
const TRACKS = [
  { title: 'Beyond The Veil', meta: 'Single · 2025', art: ART('7db50b00803ac494607c12da'), href: 'https://open.spotify.com/album/0uxp5yJowPAsKvc233in1E' },
  { title: 'Angel Wings',     meta: 'Single · 2025', art: ART('c97e74d5b6618f91b522087f'), href: 'https://open.spotify.com/album/7y2o2KHNtYdTrpmdulMSBc' },
  { title: 'ECHOS',           meta: 'Single · 2025', art: ART('12b4519cf8c515414ef003f1'), href: 'https://open.spotify.com/album/4Jk7gWeZcedfLUjwMEPtff' },
  { title: 'SPENTTIMEALONE',  meta: 'Single · 2025', art: ART('a94c4b8130bdc2c316c8b5d7'), href: 'https://open.spotify.com/album/7KawqYHuInjqwzXuhnjp3H' },
  { title: 'NO NAME',         meta: 'Single · 2023', art: ART('711986a98fcc645f9b35d506'), href: 'https://open.spotify.com/album/481EtNXt19MdtdqfPXvk8U' },
  { title: 'BLEED TO SURVIVE',meta: 'Single · 2023', href: 'https://open.spotify.com/album/4lSKlt8Bk1hZBjuMg2RjAh' },
];

function SectionLabel({ children }) {
  return (
    <h2 style={{
      margin: 0,
      fontFamily: "'Cinzel', serif",
      fontWeight: 500,
      fontSize: '1.6rem',
      letterSpacing: '0.18em',
      color: 'var(--bone-50)',
      textShadow: '0 0 22px rgba(255,255,255,0.12)',
    }}>{children}</h2>
  );
}
window.SectionLabel = SectionLabel;

function MusicSection({ playing, progress, onToggle }) {
  return (
    <section id="music" style={{ padding: '90px 24px', maxWidth: 700, margin: '0 auto' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, marginBottom: 44 }}>
        <span style={{ fontSize: '0.65rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--bone-400)' }}>Discography · Spotify</span>
        <SectionLabel>Music</SectionLabel>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {TRACKS.map((t) => (
          <TrackRow
            key={t.title}
            title={t.title}
            meta={t.meta}
            art={t.art}
            href={t.href}
            progress={playing === t.title ? progress : 0}
            playing={playing === t.title}
            active={playing === t.title}
            onToggle={() => onToggle(t.title)}
          />
        ))}
      </div>
    </section>
  );
}

window.MusicSection = MusicSection;
window.TRACKS = TRACKS;
