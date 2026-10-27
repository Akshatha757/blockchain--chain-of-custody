import React from 'react';
import { CheckCircle2, AlertTriangle, Clock, Shield, Database, Lock } from 'lucide-react';

export default function StatusBadge({ status, size = 'normal', showIcon = true }) {
  const normalized = (status || '').toUpperCase();

  const config = {
    VERIFIED: {
      label: 'Integrity Verified',
      icon: CheckCircle2,
      className: 'badge-verified'
    },
    MISMATCH: {
      label: 'Integrity Mismatch',
      icon: AlertTriangle,
      className: 'badge-mismatch'
    },
    PENDING: {
      label: 'Pending Verification',
      icon: Clock,
      className: 'badge-pending'
    },
    'OFF-CHAIN (DEMO RECORD)': {
      label: 'Off-Chain (Demo)',
      icon: Database,
      className: 'badge-demo'
    },
    'LOCAL DEMO': {
      label: 'Local Demo',
      icon: Shield,
      className: 'badge-demo'
    },
    OPERATIONAL: {
      label: 'Operational',
      icon: CheckCircle2,
      className: 'badge-verified'
    },
    'NOT CONNECTED': {
      label: 'Not Connected',
      icon: Lock,
      className: 'badge-neutral'
    }
  };

  const item = config[normalized] || {
    label: status || 'Unknown',
    icon: Shield,
    className: 'badge-neutral'
  };

  const Icon = item.icon;

  return (
    <span 
      className={`badge ${item.className}`}
      style={{ fontSize: size === 'small' ? '0.7rem' : '0.75rem' }}
    >
      {showIcon && <Icon size={size === 'small' ? 12 : 14} />}
      <span>{item.label}</span>
    </span>
  );
}
