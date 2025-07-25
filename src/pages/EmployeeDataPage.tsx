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
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import DragHandleIcon from '@mui/icons-material/DragHandle';
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

// Interface for layout settings
interface LayoutSettings {
    fullWidth: boolean;
    compactMode: boolean;
    componentsInRow: number;
}

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

const LayoutControls: React.FC<{
    visibility: ComponentVisibility;
    layout: LayoutSettings;
    componentOrder: ComponentOrderItem[];
    onVisibilityToggle: (component: keyof ComponentVisibility) => void;
    onLayoutChange: (settings: Partial<LayoutSettings>) => void;
    onComponentOrderChange: (newOrder: ComponentOrderItem[]) => void;
}> = ({ visibility, layout, componentOrder, onVisibilityToggle, onLayoutChange, onComponentOrderChange }) => {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const moveComponent = (index: number, direction: 'up' | 'down') => {
        const newOrder = [...componentOrder];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        if (targetIndex >= 0 && targetIndex < newOrder.length) {
            [newOrder[index], newOrder[targetIndex]] = [newOrder[targetIndex], newOrder[index]];
            onComponentOrderChange(newOrder);
        }
    };
    return (
        <Box sx={{ mb: 2 }}>
            <Button
                variant="outlined"
                size="small"
                onClick={() => setIsOpen(!isOpen)}
                startIcon={<VisibilityIcon />}
                endIcon={isOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                sx={{ mb: 1 }}
            >
                {t('Worker.LayoutControls', 'Ustawienia układu')}
            </Button>
            <Collapse in={isOpen}>
                <Paper sx={{ p: 2, backgroundColor: 'rgba(0,0,0,0.02)' }}>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                        {/* Show/Hide Sections */}
                        <Box sx={{ flex: '1 1 220px', minWidth: 200, maxWidth: 350 }}>
                            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                                {t('Worker.ShowHideSections', 'Pokaż/ukryj sekcje')}:
                            </Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                                <FormControlLabel
                                    control={<Switch checked={visibility.emailConsent} onChange={() => onVisibilityToggle('emailConsent')} size="small" />}
                                    label={<Typography variant="caption">{t('Worker.EmailConsent', 'Zgody email i kontakt')}</Typography>}
                                />
                                <FormControlLabel
                                    control={<Switch checked={visibility.personalInfo} onChange={() => onVisibilityToggle('personalInfo')} size="small" />}
                                    label={<Typography variant="caption">{t('Worker.PersonalInfo', 'Informacje osobowe')}</Typography>}
                                />
                                <FormControlLabel
                                    control={<Switch checked={visibility.timeRegistration} onChange={() => onVisibilityToggle('timeRegistration')} size="small" />}
                                    label={<Typography variant="caption">{t('Worker.TimeRegistration', 'Rejestracja czasu pracy')}</Typography>}
                                />
                                <FormControlLabel
                                    control={<Switch checked={visibility.zoneChange} onChange={() => onVisibilityToggle('zoneChange')} size="small" />}
                                    label={<Typography variant="caption">{t('Worker.ZoneChange', 'Zmiana strefy pracy')}</Typography>}
                                />
                                <FormControlLabel
                                    control={<Switch checked={visibility.orderChange} onChange={() => onVisibilityToggle('orderChange')} size="small" />}
                                    label={<Typography variant="caption">{t('Worker.OrderChange', 'Zmiana zlecenia')}</Typography>}
                                />
                            </Box>
                        </Box>
                        {/* Layout Options */}
                        <Box sx={{ flex: '1 1 220px', minWidth: 200, maxWidth: 350 }}>
                            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                                {t('Worker.LayoutOptions', 'Opcje układu')}:
                            </Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                                <FormControlLabel
                                    control={<Switch checked={layout.fullWidth} onChange={(e) => onLayoutChange({ fullWidth: e.target.checked })} size="small" />}
                                    label={<Typography variant="caption">{t('Worker.FullWidth', 'Pełna szerokość')}</Typography>}
                                />
                                <FormControlLabel
                                    control={<Switch checked={layout.compactMode} onChange={(e) => onLayoutChange({ compactMode: e.target.checked })} size="small" />}
                                    label={<Typography variant="caption">{t('Worker.CompactMode', 'Tryb kompaktowy')}</Typography>}
                                />
                            </Box>
                        </Box>
                        {/* Components Per Row */}
                        <Box sx={{ flex: '1 1 180px', minWidth: 160, maxWidth: 250 }}>
                            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                                {t('Worker.ComponentsPerRow', 'Komponenty w rzędzie')}:
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                {[1, 2, 3].map((num) => (
                                    <Button
                                        key={num}
                                        variant={layout.componentsInRow === num ? "contained" : "outlined"}
                                        size="small"
                                        onClick={() => onLayoutChange({ componentsInRow: num })}
                                        sx={{ minWidth: '32px', fontSize: '10pt' }}
                                    >
                                        {num}
                                    </Button>
                                ))}
                            </Box>
                        </Box>
                        {/* Component Order */}
                        <Box sx={{ flex: '1 1 220px', minWidth: 200, maxWidth: 350 }}>
                            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                                {t('Worker.ComponentOrder', 'Kolejność komponentów')}:
                            </Typography>
                            <Paper variant="outlined" sx={{ maxHeight: 200, overflow: 'auto' }}>
                                <List dense>
                                    {componentOrder.map((item, index) => (
                                        <ListItem
                                            key={item.type}
                                            sx={{ py: 0.5, opacity: item.visible ? 1 : 0.5, backgroundColor: item.visible ? 'transparent' : 'rgba(0,0,0,0.05)' }}
                                        >
                                            <DragHandleIcon sx={{ mr: 1, color: 'text.secondary', fontSize: '1rem' }} />
                                            <Box sx={{ color: 'primary.main', mr: 1 }}>
                                                {item.icon}
                                            </Box>
                                            <ListItemText
                                                primary={<Typography variant="caption" sx={{ fontSize: '11px' }}>{item.title}</Typography>}
                                                sx={{ flex: 1, minWidth: 0 }}
                                            />
                                            <ListItemSecondaryAction>
                                                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                                    <IconButton size="small" onClick={() => moveComponent(index, 'up')} disabled={index === 0} sx={{ p: 0.2 }}>
                                                        <ArrowUpwardIcon sx={{ fontSize: '12px' }} />
                                                    </IconButton>
                                                    <IconButton size="small" onClick={() => moveComponent(index, 'down')} disabled={index === componentOrder.length - 1} sx={{ p: 0.2 }}>
                                                        <ArrowDownwardIcon sx={{ fontSize: '12px' }} />
                                                    </IconButton>
                                                </Box>
                                            </ListItemSecondaryAction>
                                        </ListItem>
                                    ))}
                                </List>
                            </Paper>
                        </Box>
                    </Box>
                </Paper>
            </Collapse>
        </Box>
    );
};

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
    const [layout, setLayout] = useState<LayoutSettings>({
        fullWidth: true,
        compactMode: false,
        componentsInRow: 2
    });
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
    const handleLayoutChange = (settings: Partial<LayoutSettings>) => {
        setLayout(prev => ({ ...prev, ...settings }));
        setRefreshKey(prev => prev + 1);
    };
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
    const getComponentGridSize = () => {
        if (isMobile) return 12;
        switch (layout.componentsInRow) {
            case 1: return 12;
            case 2: return 6;
            case 3: return 4;
            default: return 6;
        }
    };
    const componentGridSize = getComponentGridSize();
    const visibleComponents = componentOrder.filter(item => item.visible);
    if (isLoading) {
        return (
            <Box sx={{ width: layout.fullWidth ? '100%' : '1200px', maxWidth: '100%', mx: layout.fullWidth ? 0 : 'auto', px: layout.fullWidth ? 2 : 3, py: 2 }}>
                <Box sx={{ mb: 2 }}>
                    <Skeleton variant="rectangular" height={layout.compactMode ? 40 : 60} sx={{ borderRadius: 1 }} />
                </Box>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: layout.compactMode ? 8 : 16 }}>
                    <Box sx={{ flex: '1 1 300px', minWidth: 260, maxWidth: 600 }}>
                        <WorkerInfoSkeleton />
                    </Box>
                    <Box sx={{ flex: '1 1 300px', minWidth: 260, maxWidth: 600 }}>
                        <Skeleton variant="rectangular" height={layout.compactMode ? 200 : 300} sx={{ borderRadius: 1 }} />
                    </Box>
                </Box>
            </Box>
        );
    }
    if (error) {
        return (
            <Box sx={{ width: layout.fullWidth ? '100%' : '1200px', maxWidth: '100%', mx: layout.fullWidth ? 0 : 'auto', px: layout.fullWidth ? 2 : 3, py: 2 }}>
                <ErrorDisplay error={error} onRetry={handleRetry} />
            </Box>
        );
    }
    if (!data) {
        return (
            <Box sx={{ width: layout.fullWidth ? '100%' : '1200px', maxWidth: '100%', mx: layout.fullWidth ? 0 : 'auto', px: layout.fullWidth ? 2 : 3, py: 2 }}>
                <Alert severity="info" sx={{ textAlign: 'center' }}>
                    <Typography variant="h6" gutterBottom>
                        {t('Common.NoData', 'Brak danych')}
                    </Typography>
                    <Typography variant="body2">
                        {t('Worker.NoWorkerData', 'Nie znaleziono danych pracownika')}
                    </Typography>
                </Alert>
            </Box>
        );
    }
    const containerSx = {
        width: layout.fullWidth ? '100%' : '1200px',
        maxWidth: '100%',
        mx: layout.fullWidth ? 0 : 'auto',
        px: layout.fullWidth ? 2 : 3,
        py: layout.compactMode ? 1 : 2
    };
    return (
        <Box sx={containerSx}>
            <Paper elevation={1} sx={{ mb: layout.compactMode ? 2 : 3, p: layout.compactMode ? 1.5 : 2, background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`, color: theme.palette.common.white, borderRadius: 1 }}>
                <Typography variant={layout.compactMode ? "h6" : "h5"} component="h1" sx={{ fontWeight: 400, fontFamily: "'Segoe UI Light', 'Open Sans', Verdana, Arial, Helvetica, sans-serif", mb: 0.5 }}>
                    {t('Worker.PageTitle', 'Dane pracownika')}
                </Typography>
                {data.Name && data.Surname && (
                    <Typography variant={layout.compactMode ? "body2" : "subtitle1"} sx={{ opacity: 0.9, fontWeight: 300 }}>
                        {data.Name} {data.Surname}
                    </Typography>
                )}
            </Paper>
            <LayoutControls
                visibility={visibility}
                layout={layout}
                componentOrder={componentOrder}
                onVisibilityToggle={handleVisibilityToggle}
                onLayoutChange={handleLayoutChange}
                onComponentOrderChange={handleComponentOrderChange}
            />
            <Box key={refreshKey} sx={{ display: 'flex', flexWrap: 'wrap', gap: layout.compactMode ? 8 : 16 }}>
                {visibleComponents.map((comp, index) => {
                    let content;
                    switch (comp.type) {
                        case 'emailConsent':
                            content = (
                                <EmailConsentComponent data={data} onSave={handleEmailConsentSave} />
                            );
                            break;
                        case 'personalInfo':
                            content = <WorkerInfoComponent data={data} />;
                            break;
                        case 'timeRegistration':
                            content = (
                                <Box sx={{ p: layout.compactMode ? 1 : 2 }}>
                                    <BeginEndPartial data={data} onRegistration={handleRegistration} />
                                </Box>
                            );
                            break;
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
                            return null;
                    }
                    return (
                        <Box key={`${comp.type}-${refreshKey}`} sx={{ flex: `1 1 ${componentGridSize * 8.33}%`, minWidth: 260, maxWidth: 600, mb: 2 }}>
                            <Card elevation={1} sx={{ height: 'fit-content', borderRadius: 1, transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out', '&:hover': { transform: 'translateY(-1px)', boxShadow: theme.shadows[2] } }}>
                                <CardContent sx={{ p: 0 }}>
                                    <Box sx={{ p: layout.compactMode ? 1 : 1.5, backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : theme.palette.grey[50], borderBottom: `1px solid ${theme.palette.divider}` }}>
                                        <Typography variant="subtitle1" component="h2" sx={{ fontWeight: 600, color: theme.palette.primary.main, display: 'flex', alignItems: 'center', gap: 0.5, fontSize: layout.compactMode ? '0.8rem' : '0.9rem' }}>
                                            {comp.icon}
                                            {comp.title}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ p: comp.type === 'emailConsent' ? 1 : undefined }}>
                                        {content}
                                    </Box>
                                </CardContent>
                            </Card>
                        </Box>
                    );
                })}
            </Box>
        </Box>
    );
};

export default EmployeeDataPage;
