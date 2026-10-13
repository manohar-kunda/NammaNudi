import React from 'react';
import {
  BusIcon,
  ShoppingBagIcon,
  HeartPulseIcon,
  BriefcaseIcon,
  UtensilsIcon,
  ChevronRightIcon,
} from './Icons';

const ICON_MAP = {
  'bus': BusIcon,
  'shopping-bag': ShoppingBagIcon,
  'heart-pulse': HeartPulseIcon,
  'briefcase': BriefcaseIcon,
  'utensils': UtensilsIcon,
};

const KANNADA_SUBTITLES = {
  transport: 'ಸಾರಿಗೆ • Autos, buses & metro',
  shopping: 'ಮಾರುಕಟ್ಟೆ • Markets & stores',
  healthcare: 'ಆರೋಗ್ಯ • Clinics & pharmacies',
  workplace: 'ಕಚೇರಿ • Office & colleagues',
  restaurant: 'ಹೋಟೆಲ್ • Darshinis & dining',
};

export function ScenarioCard({ scenario, onSelect }) {
  const IconComponent = ICON_MAP[scenario.icon] || BusIcon;
  const subtitle = KANNADA_SUBTITLES[scenario.slug] || `${scenario.phraseCount} phrases`;

  return (
    <button
      type="button"
      className="card scenario-card"
      onClick={() => onSelect(scenario)}
    >
      <div className="scenario-icon-box" aria-hidden="true">
        <IconComponent size={24} />
      </div>
      <div className="scenario-info">
        <div className="scenario-title">
          <span>{scenario.title}</span>
        </div>
        <div className="scenario-count kn-text">
          {subtitle} • {scenario.phraseCount} phrases
        </div>
      </div>
      <ChevronRightIcon className="text-subtle" size={20} />
    </button>
  );
}
