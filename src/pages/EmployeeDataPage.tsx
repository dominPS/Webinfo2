import React, { useCallback, useState } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    CircularProgress,
    Alert,
    Paper,
    useTheme,
    useMediaQuery,
    Skeleton,
    Chip,
    FormControlLabel,
    Button,
    Collapse,
    Switch,
    IconButton,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction
} from '@mui/material';

import { EmailConsentComponent, type EmailConsentFormData } from '@/components/worker/EmailConsentComponent';
import { WorkerInfoComponent } from '@/components/worker/WorkerInfoComponent';
import { ZoneChangeComponent } from '@/components/worker/ZoneChangeComponent';
import { OrderChangeComponent } from '@/components/worker/OrderChangeComponent';
import { BeginEndPartial } from '@/components/worker/BeginEndPartial';
import { useWorker } from '@/hooks/useWorker';
import type { WorkerModel } from '@/schemas/WorkerModel';
import { useTranslation } from 'react-i18next';
import PersonIcon from '@mui/icons-material/Person';
import SecurityIcon from '@mui/icons-material/Security';
import WorkIcon from '@mui/icons-material/Work';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AssignmentIcon from '@mui/icons-material/Assignment';

// ...existing code from your WorkerPage (as provided above)...

// Interface for component visibility settings
interface ComponentVisibility {
    emailConsent: boolean;
    personalInfo: boolean;
    timeRegistration: boolean;
    zoneChange: boolean;
    orderChange: boolean;
}

// ...

// Interface for component order
interface ComponentOrderItem {
    type: 'emailConsent' | 'personalInfo' | 'timeRegistration' | 'zoneChange' | 'orderChange';
    title: string;
    icon: React.ReactNode;
    visible: boolean;
}

const WorkerInfoSkeleton: React.FC = () => {
    const theme = useTheme();
    return (
        <Card elevation={1} sx={{ borderRadius: 1, backgroundColor: theme.palette.background.paper }}>
            <CardContent sx={{ p: 0 }}>
                {Array.from({ length: 6 }).map((_, index) => (
                    <Box key={index} sx={{ display: 'flex', p: 1, borderBottom: `1px solid ${theme.palette.divider}` }}>
                        <Skeleton variant="text" width="40%" sx={{ mr: 2 }} />
                        <Skeleton variant="text" width="60%" />
                    </Box>
                ))}
            </CardContent>
        </Card>
    );
};

const ErrorDisplay: React.FC<{ error: Error; onRetry?: () => void }> = ({ error, onRetry }) => {
    const { t } = useTranslation();
    return (
        <Alert
            severity="error"
            sx={{ mb: 2 }}
            action={
                onRetry && (
                    <Chip
                        label={t('Common.Retry', 'Ponów')}
                        onClick={onRetry}
                        color="error"
                        variant="outlined"
                    />
                )
            }
        >
            <Typography variant="body1">
                {t('Common.Error', 'Błąd')}: {error.message}
            </Typography>
        </Alert>
    );
};

// LayoutControls module removed

