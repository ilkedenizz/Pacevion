import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronDown } from 'lucide-react';
import './LearnF1.css';

const TOPICS = [
  { title: 'Front Wing', desc: 'Generates downforce and manages airflow around the car' },
  { title: 'Rear Wing', desc: 'Provides rear downforce and includes DRS mechanism' },
  { title: 'Power Unit', desc: '1.6L V6 turbo hybrid engine producing over 1000HP' },
  { title: 'Tyres', desc: 'Pirelli supplies five dry-weather compounds' },
  { title: 'Monocoque', desc: 'Carbon fiber survival cell protecting the driver' },
  { title: 'HALO', desc: 'Titanium head protection device mandatory since 2018' },
  { title: 'DRS', desc: 'Drag Reduction System for overtaking assistance' },
  { title: 'Aerodynamics', desc: 'Complex aero surfaces generate up to 3.5G cornering force' }
];

const LearnF1: React.FC = () => {
  const navigate = useNavigate();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleTopic = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="learn-page">
      <header className="learn-header">
        <button className="back-btn" onClick={() => navigate(-1)} aria-label="Go back">
          <ChevronLeft size={24} />
        </button>
        <h1>LEARN F1</h1>
      </header>

      <div className="topics-list">
        {TOPICS.map((topic, idx) => (
          <div 
            key={idx} 
            className={`topic-card ${openIndex === idx ? 'open' : ''}`}
          >
            <button 
              className="topic-card-header" 
              onClick={() => toggleTopic(idx)}
              aria-expanded={openIndex === idx}
            >
              <h2>{topic.title}</h2>
              <ChevronDown 
                size={20} 
                className={`topic-chevron ${openIndex === idx ? 'rotated' : ''}`} 
              />
            </button>
            <div 
              className="topic-card-content"
              style={{ maxHeight: openIndex === idx ? '100px' : '0px' }}
            >
              <p>{topic.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LearnF1;
