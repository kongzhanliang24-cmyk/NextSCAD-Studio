import {
  Award,
  BarChart3,
  BatteryFull,
  Camera,
  ClipboardCheck,
  Droplets,
  Gauge,
  HardDrive,
  Headphones,
  Link2,
  Scale,
  Settings,
  Shield,
  ShieldCheck,
  TrendingUp,
  Users,
  Wrench
} from 'lucide-react'

export const iconMap = {
  Award,
  BarChart3,
  BatteryFull,
  Camera,
  ClipboardCheck,
  Droplets,
  Gauge,
  HardDrive,
  Headphones,
  Link: Link2,
  Scale,
  Settings,
  Shield,
  ShieldCheck,
  TrendingUp,
  Users,
  Wrench
}

export function getIcon(name) {
  return iconMap[name] || Scale
}
