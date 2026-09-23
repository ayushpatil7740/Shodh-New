import React from 'react';
import { Users, Package, CheckCircle, HelpCircle, FileText, TrendingUp, AlertTriangle } from 'lucide-react';
import StatCard from '../common/StatCard';

export const AdminStatWidgets = ({ analytics }) => {
  if (!analytics) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="Total Reports"
        value={analytics.totalItems || 0}
        subtitle={`${analytics.totalLost || 0} Lost / ${analytics.totalFound || 0} Found`}
        icon={Package}
        color="brand"
      />
      <StatCard
        title="Resolved Cases"
        value={analytics.totalResolved || 0}
        subtitle={`${analytics.resolutionRate || 0}% Recovery rate`}
        icon={CheckCircle}
        color="emerald"
        trend={<span className="text-emerald-600 font-semibold">↑ Verified returns</span>}
      />
      <StatCard
        title="Claims Submitted"
        value={analytics.totalClaims || 0}
        subtitle={`${analytics.pendingClaims || 0} Pending / ${analytics.approvedClaims || 0} Approved`}
        icon={FileText}
        color="purple"
      />
      <StatCard
        title="Active Users"
        value={analytics.totalUsers || 0}
        subtitle="Registered community members"
        icon={Users}
        color="blue"
      />
    </div>
  );
};

export default AdminStatWidgets;
