import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Car, BookOpen, Bell, ChevronRight } from 'lucide-react';
import './More.css';

const moreItems = [
  { path: '/drivers', icon: <Users size={24} />, label: 'DRIVERS', desc: 'Driver profiles and media' },
  { path: '/cars', icon: <Car size={24} />, label: 'CONSTRUCTORS', desc: 'Team information' },
  { path: '/learn', icon: <BookOpen size={24} />, label: 'LEARN F1', desc: 'Technical guides' }
];

const More: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="more-page">
      <div className="more-header">
        <h1 className="more-title">MORE</h1>
        <p className="more-subtitle">Explore Pacevion</p>
      </div>

      <div className="more-list">
        {moreItems.map((item, idx) => (
          <div key={idx} className="more-list-item" onClick={() => navigate(item.path)}>
            <div className="mli-icon">{item.icon}</div>
            <div className="mli-content">
              <span className="mli-label">{item.label}</span>
              <span className="mli-desc">{item.desc}</span>
            </div>
            <ChevronRight size={20} className="mli-arrow" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default More;
