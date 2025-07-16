import React from 'react';
import { useTranslation } from 'react-i18next';

const LeaderAnnualReviewHistory: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div style={{
      padding: '24px',
      backgroundColor: 'white',
      borderRadius: '12px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif'
    }}>
      <h2 style={{
        fontSize: '24px',
        fontWeight: '600',
        color: '#126678',
        marginBottom: '16px',
        marginTop: '0'
      }}>
        Historia ocen zespołu
      </h2>
      
      <div style={{
        textAlign: 'center',
        padding: '40px 20px',
        color: '#6b7280'
      }}>
        <h3 style={{
          fontSize: '18px',
          color: '#374151',
          marginBottom: '8px',
          marginTop: '0'
        }}>
          Historia ocen rocznych
        </h3>
        <p style={{
          fontSize: '14px',
          margin: '0',
          marginBottom: '20px'
        }}>
          Tutaj będzie wyświetlana historia ocen rocznych członków zespołu.
        </p>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginTop: '24px'
        }}>
          <div style={{
            backgroundColor: '#f8fafc',
            borderRadius: '8px',
            padding: '16px',
            textAlign: 'center',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{
              fontSize: '24px',
              fontWeight: '700',
              color: '#126678',
              marginBottom: '4px'
            }}>12</div>
            <div style={{
              fontSize: '12px',
              color: '#6b7280',
              fontWeight: '500'
            }}>UKOŃCZONE OCENY</div>
          </div>
          
          <div style={{
            backgroundColor: '#f8fafc',
            borderRadius: '8px',
            padding: '16px',
            textAlign: 'center',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{
              fontSize: '24px',
              fontWeight: '700',
              color: '#126678',
              marginBottom: '4px'
            }}>3</div>
            <div style={{
              fontSize: '12px',
              color: '#6b7280',
              fontWeight: '500'
            }}>W TRAKCIE</div>
          </div>
          
          <div style={{
            backgroundColor: '#f8fafc',
            borderRadius: '8px',
            padding: '16px',
            textAlign: 'center',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{
              fontSize: '24px',
              fontWeight: '700',
              color: '#126678',
              marginBottom: '4px'
            }}>8</div>
            <div style={{
              fontSize: '12px',
              color: '#6b7280',
              fontWeight: '500'
            }}>CZŁONKÓW ZESPOŁU</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaderAnnualReviewHistory;
