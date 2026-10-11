export type VehicleCategory = 'SUV' | 'eSUV';

export interface VehicleImage {
  src: string;
  alt: string;
  caption: string;
}

export interface VehicleSource {
  title: string;
  url: string;
}

export interface Vehicle {
  id: string;
  name: string;
  eyebrow: string;
  tagline: string;
  category: VehicleCategory;
  type: string;
  seats: string;
  seatMin: number;
  seatMax: number;
  price: string;
  priceMinLakh: number;
  fuel: 'Petrol' | 'Diesel' | 'Electric' | 'Petrol / Diesel' | 'Diesel / Petrol';
  engine: string;
  power: string;
  torque: string;
  efficiency: string;
  efficiencyBasis: string;
  transmission: string;
  drivetrain: string;
  dimensions: string;
  safety: string;
  story: string;
  highlights: string[];
  variants: string[];
  colours: string[];
  image: string;
  gallery: VehicleImage[];
  officialUrl: string;
  sources: VehicleSource[];
  note: string;
}
