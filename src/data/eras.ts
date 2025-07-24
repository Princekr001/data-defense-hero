export interface Era {
  id: string;
  year: number;
  name: string;
  description: string;
  theme: string;
  backgroundColor: string;
  textColor: string;
  icon: string;
  threats: string[];
  technologies: string[];
}

export const gameEras: Era[] = [
  {
    id: 'era-2005',
    year: 2005,
    name: 'The Wild Web',
    description: 'Early internet days with basic phishing and malware threats',
    theme: 'retro-green',
    backgroundColor: 'from-green-900/20 to-green-700/10',
    textColor: 'text-green-400',
    icon: '💾',
    threats: ['Basic phishing emails', 'Simple malware', 'Weak passwords', 'Unencrypted data'],
    technologies: ['Dial-up internet', 'Basic antivirus', 'Simple firewalls', 'Email filters']
  },
  {
    id: 'era-2010',
    year: 2010,
    name: 'Social Media Storm',
    description: 'Rise of social networks and sophisticated social engineering',
    theme: 'retro-blue',
    backgroundColor: 'from-blue-900/20 to-blue-700/10',
    textColor: 'text-blue-400',
    icon: '📱',
    threats: ['Social engineering', 'Identity theft', 'Mobile malware', 'WiFi attacks'],
    technologies: ['Social media', 'Mobile security', 'Cloud storage', 'Two-factor auth']
  },
  {
    id: 'era-2020',
    year: 2020,
    name: 'Digital Transformation',
    description: 'Remote work era with ransomware and advanced persistent threats',
    theme: 'modern-purple',
    backgroundColor: 'from-purple-900/20 to-purple-700/10',
    textColor: 'text-purple-400',
    icon: '🌐',
    threats: ['Ransomware', 'APT attacks', 'COVID-19 scams', 'Remote work vulnerabilities'],
    technologies: ['VPN networks', 'Zero-trust security', 'Cloud infrastructure', 'Remote monitoring']
  },
  {
    id: 'era-2035',
    year: 2035,
    name: 'AI Cyber Wars',
    description: 'Future era with AI-driven threats and quantum computing challenges',
    theme: 'futuristic-cyan',
    backgroundColor: 'from-cyan-900/20 to-cyan-700/10',
    textColor: 'text-cyan-400',
    icon: '🤖',
    threats: ['AI-generated deepfakes', 'Quantum code breaking', 'Neural network attacks', 'IoT swarm attacks'],
    technologies: ['Quantum encryption', 'AI security', 'Neural firewalls', 'Biometric everything']
  }
];

export interface TimelineEvent {
  eraId: string;
  isRepaired: boolean;
  dataLeaks: number;
  completionTime: number;
}

export interface FirewallEnergy {
  current: number;
  max: number;
  regenRate: number;
}