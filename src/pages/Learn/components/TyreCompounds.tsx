import React from 'react';

const TyreCompounds: React.FC = () => {
  return (
    <section className="lkc-section lkc-tyres" id="tyres">
      <div className="lkc-tyres-header lkc-reveal">
        <h2 className="lkc-section-title">TYRE COMPOUNDS</h2>
        <p className="lkc-section-subtitle">THE ONLY CONTACT PATCH</p>
      </div>

      <div className="lkc-tyres-grid lkc-reveal" style={{ transitionDelay: '0.1s' }}>
        <div className="lkc-tyre-card soft">
          <div className="lkc-tyre-visual">
            <div className="tyre-ring soft-ring"></div>
          </div>
          <h3>SOFT</h3>
          <ul>
            <li><strong>GRIP:</strong> Maximum</li>
            <li><strong>LIFESPAN:</strong> Shortest</li>
            <li><strong>USE:</strong> Qualifying, late-race sprints</li>
            <li><strong>TEMP:</strong> High operating window</li>
          </ul>
        </div>

        <div className="lkc-tyre-card medium">
          <div className="lkc-tyre-visual">
            <div className="tyre-ring medium-ring"></div>
          </div>
          <h3>MEDIUM</h3>
          <ul>
            <li><strong>GRIP:</strong> Balanced</li>
            <li><strong>LIFESPAN:</strong> Moderate</li>
            <li><strong>USE:</strong> Main race stints</li>
            <li><strong>TEMP:</strong> Wide operating window</li>
          </ul>
        </div>

        <div className="lkc-tyre-card hard">
          <div className="lkc-tyre-visual">
            <div className="tyre-ring hard-ring"></div>
          </div>
          <h3>HARD</h3>
          <ul>
            <li><strong>GRIP:</strong> Lowest</li>
            <li><strong>LIFESPAN:</strong> Longest</li>
            <li><strong>USE:</strong> 1-stop strategies, abrasive tracks</li>
            <li><strong>TEMP:</strong> Hard to warm up</li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default TyreCompounds;
