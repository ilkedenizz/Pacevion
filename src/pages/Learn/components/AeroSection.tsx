import React from 'react';
import { ASSETS } from '../../../data/assets';

const AeroSection: React.FC = () => {
  return (
    <section className="lkc-section lkc-aero" id="aero">
      <div className="lkc-aero-grid">
        <div className="lkc-aero-visual lkc-reveal">
          <img src={ASSETS.learn.aerodynamics} alt="F1 Aerodynamics" loading="lazy" />
        </div>
        <div className="lkc-aero-content lkc-reveal" style={{ transitionDelay: '0.1s' }}>
          <h2 className="lkc-section-title">AERODYNAMICS</h2>
          <p className="lkc-section-subtitle">THE SCIENCE OF DOWNFORCE</p>
          <p className="lkc-aero-desc">
            Airflow manipulation dictates cornering potential. An F1 car is essentially an upside-down airplane, using aerodynamic surfaces to push the tyres into the track.
          </p>
          
          <div className="lkc-info-cards">
            <div className="lkc-info-card">
              <h3>FRONT WING</h3>
              <p>Directs airflow around the front tyres and under the floor. The first point of contact with the air.</p>
            </div>
            <div className="lkc-info-card">
              <h3>FLOOR & DIFFUSER</h3>
              <p>Venturi tunnels create massive suction (Ground Effect) with minimal drag penalty.</p>
            </div>
            <div className="lkc-info-card">
              <h3>REAR WING & ACTIVE AERO</h3>
              <p>Produces rear downforce. 2026 introduces Z-Mode (corners) and X-Mode (straights) to dynamically shed drag.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AeroSection;
