// Anneora website — Gallery. Four gothic / angelic themed image slots the
// user fills (I can't pull from Google). Drop images in; they persist.
const { Badge } = window.AnneoraDesignSystem_7f3db2;

const SLOTS = [
  { id: 'gal-1', placeholder: 'Cathedral light', caption: 'Cathedral light' },
  { id: 'gal-2', placeholder: 'Fallen feathers', caption: 'Fallen feathers' },
  { id: 'gal-3', placeholder: 'Veil & smoke',    caption: 'Veil & smoke' },
  { id: 'gal-4', placeholder: 'Cold marble',     caption: 'Cold marble' },
];

function Gallery() {
  const DropImage = window.DropImage;
  return (
    <section id="visions" style={{ padding: '80px 24px', maxWidth: 1000, margin: '0 auto' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, marginBottom: 38 }}>
        <span style={{ fontSize: '0.65rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--bone-400)' }}>The themes</span>
        <window.SectionLabel>Visions</window.SectionLabel>
        <div style={{ marginTop: 6 }}><Badge variant="outline">Drop your imagery</Badge></div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
        {SLOTS.map((s, i) => (
          <DropImage
            key={s.id}
            id={s.id}
            placeholder={s.placeholder}
            caption={s.caption}
            style={{ aspectRatio: i % 2 === 0 ? '3 / 4' : '3 / 4.4', width: '100%' }}
          />
        ))}
      </div>
    </section>
  );
}

window.Gallery = Gallery;
