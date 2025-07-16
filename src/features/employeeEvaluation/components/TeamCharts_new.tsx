import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Area,
  AreaChart,
  Legend
} from 'recharts';
import './TeamCharts.css';

interface Employee {
  id: string;
  name: string;
  position: string;
  department: string;
  hasAnnualReview: boolean;
  hasIDPPlan: boolean;
  reviewStatus: 'not_started' | 'in_progress' | 'completed' | 'requires_correction';
  idpStatus: 'not_started' | 'draft' | 'submitted' | 'approved';
}

interface TeamChartsProps {
  teamMembers: Employee[];
}

const TeamCharts: React.FC<TeamChartsProps> = ({ teamMembers }) => {
  const { t } = useTranslation();

  // Color palette based on the current theme
  const colors = {
    primary: '#126678',
    secondary: '#0f5459',
    tertiary: '#1a7a8a',
    accent: '#2dd4bf',
    success: '#059669',
    warning: '#d97706',
    error: '#dc2626',
    neutral: '#6b7280',
    light: '#f8fafc',
    gradient: ['#126678', '#0f5459', '#1a7a8a', '#2dd4bf', '#059669']
  };

  // Process data for charts
  const getReviewStatusData = () => {
    const statusCounts = teamMembers.reduce((acc, member) => {
      acc[member.reviewStatus] = (acc[member.reviewStatus] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(statusCounts).map(([status, count], index) => ({
      name: t(`evaluation.status.review.${status}`, status.replace('_', ' ')),
      value: count,
      color: colors.gradient[index % colors.gradient.length]
    }));
  };

  const getIdpStatusData = () => {
    const statusCounts = teamMembers.reduce((acc, member) => {
      acc[member.idpStatus] = (acc[member.idpStatus] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(statusCounts).map(([status, count], index) => ({
      name: t(`evaluation.status.idp.${status}`, status.replace('_', ' ')),
      value: count,
      color: colors.gradient[index % colors.gradient.length]
    }));
  };

  const getDepartmentData = () => {
    const departmentCounts = teamMembers.reduce((acc, member) => {
      acc[member.department] = (acc[member.department] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(departmentCounts).map(([department, count]) => ({
      department,
      members: count,
      completed: teamMembers.filter(m => m.department === department && m.reviewStatus === 'completed').length,
      inProgress: teamMembers.filter(m => m.department === department && m.reviewStatus === 'in_progress').length,
      notStarted: teamMembers.filter(m => m.department === department && m.reviewStatus === 'not_started').length
    }));
  };

  const getProgressTrendData = () => {
    // Mock trend data - in real app this would come from API
    return [
      { month: 'Sty', completed: 2, inProgress: 1, planned: 4 },
      { month: 'Lut', completed: 3, inProgress: 2, planned: 4 },
      { month: 'Mar', completed: 4, inProgress: 1, planned: 4 },
      { month: 'Kwi', completed: 4, inProgress: 2, planned: 4 },
      { month: 'Maj', completed: 5, inProgress: 1, planned: 4 },
      { month: 'Cze', completed: 6, inProgress: 0, planned: 4 }
    ];
  };

  const reviewStatusData = getReviewStatusData();
  const idpStatusData = getIdpStatusData();
  const departmentData = getDepartmentData();
  const trendData = getProgressTrendData();

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          backgroundColor: 'white',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          padding: '12px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          maxWidth: '200px',
          fontSize: '12px',
          lineHeight: '1.4'
        }}>
          {label && <p style={{ margin: '0 0 8px 0', fontWeight: 600, color: '#374151' }}>{label}</p>}
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ margin: '4px 0', color: entry.color, wordWrap: 'break-word' }}>
              <span style={{ fontWeight: 500 }}>{entry.name}:</span> {entry.value}
              {entry.payload && entry.payload.percent && ` (${(entry.payload.percent * 100).toFixed(0)}%)`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (!teamMembers || teamMembers.length === 0) {
    return (
      <div className="team-charts">
        <div className="team-charts__no-data">
          <h3 className="team-charts__no-data-title">Brak danych</h3>
          <p className="team-charts__no-data-description">
            Nie ma członków zespołu do wyświetlenia wykresów.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="team-charts">
      <div className="team-charts__container">
        {/* Review Status Pie Chart */}
        <div className="team-charts__chart-card">
          <h3 className="team-charts__chart-title">
            <div className="team-charts__chart-icon">📊</div>
            Status ocen rocznych
          </h3>
          <p className="team-charts__chart-description">
            Rozkład statusów ocen rocznych w zespole
          </p>
          <div className="team-charts__chart-wrapper">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={reviewStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {reviewStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
                  layout="horizontal"
                  align="center"
                  verticalAlign="bottom"
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* IDP Status Pie Chart */}
        <div className="team-charts__chart-card">
          <h3 className="team-charts__chart-title">
            <div className="team-charts__chart-icon">📈</div>
            Status planów IDP
          </h3>
          <p className="team-charts__chart-description">
            Postęp w tworzeniu indywidualnych planów rozwoju
          </p>
          <div className="team-charts__chart-wrapper">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={idpStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {idpStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
                  layout="horizontal"
                  align="center"
                  verticalAlign="bottom"
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Department Performance Bar Chart */}
        <div className="team-charts__chart-card">
          <h3 className="team-charts__chart-title">
            <div className="team-charts__chart-icon">🏢</div>
            Wydajność według działów
          </h3>
          <p className="team-charts__chart-description">
            Porównanie postępów w ocenach między działami
          </p>
          <div className="team-charts__chart-wrapper">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={departmentData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="department" 
                  tick={{ fontSize: 11 }}
                  interval={0}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="completed" stackId="a" fill={colors.success} name="Ukończone" />
                <Bar dataKey="inProgress" stackId="a" fill={colors.warning} name="W trakcie" />
                <Bar dataKey="notStarted" stackId="a" fill={colors.neutral} name="Nierozpoczęte" />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Progress Trend Area Chart */}
        <div className="team-charts__chart-card">
          <h3 className="team-charts__chart-title">
            <div className="team-charts__chart-icon">📊</div>
            Trend postępów
          </h3>
          <p className="team-charts__chart-description">
            Miesięczny postęp w realizacji ocen zespołu
          </p>
          <div className="team-charts__chart-wrapper">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="completed"
                  stackId="1"
                  stroke={colors.success}
                  fill={colors.success}
                  fillOpacity={0.8}
                  name="Ukończone"
                />
                <Area
                  type="monotone"
                  dataKey="inProgress"
                  stackId="1"
                  stroke={colors.warning}
                  fill={colors.warning}
                  fillOpacity={0.6}
                  name="W trakcie"
                />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Team Performance Timeline */}
      <div className="team-charts__full-width-chart">
        <h3 className="team-charts__chart-title">
          <div className="team-charts__chart-icon">⏱️</div>
          Linia czasu wydajności zespołu
        </h3>
        <p className="team-charts__chart-description">
          Szczegółowa analiza postępów zespołu na przestrzeni czasu
        </p>
        <div className="team-charts__chart-wrapper" style={{ height: '400px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="completed"
                stroke={colors.success}
                strokeWidth={3}
                dot={{ fill: colors.success, strokeWidth: 2, r: 6 }}
                name="Ukończone oceny"
              />
              <Line
                type="monotone"
                dataKey="inProgress"
                stroke={colors.warning}
                strokeWidth={3}
                dot={{ fill: colors.warning, strokeWidth: 2, r: 6 }}
                name="Oceny w trakcie"
              />
              <Line
                type="monotone"
                dataKey="planned"
                stroke={colors.primary}
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ fill: colors.primary, strokeWidth: 2, r: 4 }}
                name="Planowane"
              />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default TeamCharts;
