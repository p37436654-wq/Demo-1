import { useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, Compass, Gauge, GitCompareArrows, MoveRight, Search, Zap } from 'lucide-react';
import { Link, Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import ParticleHero from './components/ParticleHero';
import ScrollReveal from './components/ScrollReveal';
import VehicleCard from './components/VehicleCard';
import CompareTray from './components/CompareTray';
import SpecsPanel from './components/SpecsPanel';
import MediaGallery from './components/MediaGallery';
import BrandMark from './components/BrandMark';
import { vehicles } from './data/models';
import type { Vehicle } from './data/types';

const COMPARE_KEY = 'mahindra-beyond-compare';
const COMPARISON_MAX = 3;

type CategoryFilter = 'all' | 'SUV' | 'eSUV';
type FuelFilter = 'all' | Vehicle['fuel'];

function getSavedSelection(): string[] {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(COMPARE_KEY) || '[]');
    return Array.isArray(value) ? value.filter((entry): entry is string => typeof entry === 'string').slice(0, COMPARISON_MAX) : [];
  } catch {
    return [];
  }
}

function useCompareSelection() {
  const [ids, setIds] = useState<string[]>(getSavedSelection);
  const [notice, setNotice] = useState('');
  useEffect(() => localStorage.setItem(COMPARE_KEY, JSON.stringify(ids)), [ids]);
  const toggle = (id: string) => {
    setIds(current => {
      if (current.includes(id)) return current.filter(item => item !== id);
      if (current.length >= COMPARISON_MAX) {
        setNotice('Your shortlist is full. Remove a vehicle to add another.');
        window.setTimeout(() => setNotice(''), 2600);
        return current;
      }
      return [...current, id];
    });
  };
  const remove = (id: string) => setIds(current => current.filter(item => item !== id));
  return { ids, vehicles: vehicles.filter(vehicle => ids.includes(vehicle.id)), toggle, remove, notice };
}

function SectionHeading({ eyebrow, title, description, light = false }: { eyebrow: string; title: ReactNode; description?: string; light?: boolean }) {
  return (
    <div className={`section-heading${light ? ' section-heading--light' : ''}`}>
      <p className="eyebrow"><span className="eyebrow-line" />{eyebrow}</p>
      <h2>{title}</h2>
      {description && <p className="section-heading__description">{description}</p>}
    </div>
  );
}

function StatLine({ number, label, icon: Icon }: { number: string; label: string; icon: typeof Gauge }) {
  return <div className="stat-line"><span className="stat-line__icon"><Icon size={17} strokeWidth={1.4} /></span><strong>{number}</strong><span>{label}</span></div>;
}

