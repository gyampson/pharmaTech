// GlassCard.jsx component
import './GlassCard.css';

const index = ({ children, variant = 'default', className = '' }) => {
  const variantClass = variant !== 'default' ? `glass-card-${variant}` : '';
  
  return (
    <div className={`glass-card ${variantClass} ${className}`}>
      <div className="glass-card-content">
        {children}
      </div>
    </div>
  );
};

export default index;