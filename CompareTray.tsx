import { ArrowRight, GitCompareArrows, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Vehicle } from '../data/types';

export default function CompareTray({
  vehicles,
  onRemove,
}: {
  vehicles: Vehicle[];
  onRemove: (id: string) => void;
}) {
  if (!vehicles.length) return null;
  return (
    <aside className="compare-tray" aria-label="Selected vehicles for comparison">
      <div className="compare-tray__label"><GitCompareArrows size={16} /><span>YOUR SHORTLIST <b>{vehicles.length}/3</b></span></div>
      <div className="compare-tray__models">
        {vehicles.map(vehicle => (
          <span key={vehicle.id} className="compare-chip">{vehicle.name}<button onClick={() => onRemove(vehicle.id)} aria-label={`Remove ${vehicle.name} from comparison`}><X size={12} /></button></span>
        ))}
      </div>
      <Link to="/compare" className="compare-tray__action" aria-disabled={vehicles.length < 2}>COMPARE <ArrowRight size={14} /></Link>
    </aside>
  );
}
