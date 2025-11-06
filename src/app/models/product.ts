export interface Product {
  id: number;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  expiry: string;
  priority: 'Alta' | 'Media' | 'Baja';
  purchased: boolean;
  ecoScore: number;
  notes?: string;
}
