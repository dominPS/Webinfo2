import React from 'react';

interface IconProps {
  width?: number;
  height?: number;
  fill?: string;
}

// Map Registrations - Location pin icon
export const MapRegistrationsIcon: React.FC<IconProps> = ({ width = 20, height = 20, fill = "white" }) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill={fill}>
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
  </svg>
);

// Employee Evaluation - Clipboard with checkmark
export const EmployeeEvaluationIcon: React.FC<IconProps> = ({ width = 20, height = 20, fill = "white" }) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill={fill}>
    <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm-2 14l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/>
  </svg>
);

// Monthly Summary - Bar chart icon
export const MonthlySummaryIcon: React.FC<IconProps> = ({ width = 20, height = 20, fill = "white" }) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill={fill}>
    <path d="M5 9.2h3V19H5zM10.6 5h2.8v14h-2.8zm5.6 8H19v6h-2.8z"/>
  </svg>
);

// Exams and Training - Graduation cap icon
export const ExamsTrainingIcon: React.FC<IconProps> = ({ width = 20, height = 20, fill = "white" }) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill={fill}>
    <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z"/>
  </svg>
);

// Settlement - Money/Dollar icon
export const SettlementIcon: React.FC<IconProps> = ({ width = 20, height = 20, fill = "white" }) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill={fill}>
    <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/>
  </svg>
);

// Absence Plan - Calendar with X
export const AbsencePlanIcon: React.FC<IconProps> = ({ width = 20, height = 20, fill = "white" }) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill={fill}>
    <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM8.5 15.5l2-2 2 2 1.41-1.41L12.5 12.5 10.91 10.91 8.5 13.32l-1.41-1.41L5.68 13.32 8.5 15.5z"/>
  </svg>
);

// Monthly Absence Plan - Calendar with clock
export const MonthlyAbsencePlanIcon: React.FC<IconProps> = ({ width = 20, height = 20, fill = "white" }) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill={fill}>
    <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zm-7-4c1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3 1.34 3 3 3zm0-4.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5-1.5-.67-1.5-1.5.67-1.5 1.5-1.5z"/>
  </svg>
);

// Schedule - Clock icon
export const ScheduleIcon: React.FC<IconProps> = ({ width = 20, height = 20, fill = "white" }) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill={fill}>
    <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/>
    <path d="M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
  </svg>
);

// Projects Activities - Folder with gear
export const ProjectsActivitiesIcon: React.FC<IconProps> = ({ width = 20, height = 20, fill = "white" }) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill={fill}>
    <path d="M10 4H4c-1.11 0-2 .89-2 2v12c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2h-8l-2-2zm6.5 10c0 .28-.22.5-.5.5h-1v1c0 .28-.22.5-.5.5s-.5-.22-.5-.5v-1h-1c-.28 0-.5-.22-.5-.5s.22-.5.5-.5h1v-1c0-.28.22-.5.5-.5s.5.22.5.5v1h1c.28 0 .5.22.5.5z"/>
  </svg>
);

// Employee Review - Person with star
export const EmployeeReviewIcon: React.FC<IconProps> = ({ width = 20, height = 20, fill = "white" }) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill={fill}>
    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
    <path d="M18 8l1.25 2.75L22 12l-2.75 1.25L18 16l-1.25-2.75L14 12l2.75-1.25z"/>
  </svg>
);
