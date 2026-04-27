const IconDashboard = ({ className = 'w-5 h-5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
    {/* Outer frame */}
    <rect x="1" y="2" width="22" height="20" rx="2" strokeWidth="1.5" />

    {/* Pie chart (left) */}
    <circle cx="7.5" cy="10" r="4" strokeWidth="1.5" />
    <line x1="7.5" y1="10" x2="7.5" y2="6"   strokeWidth="1.2" />
    <line x1="7.5" y1="10" x2="11" y2="12"    strokeWidth="1.2" />

    {/* Dot-list rows (top right) */}
    <circle cx="13.8" cy="6.5"  r="0.6" fill="currentColor" stroke="none" />
    <line x1="15.2" y1="6.5"  x2="21.5" y2="6.5"  strokeWidth="1.2" />
    <circle cx="13.8" cy="9"    r="0.6" fill="currentColor" stroke="none" />
    <line x1="15.2" y1="9"    x2="21.5" y2="9"    strokeWidth="1.2" />
    <circle cx="13.8" cy="11.5" r="0.6" fill="currentColor" stroke="none" />
    <line x1="15.2" y1="11.5" x2="19.5" y2="11.5" strokeWidth="1.2" />

    {/* Bar chart baseline */}
    <line x1="13" y1="20.5" x2="22.5" y2="20.5" strokeWidth="1.2" />
    {/* Bars */}
    <rect x="13.5" y="18"   width="1.6" height="2.5" strokeWidth="1.2" />
    <rect x="15.8" y="16"   width="1.6" height="4.5" strokeWidth="1.2" />
    <rect x="18.1" y="14"   width="1.6" height="6.5" strokeWidth="1.2" />
    <rect x="20.4" y="15.5" width="1.6" height="5"   strokeWidth="1.2" />
    {/* Trend line */}
    <polyline points="14.3,17 16.6,14.5 18.9,12.5 21.2,13.5" strokeWidth="1.2" />

    {/* Dot-list rows (bottom left) */}
    <circle cx="2.5" cy="16.5" r="0.6" fill="currentColor" stroke="none" />
    <line x1="3.9" y1="16.5" x2="9.5" y2="16.5" strokeWidth="1.2" />
    <circle cx="2.5" cy="19.5" r="0.6" fill="currentColor" stroke="none" />
    <line x1="3.9" y1="19.5" x2="9.5" y2="19.5" strokeWidth="1.2" />
  </svg>
);

export default IconDashboard;