function Catalogue({ selectedIds, onCompare }: { selectedIds: string[]; onCompare: (id: string) => void }) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<CategoryFilter>('all');
  const [fuel, setFuel] = useState<FuelFilter>('all');
  const [seats, setSeats] = useState('all');
  const [transmission, setTransmission] = useState('all');
  const [priceCeiling, setPriceCeiling] = useState(60);
  const [sort, setSort] = useState('featured');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const searchInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onShortcut = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        searchInput.current?.focus();
      }
    };
    window.addEventListener('keydown', onShortcut);
    return () => window.removeEventListener('keydown', onShortcut);
  }, []);

  const filteredVehicles = useMemo(() => {
    const result = vehicles.filter(vehicle => {
      const text = `${vehicle.name} ${vehicle.type} ${vehicle.category} ${vehicle.tagline} ${vehicle.fuel}`.toLowerCase();
      const queryMatch = text.includes(search.trim().toLowerCase());
      const categoryMatch = category === 'all' || vehicle.category === category;
      const fuelMatch = fuel === 'all' || vehicle.fuel.includes(fuel);
      const seatMatch = seats === 'all' || (seats === 'five' ? vehicle.seatMin <= 5 : vehicle.seatMax >= 6);
      const transmissionMatch = transmission === 'all' || vehicle.transmission.toLowerCase().includes(transmission);
      return queryMatch && categoryMatch && fuelMatch && seatMatch && transmissionMatch && vehicle.priceMinLakh <= priceCeiling;
    });
    if (sort === 'price') result.sort((a, b) => a.priceMinLakh - b.priceMinLakh);
    else if (sort === 'name') result.sort((a, b) => a.name.localeCompare(b.name));
    return result;
  }, [category, fuel, priceCeiling, search, seats, sort, transmission]);

  const clearFilters = () => {
    setSearch(''); setCategory('all'); setFuel('all'); setSeats('all'); setTransmission('all'); setPriceCeiling(60); setSort('featured');
  };

  return (
    <section className="catalogue-section" id="lineup">
      <div className="page-shell">
        <ScrollReveal>
          <div className="catalogue-head">
            <SectionHeading eyebrow="THE MAHINDRA LINE-UP" title={<>Made for every<br /><em>kind of further.</em></>} description="From the familiar road to the unmarked one. Meet the complete SUV family." />
            <div className="catalogue-head__count"><strong>{String(filteredVehicles.length).padStart(2, '0')}</strong><span>VEHICLES<br />TO EXPLORE</span></div>
          </div>
        </ScrollReveal>

        <div className="filter-toolbar">
          <label className="search-field"><Search size={16} /><input ref={searchInput} value={search} onChange={event => setSearch(event.target.value)} placeholder="Find your next Mahindra" aria-label="Search vehicles" /><kbd>CTRL K</kbd></label>
          <div className="category-switch" aria-label="Filter by vehicle type">
            {([['all', 'ALL VEHICLES'], ['SUV', 'SUV'], ['eSUV', 'eSUV']] as [CategoryFilter, string][]).map(([value, label]) => <button key={value} onClick={() => setCategory(value)} className={category === value ? 'is-active' : ''}>{label}{value === 'eSUV' && <span className="nav-dot" />}</button>)}
          </div>
          <button className={`filter-expand${filtersOpen ? ' is-active' : ''}`} onClick={() => setFiltersOpen(!filtersOpen)}><span>{filtersOpen ? 'HIDE FILTERS' : 'FILTER & SORT'}</span><span className="filter-expand__plus">{filtersOpen ? '−' : '+'}</span></button>
        </div>

        <AnimatePresence initial={false}>
          {filtersOpen && <motion.div className="filter-panel" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.26 }}>
            <div className="filter-controls">
              <label><span>POWERTRAIN</span><select value={fuel} onChange={event => setFuel(event.target.value as FuelFilter)}><option value="all">All powertrains</option><option value="Petrol">Petrol</option><option value="Diesel">Diesel</option><option value="Electric">Electric</option></select></label>
              <label><span>SEATING CAPACITY</span><select value={seats} onChange={event => setSeats(event.target.value)}><option value="all">Any capacity</option><option value="five">5 seats or less</option><option value="six">6 seats and above</option></select></label>
              <label><span>TRANSMISSION</span><select value={transmission} onChange={event => setTransmission(event.target.value)}><option value="all">Any transmission</option><option value="manual">Manual</option><option value="automatic">Automatic</option></select></label>
              <label><span>SORT BY</span><select value={sort} onChange={event => setSort(event.target.value)}><option value="featured">Featured</option><option value="price">Price: lowest first</option><option value="name">Model name</option></select></label>
              <label className="price-slider"><span>STARTING PRICE <b>UP TO ₹{priceCeiling}L</b></span><input type="range" min="10" max="60" step="1" value={priceCeiling} onChange={event => setPriceCeiling(Number(event.target.value))} aria-label="Maximum starting price in lakhs" /></label>
              <button className="clear-filters" onClick={clearFilters}>CLEAR ALL <span>↗</span></button>
            </div>
          </motion.div>}
        </AnimatePresence>

        <div className="catalogue-subline"><span>{filteredVehicles.length} MODEL{filteredVehicles.length === 1 ? '' : 'S'} AVAILABLE</span><span>EX-SHOWROOM PRICE · INDIA*</span></div>
        {filteredVehicles.length ? <div className="vehicle-grid">
          {filteredVehicles.map((vehicle, index) => <VehicleCard key={vehicle.id} vehicle={vehicle} index={index} selected={selectedIds.includes(vehicle.id)} onCompare={onCompare} />)}
        </div> : <div className="empty-results"><Compass size={27} /><h3>No road by that name.</h3><p>Try widening a filter, or clear them to see the complete Mahindra line-up.</p><button className="text-link" onClick={clearFilters}>Reset filters <ArrowRight size={15} /></button></div>}
        <p className="catalogue-disclaimer">*Starting prices shown in ₹ lakh, ex-showroom, and specifications may change by variant, city and model year. Verify the live offer with Mahindra.</p>
      </div>
    </section>
  );
}

