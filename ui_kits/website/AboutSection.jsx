// Anneora website — About section. Quiet centered prose, low contrast,
// flanked by hairline dividers. A glass portrait placeholder sits above.
const { Badge } = window.AnneoraDesignSystem_7f3db2;

function Divider() {
  return <div style={{ width: 1, height: 60, background: 'linear-gradient(var(--veil-12), transparent)', margin: '0 auto' }} />;
}

function AboutSection() {
  return (
    <section id="about" style={{ padding: '90px 24px 70px', maxWidth: 600, margin: '0 auto', textAlign: 'center' }}>
      <Divider />
      <div style={{ display: 'flex', justifyContent: 'center', margin: '40px 0 26px' }}>
        <img
          src="https://i.scdn.co/image/ab6761610000e5eb67568745a8d4d5348827036d"
          alt="Anneora"
          style={{
            width: 132, height: 132, borderRadius: '50%', objectFit: 'cover',
            border: '1px solid var(--veil-12)',
            filter: 'grayscale(0.4) contrast(1.05) brightness(0.9)',
            boxShadow: '0 0 40px rgba(255,255,255,0.08)',
          }}
        />
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '30px' }}>
        <Badge variant="outline">The artist</Badge>
      </div>

      <p style={{
        margin: 0,
        fontFamily: "'Inter', sans-serif",
        fontWeight: 300,
        fontSize: '1.25rem',
        lineHeight: 1.8,
        letterSpacing: '0.02em',
        color: 'var(--bone-100)',
        textWrap: 'pretty',
      }}>
        I'm a singer / songwriter creating dark, atmospheric soundscapes —
        music built from negative space, breath, and reverb. Each track is a
        room you walk into alone.
      </p>

      <p style={{
        marginTop: '28px',
        fontFamily: "'Inter', sans-serif",
        fontWeight: 300,
        fontSize: '0.95rem',
        lineHeight: 1.7,
        color: 'var(--bone-300)',
        textWrap: 'pretty',
      }}>
        Recorded in the quiet hours. Released into the void, for whoever is
        listening on the other side.
      </p>

      <div style={{ marginTop: 44 }}><Divider /></div>
    </section>
  );
}

window.AboutSection = AboutSection;
