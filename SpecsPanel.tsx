import { Gauge, Ruler, ShieldCheck, UsersRound, Zap, Fuel } from 'lucide-react';
import type { Vehicle } from '../data/types';

export default function SpecsPanel({ vehicle }: { vehicle: Vehicle }) {
  const specs = [
    { icon: UsersRound, label: 'SEATING', value: vehicle.seats },
    { icon: Gauge, label: 'EFFICIENCY', value: vehicle.efficiency, note: vehicle.efficiencyBasis },
    { icon: Zap, label: 'POWER', value: vehicle.power },
    { icon: Fuel, label: 'POWERTRAIN', value: vehicle.engine },
    { icon: Ruler, label: 'DIMENSIONS', value: vehicle.dimensions },
    { icon: ShieldCheck, label: 'SAFETY', value: vehicle.safety },
  ];
  return (
    <div className="spec-grid">
      {specs.map(({ icon: Icon, label, value, note }, index) => (
        <div className="spec-tile" key={label} style={{ '--tile-index': index } as React.CSSProperties}>
          <div className="spec-tile__top"><Icon size={17} strokeWidth={1.5} /><span>{label}</span></div>
          <strong>{value}</strong>
          {note && <small>{note}</small>}
        </div>
      ))}
    </div>
  );
}