function HomePage({ selectedIds, onCompare }: { selectedIds: string[]; onCompare: (id: string) => void }) {
  const electricCount = vehicles.filter(vehicle => vehicle.category === 'eSUV').length;
  return (
    <>
      <ParticleHero image="/assets/vehicles/thar-roxx-hero.jpg" />
      <section className="intro-stats" aria-label="Mahindra vehicle range highlights">
        <StatLine number={String(vehicles.length).padStart(2, '0')} label="ways to find your further" icon={Compass} />
        <StatLine number={String(electricCount).padStart(2, '0')} label="all-electric possibilities" icon={Zap} />
        <StatLine number="1945" label="A beginning that still moves forward" icon={ArrowUpRight} />
      </section>
      <section className="manifesto-section">
        <div className="manifesto-rule"><span>NOT JUST THE ROAD AHEAD.</span><span>ALSO WHAT LIES BEYOND IT.</span></div>
        <div className="manifesto-layout">
          <ScrollReveal className="manifesto-copy"><p className="eyebrow"><span className="eyebrow-line" />THE SPIRIT OF MAHINDRA</p><h2>It’s not the<br />road. It’s the<br /><em>reason to go.</em></h2></ScrollReveal>
          <ScrollReveal className="manifesto-note" delay={0.12}><span className="giant-asterisk" aria-hidden="true">✳</span><p>To see a little more.<br />To take the long way.<br />To find your own way home.</p><a href="#lineup" className="text-link">Find your Mahindra <ArrowRight size={15} /></a></ScrollReveal>
        </div>
        <div className="manifesto-foot"><span>FROM THE ROAD LESS TAKEN. TO THE WIDE OPEN.</span><span>GO WHERE YOUR INSTINCT TAKES YOU <ArrowDown size={13} /></span></div>
      </section>
      <Catalogue selectedIds={selectedIds} onCompare={onCompare} />
      <section className="electric-section" id="electric">
        <div className="electric-background" aria-hidden="true" />
        <div className="page-shell electric-content">
          <ScrollReveal><p className="eyebrow eyebrow--light"><span className="eyebrow-line" />THE NEXT CHAPTER IS ELECTRIC</p>
            <h2>Tomorrow.<br /><em>Without waiting.</em></h2>
            <p className="electric-lede">Electric by nature. Mahindra by instinct.<br />A new kind of distance starts here.</p>
            <a href="#lineup" onClick={() => document.querySelector<HTMLButtonElement>('.category-switch button:nth-child(3)')?.click()} className="button button--outline-light">Explore electric <ArrowRight size={16} /></a>
          </ScrollReveal>
          <div className="electric-figures"><div><span>CHOOSE YOUR CHARGE</span><strong>e<span>↗</span></strong></div><div className="electric-emblem">↑<br /><small>INGLO</small></div></div>
        </div>
        <p className="electric-vertical">THE FUTURE DOESN’T WAIT. NEITHER SHOULD YOU.</p>
      </section>
      <section className="closing-section">
        <ScrollReveal><p className="eyebrow"><span className="eyebrow-line" />TAKE THE LONG WAY</p><h2>The next story<br />is <em>yours.</em></h2><div className="closing-actions"><a className="button button--dark" href="https://auto.mahindra.com/test-drive" target="_blank" rel="noreferrer">Book a test drive <ArrowUpRight size={16} /></a><a href="https://auto.mahindra.com/dealer-locator" target="_blank" rel="noreferrer" className="text-link">Find a dealer <ArrowRight size={15} /></a></div></ScrollReveal>
      </section>
    </>
  );
}

