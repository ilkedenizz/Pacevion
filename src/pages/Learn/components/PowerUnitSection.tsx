import React from 'react';

const PowerUnitSection: React.FC = () => {
  return (
    <section className="lkc-section lkc-power" id="power">
      <div className="lkc-power-header lkc-reveal">
        <h2 className="lkc-section-title">V6 TURBO<br/>HYBRID</h2>
        <p className="lkc-section-subtitle">2026 SPECIFICATION</p>
      </div>

      <div className="lkc-power-grid lkc-reveal" style={{ transitionDelay: '0.1s' }}>
        <div className="lkc-power-card">
          <div className="lkc-power-card-inner">
            <h3>ICE</h3>
            <p>1.6L V6 Internal Combustion Engine producing ~400kW. Runs entirely on 100% sustainable drop-in fuel.</p>
          </div>
        </div>
        <div className="lkc-power-card">
          <div className="lkc-power-card-inner">
            <h3>MGU-K</h3>
            <p>Motor Generator Unit - Kinetic. Harvests energy under braking, deploying a massive 350kW (470hp) of electrical boost.</p>
          </div>
        </div>
        <div className="lkc-power-card">
          <div className="lkc-power-card-inner">
            <h3>BATTERY</h3>
            <p>High-capacity Energy Store holding the harvested kinetic energy for deployment on straights.</p>
          </div>
        </div>
        <div className="lkc-power-card">
          <div className="lkc-power-card-inner">
            <h3>TURBO</h3>
            <p>Forces compressed air into the ICE. (Note: The complex MGU-H has been removed for the 2026 regulations to simplify the power unit).</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PowerUnitSection;
