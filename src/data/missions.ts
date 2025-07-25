export interface Evidence {
  id: string;
  type: 'email' | 'file' | 'log' | 'metadata' | 'screenshot' | 'certificate';
  name: string;
  content: string;
  suspicious?: boolean;
  clues?: string[];
}

export interface CyberTool {
  id: string;
  name: string;
  icon: string;
  description: string;
  unlockLevel: number;
  category: 'analysis' | 'protection' | 'investigation';
}

export interface MissionAction {
  id: string;
  text: string;
  description: string;
  evidenceRequired?: string[];
  toolsRequired?: string[];
  consequence: 'safe' | 'risky' | 'neutral';
  reasoning: string;
}

export interface Mission {
  id: string;
  title: string;
  theme: 'space' | 'pirate' | 'detective' | 'medieval' | 'cyberpunk';
  realWorldIncident: string;
  storySetup: string;
  situation: string;
  evidence: Evidence[];
  actions: MissionAction[];
  correctActionId: string;
  forensicReport: {
    whatHappened: string;
    whyItWorked: string;
    realWorldImpact: string;
    prevention: string[];
  };
  concept: string;
  difficulty: 'rookie' | 'detective' | 'expert';
  xpReward: number;
  toolRewards: string[];
  era: string;
}

export const cyberTools: CyberTool[] = [
  {
    id: 'email-analyzer',
    name: 'Email Analyzer',
    icon: '📧',
    description: 'Reveals hidden email headers and sender authenticity',
    unlockLevel: 1,
    category: 'analysis'
  },
  {
    id: 'url-scanner',
    name: 'URL Scanner',
    icon: '🔍',
    description: 'Checks links for malicious content before clicking',
    unlockLevel: 2,
    category: 'analysis'
  },
  {
    id: 'firewall-patch',
    name: 'Firewall Patch',
    icon: '🛡️',
    description: 'Strengthens network defenses against intrusions',
    unlockLevel: 3,
    category: 'protection'
  },
  {
    id: 'password-vault',
    name: 'Password Vault',
    icon: '🔐',
    description: 'Generates and stores unbreakable passwords',
    unlockLevel: 4,
    category: 'protection'
  },
  {
    id: 'access-auditor',
    name: 'Access Auditor',
    icon: '👥',
    description: 'Monitors who has access to what systems',
    unlockLevel: 5,
    category: 'investigation'
  },
  {
    id: 'threat-detector',
    name: 'Threat Detector',
    icon: '⚠️',
    description: 'Identifies suspicious behavior patterns',
    unlockLevel: 6,
    category: 'investigation'
  }
];

