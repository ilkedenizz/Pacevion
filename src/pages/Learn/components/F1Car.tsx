/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';

const F1Car: React.FC<{ t: any; id?: string }> = ({ t, id }) => {
  return (
    <section id={id} className="learn-section">
      <div className="learn-section-header">
        <span className="section-num">06</span>
        <h2 className="section-title">{t.carTitle}</h2>
      </div>

      <div style={{ position: 'relative', width: '100%', height: '300px', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {/* We will just use a schematic representation instead of a complex SVG to keep it simple and avoid external deps */}
        <div style={{ width: '80%', height: '80px', backgroundColor: '#333', margin: '0 auto', position: 'relative', borderRadius: '4px' }}>
           <div style={{ position: 'absolute', left: '-20px', top: '30px', width: '30px', height: '20px', backgroundColor: 'var(--color-accent)' }}>FRONT WING</div>
           <div style={{ position: 'absolute', right: '-20px', top: '10px', width: '30px', height: '40px', backgroundColor: 'var(--color-accent)' }}>REAR WING</div>
           <div style={{ position: 'absolute', left: '50%', top: '-20px', width: '60px', height: '20px', backgroundColor: '#555', transform: 'translateX(-50%)' }}>HALO</div>
           <div style={{ position: 'absolute', left: '20px', top: '40px', width: '30px', height: '50px', backgroundColor: '#111', borderRadius: '50%' }}>FRONT TYRE</div>
           <div style={{ position: 'absolute', right: '20px', top: '40px', width: '40px', height: '60px', backgroundColor: '#111', borderRadius: '50%' }}>REAR TYRE</div>
           <div style={{ position: 'absolute', left: '30%', top: '20px', width: '60px', height: '50px', backgroundColor: '#444' }}>SIDEPODS</div>
        </div>
      </div>
      <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginTop: 'var(--space-4)', textAlign: 'center' }}>
        * Abstract schematic of an F1 car aerodynamics.
      </p>
    </section>
  );
};

export default F1Car;