function VehicleDetailPage({ onCompare, selectedIds }: { onCompare: (id: string) => void; selectedIds: string[] }) {
  const { slug = '' } = useParams();
  const vehicle = vehicles.find(item => item.id === slug);
  const isSelected = selectedIds.includes(slug);
  if (!vehicle) return <main className="not-found"><h1>That road isn’t on this map.</h1><Link className="button button--dark" to="/#lineup">Back to the lineup <ArrowRight size={16} /></Link></main>;
  const electric = vehicle.category === 'eSUV';
  const actionLink = vehicle.officialUrl;
  const detailFacts = [
    ['FUEL TYPE', vehicle.fuel],
    ['ENGINE / BATTERY', vehicle.engine],
    ['POWER', vehicle.power],
    ['TORQUE', vehicle.torque],
    ['GEARBOX', vehicle.transmission],
    ['DRIVE', vehicle.drivetrain],
    ['DIMENSIONS (L × W × H)', vehicle.dimensions],
    ['SAFETY', vehicle.safety],
    ['EFFICIENCY BASIS', vehicle.efficiencyBasis],
  ];

  return (
    <main className="detail-page">
      <section className={`detail-hero${electric ? ' detail-hero--electric' : ''}`} style={{ backgroundImage: `linear-gradient(90deg, rgba(16,16,15,.97) 4%, rgba(16,16,15,.74) 46%, rgba(16,16,15,.12) 100%), linear-gradient(0deg, rgba(16,16,15,.8), transparent 35%), url("${vehicle.image}")` }}>
        <div className="detail-hero__top"><Link to="/#lineup" className="back-link"><ArrowLeft size={15} /> THE LINEUP</Link><span className="detail-page-index">MAHINDRA / {vehicle.category.toUpperCase()}</span></div>
        <div className="detail-hero__copy">
          <p className="eyebrow eyebrow--light"><span className="eyebrow-line" />{vehicle.eyebrow} · {vehicle.type}</p>
          <h1>{vehicle.name.split(' ').map((part, index) => <span key={`${part}-${index}`} className={index % 2 === 1 ? 'detail-title-italic' : ''}>{part} </span>)}</h1>
          <p className="detail-tagline">{vehicle.tagline}</p>
          <div className="detail-hero__price"><span>STARTING AT*</span><strong>{vehicle.price}</strong><small>₹ lakh · ex-showroom</small></div>
          <div className="detail-hero__actions"><a className="button button--light" href={actionLink} target="_blank" rel="noreferrer">Explore on Mahindra <ArrowUpRight size={15} /></a><button className="button button--translucent" onClick={() => onCompare(vehicle.id)}><GitCompareArrows size={15} /> {isSelected ? 'Remove from compare' : 'Add to compare'}</button></div>
        </div>
        <div className="detail-hero__foot"><span>01 / 06</span><span>MADE FOR THE WAY YOU MOVE</span></div>
      </section>

      <section className="detail-overview page-shell">
        <ScrollReveal className="detail-overview__lead"><p className="eyebrow"><span className="eyebrow-line" />A CLOSER LOOK</p><h2>{vehicle.story}</h2></ScrollReveal>
        <ScrollReveal className="detail-overview__aside" delay={0.12}><p className="detail-overview__type">{vehicle.category === 'eSUV' ? 'PURE ELECTRIC' : `${vehicle.fuel.toUpperCase()} POWER`}</p><p>One of the Mahindra vehicles that turns ordinary miles into a reason to keep going. Explore the details and see how it fits your next move.</p><a className="text-link" href={actionLink} target="_blank" rel="noreferrer">See the official listing <ArrowUpRight size={14} /></a></ScrollReveal>
      </section>

      <section className="detail-specs page-shell" id="specifications">
        <div className="detail-section-heading"><div><p className="eyebrow"><span className="eyebrow-line" />THE NUMBERS THAT MOVE YOU</p><h2>Engineered<br /><em>for a reason.</em></h2></div><p>Explore the headline specifications. Actual figures can vary by variant, transmission, wheel configuration and model year.</p></div>
        <SpecsPanel vehicle={vehicle} />
        <div className="detail-spec-table">
          {detailFacts.map(([label, value]) => <div className="detail-spec-row" key={label}><span>{label}</span><strong>{value}</strong></div>)}
        </div>
        <p className="spec-note">{vehicle.note} Efficiency figure is shown as reported by its named basis. EV range and petrol/diesel mileage are not directly comparable.</p>
        <div className="source-list"><span>SPECIFICATION SOURCES</span>{vehicle.sources.map(source => <a key={source.url} href={source.url} target="_blank" rel="noreferrer">{source.title} <ArrowUpRight size={12} /></a>)}</div>
      </section>

      <section className="detail-highlights page-shell">
        <ScrollReveal className="highlights-head"><p className="eyebrow"><span className="eyebrow-line" />THE DETAILS WITH A DIFFERENCE</p><h2>Made for<br /><em>more.</em></h2></ScrollReveal>
        <div className="highlight-list">{vehicle.highlights.map((highlight, index) => <ScrollReveal key={highlight} delay={index * 0.06}><div className="highlight-row"><span>0{index + 1}</span><p>{highlight}</p><MoveRight size={17} /></div></ScrollReveal>)}</div>
      </section>

      <section className="detail-media page-shell" id="gallery">
        <div className="media-heading"><div><p className="eyebrow"><span className="eyebrow-line" />A STUDY IN MOTION</p><h2>Look a little<br /><em>closer.</em></h2></div><p>Paint, proportion, detail. Explore a selection of exterior views.</p></div>
        <MediaGallery images={vehicle.gallery} />
      </section>

      <section className="detail-variants page-shell">
        <div className="variant-panel">
          <div><p className="eyebrow"><span className="eyebrow-line" />CHOOSE YOUR CHARACTER</p><h2>Every detail.<br /><em>Your call.</em></h2></div>
          <div className="variant-info"><span>VARIANTS</span><p>{vehicle.variants.join(' · ')}</p><div className="variant-rule" /><span>COLOUR STORIES</span><div className="colour-list">{vehicle.colours.map((colour, index) => <span key={colour} title={colour} className="colour-item"><i style={{ backgroundColor: colourForIndex(index) }} />{colour}</span>)}</div><a className="text-link" href={actionLink} target="_blank" rel="noreferrer">Check local availability <ArrowUpRight size={14} /></a></div>
        </div>
      </section>

      <section className="detail-cta">
        <div className="detail-cta__orbit" aria-hidden="true">M</div><div className="page-shell detail-cta__inner"><p className="eyebrow eyebrow--light"><span className="eyebrow-line" />YOUR NEXT MOVE</p><h2>Meet your<br /><em>{vehicle.name}.</em></h2><p>Go from looking to getting behind the wheel.</p><div className="detail-cta__actions"><a href={actionLink} target="_blank" rel="noreferrer" className="button button--light">Official brochure & details <ArrowUpRight size={15} /></a><a href="https://auto.mahindra.com/dealer-locator" target="_blank" rel="noreferrer" className="button button--translucent">Find a dealer <ArrowUpRight size={15} /></a></div><p className="cta-disclaimer">Price, equipment and specifications are indicative and may vary by trim or location. Confirm with Mahindra before purchase.</p></div>
      </section>
    </main>
  );
}