export const missions: Mission[] = [
  {
    id: 'mars-vendor-scam',
    title: 'The Mars Colony Payment Crisis',
    theme: 'space',
    realWorldIncident: 'Google/Facebook Fake Invoice Scam',
    storySetup: 'You are the Chief Financial Officer aboard the Mars Research Station Alpha-7. The colony depends on Earth supply shipments to survive.',
    situation: 'An urgent message arrives claiming to be from "Stellar Supplies Corp" - your main vendor. They demand immediate payment of 500,000 credits for "emergency oxygen supplies" or they will halt all shipments. The station only has 30 days of oxygen remaining. Your team is panicking, but something feels wrong about this message...',
    evidence: [
      {
        id: 'email-header',
        type: 'email',
        name: 'Vendor Email',
        content: 'From: billing@stellarsuppl1es.net\nTo: mars-alpha7@spacecom.gov\nSubject: URGENT: Payment Required - Oxygen Supplies\n\nDear Mars Station,\n\nYour account is 30 days overdue for emergency oxygen supplies. Pay 500,000 credits immediately or shipments will stop.\n\nClick here to pay: http://bit.ly/mars-pay-now\n\nStellar Supplies Corp',
        suspicious: true,
        clues: ['Notice the "1" instead of "l" in the domain', 'Real vendor uses secure payment portal', 'No invoice number or details']
      },
      {
        id: 'vendor-records',
        type: 'file',
        name: 'Official Vendor Contact',
        content: 'Stellar Supplies Corporation\nOfficial Domain: stellarsupplies.com\nPayment Portal: secure.stellarsupplies.com/payments\nAccount Manager: Dr. Sarah Chen\nDirect Line: +1-555-SPACE-01',
        clues: ['Compare the real domain with the email domain', 'Note the secure payment portal difference']
      },
      {
        id: 'account-status',
        type: 'log',
        name: 'Station Account Records',
        content: 'Station Alpha-7 Account Status:\nCurrent Balance: PAID IN FULL\nLast Payment: 15 days ago\nNext Shipment: Scheduled for tomorrow\nAccount Manager Notes: "Excellent payment history - no issues"',
        clues: ['Account is actually current', 'Next shipment already scheduled']
      }
    ],
    actions: [
      {
        id: 'pay-immediately',
        text: 'Transfer 500,000 credits immediately',
        description: 'Send the payment to save the oxygen supplies',
        consequence: 'risky',
        reasoning: 'This would send money to scammers, not the real vendor'
      },
      {
        id: 'call-vendor',
        text: 'Contact Dr. Chen directly using official vendor line',
        description: 'Verify the emergency with the real account manager',
        consequence: 'safe',
        evidenceRequired: ['vendor-records'],
        reasoning: 'Direct verification through official channels prevents scam payments'
      },
      {
        id: 'click-payment-link',
        text: 'Click the payment link to review charges',
        description: 'Investigate what charges are being claimed',
        consequence: 'risky',
        reasoning: 'Clicking suspicious links can install malware or steal credentials'
      },
      {
        id: 'check-account-first',
        text: 'Review station payment records before acting',
        description: 'Check if payments are actually overdue',
        consequence: 'safe',
        evidenceRequired: ['account-status'],
        reasoning: 'Verifying facts before action prevents panic-driven mistakes'
      }
    ],
    correctActionId: 'call-vendor',
    forensicReport: {
      whatHappened: 'Cybercriminals sent a fake invoice impersonating your vendor to steal 500,000 credits.',
      whyItWorked: 'They exploited time pressure and fear (oxygen shortage) to rush your decision.',
      realWorldImpact: 'Similar scams have stolen millions from businesses worldwide, including major tech companies.',
      prevention: [
        'Always verify payment requests through separate communication channels',
        'Check sender domains carefully for subtle misspellings',
        'Never click payment links in unexpected emails',
        'Maintain updated vendor contact information for verification'
      ]
    },
    concept: 'Business Email Compromise Prevention',
    difficulty: 'rookie',
    xpReward: 150,
    toolRewards: ['email-analyzer'],
    era: 'era-2005'
  },
  {
    id: 'treasure-vault-access',
    title: 'The Cursed Treasure Vault',
    theme: 'pirate',
    realWorldIncident: 'Target Contractor Insider Threat',
    storySetup: 'You are the Quartermaster of the legendary pirate ship "Digital Corsair." Your crew has just discovered the location of the greatest treasure vault in the Seven Digital Seas.',
    situation: 'Captain Blackbeard wants to grant vault access to help load the treasure. Three crew members are requesting access: "Honest" Jake (a new recruit who joined last week), Long John Silver (your trusted navigator of 5 years), and Parrot Pete (the ship\'s cook who\'s been acting strangely lately). The vault contains enough gold to retire the entire crew, but one wrong choice could alert the Navy...',
    evidence: [
      {
        id: 'crew-records',
        type: 'file',
        name: 'Crew Background Checks',
        content: 'Jake "Honest" Thompson - Joined 1 week ago - Background: Unknown\nJohn "Silver" Martinez - 5 years service - Background: Former Navy, excellent record\nPete "Parrot" Wilson - 3 years service - Background: Recently divorced, financial troubles',
        clues: ['Jake is too new to trust with treasure', 'Pete has financial pressures', 'Silver has proven loyalty']
      },
      {
        id: 'vault-policy',
        type: 'file',
        name: 'Treasure Vault Security Policy',
        content: 'Vault Access Rules:\n1. Minimum 2 years crew service\n2. Captain + Quartermaster approval required\n3. No access for crew with financial distress\n4. Maximum 2 people in vault at once\n5. All activities logged and monitored',
        clues: ['Clear minimum service requirements', 'Financial stress is a red flag', 'Limited access reduces risk']
      },
      {
        id: 'recent-activity',
        type: 'log',
        name: 'Recent Crew Activity Log',
        content: 'Suspicious Activities:\n- Pete seen near Captain\'s quarters after midnight\n- Jake asking detailed questions about treasure storage\n- Silver organizing new security protocols\n- Strange naval ships spotted following the crew',
        clues: ['Pete and Jake showing suspicious behavior', 'Silver improving security']
      }
    ],
    actions: [
      {
        id: 'grant-all-access',
        text: 'Give vault access to all three crew members',
        description: 'Trust the crew and let everyone help',
        consequence: 'risky',
        reasoning: 'Granting access to unvetted or compromised crew members risks the entire treasure'
      },
      {
        id: 'grant-silver-only',
        text: 'Grant access only to Long John Silver',
        description: 'Trust only the most experienced crew member',
        consequence: 'safe',
        evidenceRequired: ['crew-records', 'vault-policy'],
        reasoning: 'Silver meets all security requirements and has proven loyalty'
      },
      {
        id: 'deny-all-access',
        text: 'Deny access to everyone and handle it alone',
        description: 'Keep the treasure vault completely secure',
        consequence: 'neutral',
        reasoning: 'Very secure but may create crew resentment and slow operations'
      },
      {
        id: 'investigate-first',
        text: 'Investigate the suspicious activities before deciding',
        description: 'Look into the strange behavior before granting access',
        consequence: 'safe',
        evidenceRequired: ['recent-activity'],
        reasoning: 'Understanding risks before granting access prevents insider threats'
      }
    ],
    correctActionId: 'grant-silver-only',
    forensicReport: {
      whatHappened: 'Pete was secretly working with the Navy to locate your treasure, and Jake was a planted spy. Granting them access would have led to capture.',
      whyItWorked: 'Following security policies and trusting proven loyalty over convenience prevented betrayal.',
      realWorldImpact: 'The Target breach involved a contractor with access they shouldn\'t have had, leading to 40+ million stolen credit cards.',
      prevention: [
        'Implement least-privilege access - only what\'s needed for the job',
        'Require background checks and service time before sensitive access',
        'Monitor for signs of financial distress or suspicious behavior',
        'Regular access reviews to remove unnecessary permissions'
      ]
    },
    concept: 'Insider Threat Prevention & Access Control',
    difficulty: 'detective',
    xpReward: 200,
    toolRewards: ['access-auditor'],
    era: 'era-2010'
  },
  {
    id: 'snapchat-ceo-heist',
    title: 'The Great Identity Heist',
    theme: 'detective',
    realWorldIncident: 'Snapchat CEO Impersonation Payroll Scam',
    storySetup: 'You are Detective Alex Morgan, head of Digital Crimes Unit at Scotland Yard. A major financial corporation has reported a potential million-pound fraud.',
    situation: 'The CFO of MegaCorp received an urgent email from someone claiming to be the CEO, requesting immediate transfer of employee payroll data for a "confidential acquisition." The message came during the CEO\'s vacation, and HR is pressuring for quick action to avoid delaying paychecks. You must determine if this is legitimate before millions disappear...',
    evidence: [
      {
        id: 'suspicious-email',
        type: 'email',
        name: 'CEO Email Request',
        content: 'From: ceo@megac0rp-group.com\nTo: cfo@megacorp.com\nSubject: URGENT - Payroll Data Needed\n\n"Sarah,\n\nFor the acquisition we discussed, I need all employee payroll data sent immediately. This is highly confidential. Send to: secure-docs@tempmail.net\n\nRegards,\nJohn"\n\nSent from my iPhone',
        suspicious: true,
        clues: ['Note the "0" instead of "o" in domain', 'Temporary email for sensitive data', 'Unusual urgency for CEO']
      },
      {
        id: 'ceo-calendar',
        type: 'log',
        name: 'CEO Travel Schedule',
        content: 'CEO John Williams Schedule:\n- Location: Private island, no internet\n- Return Date: Next Monday\n- Emergency Contact: Personal assistant only\n- Note: Specifically requested no business contact during vacation',
        clues: ['CEO has no internet access', 'Requested no business contact', 'Would not be sending emails']
      },
      {
        id: 'company-domain',
        type: 'certificate',
        name: 'Official Company Email Domain',
        content: 'MegaCorp Official Domain: megacorp.com\nSecurity Certificate: Valid\nEmail Format: firstname.lastname@megacorp.com\nCEO Official Email: john.williams@megacorp.com',
        clues: ['Real domain has no hyphens or numbers', 'CEO has official email format']
      },
      {
        id: 'hr-policy',
        type: 'file',
        name: 'Data Sharing Policy',
        content: 'MegaCorp Data Protection Policy:\n- Payroll data requires board approval\n- Never send sensitive data to external emails\n- All requests must be verified through multiple channels\n- CEO always uses digital signature for data requests',
        clues: ['Board approval required', 'External emails prohibited', 'Digital signature missing']
      }
    ],
    actions: [
      {
        id: 'send-data-immediately',
        text: 'Advise CFO to send the payroll data as requested',
        description: 'The CEO needs this urgently for business',
        consequence: 'risky',
        reasoning: 'This would give criminals access to all employee personal and financial data'
      },
      {
        id: 'verify-through-assistant',
        text: 'Contact CEO\'s assistant to verify the request',
        description: 'Use the official emergency contact to confirm',
        consequence: 'safe',
        evidenceRequired: ['ceo-calendar'],
        reasoning: 'Verifying through official channels would reveal this is fake'
      },
      {
        id: 'send-partial-data',
        text: 'Send only partial data to test legitimacy',
        description: 'Send a small sample to see if it\'s really needed',
        consequence: 'risky',
        reasoning: 'Any data sent to criminals helps them with future attacks'
      },
      {
        id: 'demand-digital-signature',
        text: 'Require CEO\'s digital signature before proceeding',
        description: 'Follow company policy for data requests',
        consequence: 'safe',
        evidenceRequired: ['hr-policy'],
        reasoning: 'Company policies exist specifically to prevent these attacks'
      }
    ],
    correctActionId: 'verify-through-assistant',
    forensicReport: {
      whatHappened: 'Cybercriminals impersonated the CEO to steal payroll data containing personal information of 50,000 employees.',
      whyItWorked: 'They exploited authority bias and time pressure, knowing people hesitate to question the "CEO."',
      realWorldImpact: 'The real Snapchat CEO impersonation scam resulted in thousands of employee W-2 forms being stolen.',
      prevention: [
        'Verify unusual requests through separate communication channels',
        'Implement digital signatures for sensitive data requests',
        'Train staff to question authority when policies aren\'t followed',
        'Never send sensitive data to external or temporary email addresses'
      ]
    },
    concept: 'CEO Fraud & Social Engineering Prevention',
    difficulty: 'detective',
    xpReward: 250,
    toolRewards: ['threat-detector'],
    era: 'era-2020'
  },
  {
    id: 'neural-net-invasion',
    title: 'The Neural Network Invasion',
    theme: 'cyberpunk',
    realWorldIncident: 'AI-Generated Deepfake CEO Fraud',
    storySetup: 'You are a Cyber-Samurai in Neo-Tokyo 2035, protecting the Quantum Bank from AI-powered threats.',
    situation: 'The bank\'s AI defense system alerts you to an incoming video call from the Bank Director, demanding immediate access to the Quantum Vault containing 100 million digital credits. However, your Neural Scanner is detecting anomalies in the video feed. The fate of the financial district depends on your decision...',
    evidence: [
      {
        id: 'video-analysis',
        type: 'metadata',
        name: 'Video Call Analysis',
        content: 'Video Quality: 4K Ultra HD\nFrame Rate: Slightly inconsistent (29.7 fps vs standard 30 fps)\nLip Sync: 0.3 second delay detected\nEye Movement: Repetitive blinking pattern\nBackground: Director\'s office (correct)\nVoice Pattern: 97.3% match to Director\'s voice print',
        suspicious: true,
        clues: ['Frame rate inconsistency suggests artificial generation', 'Lip sync delay is common in deepfakes', 'Repetitive patterns indicate AI generation']
      },
      {
        id: 'director-location',
        type: 'log',
        name: 'Director\'s Schedule',
        content: 'Director Sarah Chen Location Tracker:\nCurrent Status: In neural-link surgery\nLocation: Cyber-Medical Center, Underground Level 7\nCommunication: Blocked for 6 hours\nSurgery Type: Memory enhancement implant\nNext Available: Tomorrow 0800 hours',
        clues: ['Director is in surgery and cannot communicate', 'Underground location blocks all signals']
      },
      {
        id: 'vault-protocols',
        type: 'file',
        name: 'Quantum Vault Security Protocols',
        content: 'Vault Access Requirements:\n1. Biometric scan + Neural signature\n2. Physical presence required (no remote access)\n3. Two-person authorization minimum\n4. Emergency access only during system breach\n5. All access logged to Blockchain ledger',
        clues: ['Physical presence required', 'No remote access allowed', 'Two-person authorization needed']
      },
      {
        id: 'ai-threat-alert',
        type: 'log',
        name: 'AI Threat Detection System',
        content: 'ALERT: Deepfake Generation Detected\nSource: External neural network\nConfidence: 94.7%\nThreat Level: Critical\nRecommendation: Verify identity through physical presence\nSimilar attacks detected across the district today',
        clues: ['High confidence deepfake detection', 'Similar attacks happening elsewhere', 'Physical verification recommended']
      }
    ],
    actions: [
      {
        id: 'grant-vault-access',
        text: 'Grant immediate vault access to the Director',
        description: 'Trust the Director and unlock the Quantum Vault',
        consequence: 'risky',
        reasoning: 'Granting access to a deepfake would allow criminals to steal 100 million credits'
      },
      {
        id: 'verify-neural-signature',
        text: 'Demand in-person neural signature verification',
        description: 'Require physical presence as per security protocols',
        consequence: 'safe',
        evidenceRequired: ['vault-protocols', 'director-location'],
        reasoning: 'Physical verification would expose the deepfake since the real Director is in surgery'
      },
      {
        id: 'partial-access-test',
        text: 'Grant limited access to test if it\'s really the Director',
        description: 'Give access to a small vault to verify identity',
        consequence: 'risky',
        reasoning: 'Any access to criminals helps them understand the system for future attacks'
      },
      {
        id: 'run-deepfake-analysis',
        text: 'Run advanced AI analysis on the video feed',
        description: 'Use the bank\'s AI to detect if this is artificial',
        consequence: 'safe',
        evidenceRequired: ['video-analysis', 'ai-threat-alert'],
        reasoning: 'AI analysis would confirm this is a deepfake and prevent the theft'
      }
    ],
    correctActionId: 'verify-neural-signature',
    forensicReport: {
      whatHappened: 'Cybercriminals used advanced AI to create a deepfake video of the Director, attempting to steal 100 million credits.',
      whyItWorked: 'They exploited trust in video calls and urgency, but security protocols prevented the theft.',
      realWorldImpact: 'Deepfake CEO fraud is emerging as a major threat, with cases already reported in multiple countries.',
      prevention: [
        'Implement multi-factor authentication for high-value transactions',
        'Require physical presence for critical financial operations',
        'Deploy AI detection systems to identify deepfakes',
        'Train staff to recognize signs of artificial media manipulation'
      ]
    },
    concept: 'Deepfake Detection & Future AI Threats',
    difficulty: 'expert',
    xpReward: 300,
    toolRewards: ['threat-detector', 'firewall-patch'],
    era: 'era-2035'
  }
];

export const getMissionsByEra = (eraId: string): Mission[] => {
  return missions.filter(mission => mission.era === eraId);
};

export const getMissionById = (id: string): Mission | undefined => {
  return missions.find(mission => mission.id === id);
};