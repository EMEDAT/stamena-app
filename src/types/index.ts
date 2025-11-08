export interface AnimatedComponentProps {
  delay?: number;
  duration?: number;
}

export interface GraphPoint {
  x: number;
  y: number;
}

export interface GraphData {
  withKegels: GraphPoint[];
  withoutKegels: GraphPoint[];
}