function colourForIndex(index: number) {
  return ['#a7adb0', '#353638', '#b44035', '#d7d1c4', '#485556', '#ede8de', '#3d4563'][index % 7];
}

const comparisonRows: [string, (vehicle: Vehicle) => string][] = [
  ['CATEGORY', vehicle => vehicle.category],
  ['STARTING PRICE', vehicle => `${vehicle.price}*`],
  ['SEATING CAPACITY', vehicle => vehicle.seats],
  ['FUEL TYPE', vehicle => vehicle.fuel],
  ['POWERTRAIN', vehicle => `${vehicle.fuel} · ${vehicle.engine}`],
  ['POWER', vehicle => vehicle.power],
  ['TORQUE', vehicle => vehicle.torque],
  ['MILEAGE / CLAIMED RANGE', vehicle => `${vehicle.efficiency} (${vehicle.efficiencyBasis})`],
  ['TRANSMISSION', vehicle => vehicle.transmission],
  ['DRIVE TYPE', vehicle => vehicle.drivetrain],
  ['DIMENSIONS', vehicle => vehicle.dimensions],
  ['SAFETY', vehicle => vehicle.safety],
];

function ComparePage({ ids, onRemove }: { ids: string[]; onRemove: (id: string) => void }) {
  const selected = vehicles.filter(vehicle => ids.includes(vehicle.id));
  const navigate = useNavigate();
  return (
    <main className="compare-page">
      <div className="compare-hero page-shell"><Link to="/#lineup" className="back-link"><ArrowLeft size={15} /> BACK TO LINEUP</Link><p className="eyebrow"><span className="eyebrow-line" />SIDE BY SIDE</p><h1>Find your<br /><em>own way.</em></h1><p>Bring up to three Mahindra vehicles together.<br />Compare the details. Choose your direction.</p></div>
      {selected.length < 2 ? <section className="compare-empty page-shell"><div className="compare-empty__icon"><GitCompareArrows size={26} /></div><div><span>SHORTLIST {String(selected.length).padStart(2, '0')} / 03</span><h2>{selected.length ? 'One more makes the difference.' : 'Every good decision starts with a shortlist.'}</h2><p>Choose at least two models from the lineup to compare their pricing, seating, powertrain and headline specs side by side.</p><Link to="/#lineup" className="button button--dark">Add vehicles <ArrowRight size={15} /></Link></div></section> : <section className="comparison-table-shell page-shell"><div className="comparison-topline"><span>{selected.length} MODELS · SIDE BY SIDE</span><button onClick={() => navigate('/#lineup')} className="text-link">Edit your shortlist <ArrowRight size={15} /></button></div><div className="comparison-scroll"><table className="comparison-table"><thead><tr><th className="comparison-table__label">AT A GLANCE</th>{selected.map(vehicle => <th key={vehicle.id}><div className="comparison-model"><img src={vehicle.image} alt={vehicle.name} /><button className="comparison-remove" onClick={() => onRemove(vehicle.id)} aria-label={`Remove ${vehicle.name}`}><span>×</span></button><small>{vehicle.category} · {vehicle.type}</small><h2>{vehicle.name}</h2><strong>{vehicle.price}<small>*</small></strong><Link to={`/model/${vehicle.id}`} className="text-link">Full details <ArrowUpRight size={13} /></Link></div></th>)}</tr></thead><tbody>{comparisonRows.map(([label, accessor]) => <tr key={label}><th>{label}</th>{selected.map(vehicle => <td key={vehicle.id}>{accessor(vehicle)}</td>)}</tr>)}</tbody></table></div><p className="catalogue-disclaimer">*Indicative Indian ex-showroom price. Specifications can vary across trims. Compare like-for-like variants with the official model pages.</p></section>}
    </main>
  );
}