export const EmployeeDataPage: React.FC = () => {
    // ...przeniesiona logika z WorkerPage...
    const { data, error, isLoading, refetch } = useWorker();
    const { t } = useTranslation();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [visibility, setVisibility] = useState<ComponentVisibility>({
        emailConsent: true,
        personalInfo: true,
        timeRegistration: true,
        zoneChange: true,
        orderChange: true
    });
    // layout state removed
    const [componentOrder, setComponentOrder] = useState<ComponentOrderItem[]>([
        {
            type: 'emailConsent',
            title: t('Worker.EmailConsent', 'Zgody email i kontakt'),
            icon: <SecurityIcon fontSize="small" />,
            visible: true
        },
        {
            type: 'personalInfo',
            title: t('Worker.PersonalInfo', 'Informacje osobowe'),
            icon: <PersonIcon fontSize="small" />,
            visible: true
        },
        {
            type: 'timeRegistration',
            title: t('Worker.TimeRegistration', 'Rejestracja czasu pracy'),
            icon: <WorkIcon fontSize="small" />,
            visible: true
        },
        {
            type: 'zoneChange',
            title: t('Worker.ZoneChange', 'Zmiana strefy pracy'),
            icon: <LocationOnIcon fontSize="small" />,
            visible: true
        },
        {
            type: 'orderChange',
            title: t('Worker.OrderChange', 'Zmiana zlecenia'),
            icon: <AssignmentIcon fontSize="small" />,
            visible: true
        }
    ]);
    const [refreshKey, setRefreshKey] = useState(0);
    const handleVisibilityToggle = (component: keyof ComponentVisibility) => {
        setVisibility(prev => {
            const newVisibility = { ...prev, [component]: !prev[component] };
            setComponentOrder(prevOrder =>
                prevOrder.map(item =>
                    item.type === component
                        ? { ...item, visible: newVisibility[component] }
                        : item
                )
            );
            return newVisibility;
        });
        setRefreshKey(prev => prev + 1);
    };
    // handleLayoutChange removed
    const handleComponentOrderChange = (newOrder: ComponentOrderItem[]) => {
        setComponentOrder(newOrder);
        setRefreshKey(prev => prev + 1);
    };
    const handleRegistration = useCallback((params: string) => {
        console.log('Registration params:', params);
    }, []);
    const handleEmailConsentSave = useCallback(async (formData: EmailConsentFormData) => {
        console.log('Email consent data:', formData);
        try {
            refetch();
        } catch (error) {
            console.error('Error saving email consent:', error);
            throw error;
        }
    }, [refetch]);
    const handleZoneChange = useCallback((params: string) => {
        console.log('Zone change params:', params);
        refetch();
    }, [refetch]);
    const handleOrderChange = useCallback((params: string) => {
        console.log('Order change params:', params);
        refetch();
    }, [refetch]);
    const handleEndActivity = useCallback((params: string) => {
        console.log('End activity params:', params);
        refetch();
    }, [refetch]);
    const handleRetry = useCallback(() => {
        refetch();
    }, [refetch]);
    // getComponentGridSize and componentGridSize removed
    const visibleComponents = componentOrder.filter(item => item.visible);
    if (isLoading) {
        return (
            <Box>
                <Box>
                    <Skeleton variant="rectangular" />
                </Box>
                <Box>
                    <Box>
                        <WorkerInfoSkeleton />
                    </Box>
                    <Box>
                        <Skeleton variant="rectangular" />
                    </Box>
                </Box>
            </Box>
        );
    }
    if (error) {
        return (
            <Box>
                <ErrorDisplay error={error} onRetry={handleRetry} />
            </Box>
        );
    }
    if (!data) {
        return (
            <Box>
                <Alert severity="info">
                    <Typography>
                        {t('Common.NoData', 'Brak danych')}
                    </Typography>
                    <Typography>
                        {t('Worker.NoWorkerData', 'Nie znaleziono danych pracownika')}
                    </Typography>
                </Alert>
            </Box>
        );
    }
    return (
        <Box sx={{ pt: '20px' }}>
            <Paper sx={{ mb: '10px' }}>
                <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight={120}>
                    <Typography 
                        sx={{ fontFamily: 'Roboto, Arial, sans-serif', fontWeight: 700, fontSize: { xs: 24, md: 32 } }}
                        gutterBottom
                    >
                        {t('Worker.PageTitle', 'Dane pracownika')}
                    </Typography>
                    {data.Name && data.Surname && (
                        <Typography
                            sx={{ fontFamily: 'Roboto, Arial, sans-serif', fontWeight: 400, fontSize: { xs: 12, md: 18 } }}
                        >
                            {data.Name} {data.Surname}
                        </Typography>
                    )}
                </Box>
            </Paper>
            <Box key={refreshKey}>
                {/* Render three worker components in one row */}
                {(() => {
                    const personalInfoComponent = visibleComponents.find(c => c.type === 'personalInfo');
                    const emailConsentComponent = visibleComponents.find(c => c.type === 'emailConsent');
                    const timeRegistrationComponent = visibleComponents.find(c => c.type === 'timeRegistration');
                    
                    // If we have all three main components, render them in one row
                    if (personalInfoComponent && emailConsentComponent && timeRegistrationComponent) {
                        return (
                            <Box key={`worker-components-row-${refreshKey}`} display="flex" gap={1.5} alignItems="stretch" mb={2.5} sx={{ maxWidth: '100%' }}>
                                {/* Informacje osobowe - 30% width */}
                                <Box flex="0 0 30%" display="flex" flexDirection="column">
                                    <Card sx={{ 
                                        height: '524px', 
                                        borderRadius: '18px',
                                        '& .MuiCardContent-root': {
                                            padding: '24px',
                                            height: '100%',
                                            display: 'flex',
                                            flexDirection: 'column'
                                        }
                                    }}>
                                        <CardContent>
                                            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', fontSize: '1rem' }}>
                                                <Box component="span" mr={1} display="flex" alignItems="center">
                                                    {personalInfoComponent.icon}
                                                </Box>
                                                {t(personalInfoComponent.title, personalInfoComponent.title)}
                                            </Typography>
                                            <Box sx={{ flex: 1, overflow: 'auto' }}>
                                                <WorkerInfoComponent data={data} />
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Box>

                                {/* Zgody email i kontakt - 40% width */}
                                <Box flex="0 0 40%" display="flex" flexDirection="column">
                                    <Card sx={{ 
                                        height: '524px', 
                                        borderRadius: '18px',
                                        '& .MuiCardContent-root': {
                                            padding: '24px',
                                            height: '100%',
                                            display: 'flex',
                                            flexDirection: 'column'
                                        }
                                    }}>
                                        <CardContent>
                                            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', fontSize: '1rem' }}>
                                                <Box component="span" mr={1} display="flex" alignItems="center">
                                                    {emailConsentComponent.icon}
                                                </Box>
                                                {t(emailConsentComponent.title, emailConsentComponent.title)}
                                            </Typography>
                                            <Box sx={{ flex: 1, overflow: 'auto' }}>
                                                <EmailConsentComponent data={data} onSave={handleEmailConsentSave} />
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Box>

                                {/* Rejestracja czasu pracy - 30% width */}
                                <Box flex="0 0 30%" display="flex" flexDirection="column">
                                    <Card sx={{ 
                                        height: '524px', 
                                        borderRadius: '18px',
                                        '& .MuiCardContent-root': {
                                            padding: '24px',
                                            height: '100%',
                                            display: 'flex',
                                            flexDirection: 'column'
                                        }
                                    }}>
                                        <CardContent>
                                            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', fontSize: '1rem' }}>
                                                <Box component="span" mr={1} display="flex" alignItems="center">
                                                    {timeRegistrationComponent.icon}
                                                </Box>
                                                {t(timeRegistrationComponent.title, timeRegistrationComponent.title)}
                                            </Typography>
                                            <Box sx={{ flex: 1, overflow: 'auto' }}>
                                                <BeginEndPartial data={data} onRegistration={handleRegistration} />
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Box>
                            </Box>
                        );
                    }
                    
                    // Fallback for other components or missing components
                    const items = [];
                    let i = 0;
                    while (i < visibleComponents.length) {
                        const curr = visibleComponents[i];
                        
                        // Skip the three main components if they were already rendered above
                        if (personalInfoComponent && emailConsentComponent && timeRegistrationComponent &&
                            (curr.type === 'personalInfo' || curr.type === 'emailConsent' || curr.type === 'timeRegistration')) {
                            i++;
                            continue;
                        }
                        
                        let content;
                        switch (curr.type) {
                            case 'zoneChange':
                                content = (
                                    <ZoneChangeComponent data={data} onZoneChange={handleZoneChange} />
                                );
                                break;
                            case 'orderChange':
                                content = (
                                    <OrderChangeComponent data={data} onOrderChange={handleOrderChange} onEndActivity={handleEndActivity} bigMode={false} />
                                );
                                break;
                            default:
                                content = null;
                        }
                        
                        if (content) {
                            items.push(
                                <Box key={`${curr.type}-${refreshKey}`} mb={2.5}>
                                    <Card sx={{ borderRadius: '18px' }}>
                                        <CardContent sx={{ padding: '30px' }}>
                                            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                                                <Box component="span" mr={1} display="flex" alignItems="center">
                                                    {curr.icon}
                                                </Box>
                                                {t(curr.title, curr.title)}
                                            </Typography>
                                            {content}
                                        </CardContent>
                                    </Card>
                                </Box>
                            );
                        }
                        i++;
                    }
                    return items;
                })()}
            </Box>
        </Box>
    );
};

export default EmployeeDataPage;
