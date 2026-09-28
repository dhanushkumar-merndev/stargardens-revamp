type Props = { eyebrow: string; title: React.ReactNode; lede: string; tone?: 'dark' | 'light' };

export default function PageHero({ eyebrow, title, lede, tone = 'dark' }: Props) {
  return (
    <section className={`page-hero ${tone}`}>
      <div className="wrap sec-head">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="h2">{title}</h1>
        <p className="lede">{lede}</p>
      </div>
    </section>
  );
}