function NotFoundPage() {
  return <main className="not-found"><BrandMark /><p className="eyebrow">WRONG TURN</p><h1>There’s nothing<br /><em>out here.</em></h1><Link to="/" className="button button--dark">Return home <ArrowRight size={15} /></Link></main>;
}

export default function App() {
  const location = useLocation();
  const compare = useCompareSelection();
  useEffect(() => {
    if (location.hash) {
      const timer = window.setTimeout(() => {
        const target = document.getElementById(decodeURIComponent(location.hash.slice(1)));
        target?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
      }, 320);
      return () => window.clearTimeout(timer);
    }
    window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  }, [location.hash, location.pathname]);
  return (
    <>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <div className="site-shell">
        <Header compareCount={compare.ids.length} />
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={location.pathname} className="route-view" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.28 }}>
            <div id="main-content">
              <Routes location={location}>
                <Route path="/" element={<HomePage selectedIds={compare.ids} onCompare={compare.toggle} />} />
                <Route path="/model/:slug" element={<VehicleDetailPage onCompare={compare.toggle} selectedIds={compare.ids} />} />
                <Route path="/compare" element={<ComparePage ids={compare.ids} onRemove={compare.remove} />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </div>
          </motion.div>
        </AnimatePresence>
        <Footer />
        <CompareTray vehicles={compare.vehicles} onRemove={compare.remove} />
        <AnimatePresence>{compare.notice && <motion.div className="toast" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 12 }}>{compare.notice}</motion.div>}</AnimatePresence>
      </div>
    </>
  );
}
