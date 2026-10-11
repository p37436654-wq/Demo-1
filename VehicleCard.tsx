import { ArrowUpRight, GitCompareArrows, UsersRound, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { Vehicle } from '../data/types';

export default function VehicleCard({
  vehicle,
  selected,
  onCompare,
  index,
}: {
  vehicle: Vehicle;
  selected: boolean;
  onCompare: (id: string) => void;
  index: number;
}) {
  const electric = vehicle.category === 'eSUV';
  return (
    <motion.article
      className={`vehicle-card${selected ? ' vehicle-card--selected' : ''}`}
      layout
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.08 }}
      transition={{ duration: 0.55, delay: Math.min(index * 0.045, 0.22), ease: [0.22, 1, 0.36, 1] }}
    >
      <Link className="vehicle-card__image" to={`/model/${vehicle.id}`} aria-label={`Discover ${vehicle.name}`}>
        <img src={vehicle.image} alt={vehicle.name} loading="lazy" />
        <span className="vehicle-category-pill">{vehicle.category}</span>
        <span className="vehicle-image-index">{String(index + 1).padStart(2, '0')}</span>
        <span className="vehicle-image-arrow"><ArrowUpRight size={17} /></span>
      </Link>
      <div className="vehicle-card__body">
        <div className="vehicle-card__heading">
          <div><p className="card-eyebrow">{vehicle.eyebrow}</p><h3>{vehicle.name}</h3></div>
          <span className={`mini-powertrain${electric ? ' mini-powertrain--electric' : ''}`} aria-label={electric ? 'Electric vehicle' : 'Internal combustion engine vehicle'}>{electric ? <Zap size={13} /> : 'M'}</span>
        </div>
        <p className="vehicle-card__tagline">{vehicle.tagline}</p>
        <div className="vehicle-card__facts">
          <span><UsersRound size={14} />{vehicle.seats}</span>
          <span>{vehicle.efficiency}</span>
        </div>
        <div className="vehicle-card__bottom">
          <div className="vehicle-price"><small>EX-SHOWROOM*</small><strong>{vehicle.price}</strong></div>
          <button type="button" className={`compare-toggle${selected ? ' is-on' : ''}`} onClick={() => onCompare(vehicle.id)} aria-pressed={selected} title={selected ? 'Remove from comparison' : 'Add to comparison'}>
            <GitCompareArrows size={16} /><span>{selected ? 'ADDED' : 'COMPARE'}</span>
          </button>
        </div>
      </div>
    </motion.article>
  );
}
