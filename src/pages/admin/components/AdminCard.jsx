import React from 'react';
import '../components/AdminGlobal.css';

export default function AdminCard({ title, icon: Icon, iconColor, subtitle, children }) {
  return (
    <div className="admin-card">
      {title && (
        <h3 className="admin-card-title">
          {Icon && <Icon size={18} color={iconColor} />} 
          {title}
        </h3>
      )}
      {subtitle && <p className="admin-chart-subtitle">{subtitle}</p>}
      
      {/* O children renderiza o que for colocado dentro do componente */}
      {children}
    </div>
  );
}