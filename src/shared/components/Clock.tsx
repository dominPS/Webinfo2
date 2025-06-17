import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';

const ClockContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  color: white;
  font-weight: 500;
`;

const TimeDisplay = styled.div`
  font-size: 28px;
  font-weight: 600;
  letter-spacing: 1px;
  margin-bottom: 4px;
`;

const DateDisplay = styled.div`
  font-size: 14px;
  opacity: 0.9;
  font-weight: 400;
`;

export const Clock: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-GB', {
      timeZone: 'Europe/Berlin', // CET timezone
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-GB', {
      timeZone: 'Europe/Berlin', // CET timezone
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <ClockContainer>
      <TimeDisplay>{formatTime(currentTime)}</TimeDisplay>
      <DateDisplay>{formatDate(currentTime)}</DateDisplay>
    </ClockContainer>
  );
};
