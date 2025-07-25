import React, { useState, useMemo } from 'react';
import {
    Box,
    Table,
    TableBody,
    TableRow,
    TableCell,
    Typography,
    useTheme,
    Button,
    TextField,
    InputAdornment,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Chip,
    Alert,
    LinearProgress
} from '@mui/material';
import {
    Assignment as AssignmentIcon,
    Work as WorkIcon,
    Search as SearchIcon,
    ExpandMore as ExpandMoreIcon,
    LocationOn as LocationOnIcon,
    Login as LoginIcon,
    Block as BlockIcon,
    ExitToApp as ExitIcon,
    Schedule as ScheduleIcon
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import type { WorkerModel } from '../../schemas/WorkerModel';

interface OrderChangeComponentProps {
    data: WorkerModel;
    onOrderChange?: (params: string) => void;
    onEndActivity?: (params: string) => void;
    bigMode?: boolean;
}

interface OrderItem {
    id: number;
    code: string;
    name: string;
    number: number;
    isAvailable: boolean;
    isCurrent: boolean;
}

interface ActivityItem {
    id: number;
    code: string;
    name: string;
    shortName: string;
    number: number;
    detailNumber: number;
    orderNumber: number;
    isAvailable: boolean;
    isCurrent: boolean;
}

export const OrderChangeComponent: React.FC<OrderChangeComponentProps> = ({ 
    data, 
    onOrderChange,
    onEndActivity,
    bigMode = false
}) => {
    const { t } = useTranslation();
    const theme = useTheme();
    const [orderFilter, setOrderFilter] = useState('');
    const [detailFilter, setDetailFilter] = useState('');
    const [activityFilter, setActivityFilter] = useState('');

    // Mock data - w rzeczywisto�ci pochodzi�oby z WorkerModel
    const bulkOrders: OrderItem[] = useMemo(() => [
        { id: 1, code: 'BULK001', name: 'Projekt zbiorczy A', number: 1001, isAvailable: true, isCurrent: false },
        { id: 2, code: 'BULK002', name: 'Projekt zbiorczy B', number: 1002, isAvailable: true, isCurrent: true },
        { id: 3, code: 'BULK003', name: 'Projekt zbiorczy C (niedost�pny)', number: 1003, isAvailable: false, isCurrent: false }
    ], []);

    const orders: OrderItem[] = useMemo(() => [
        { id: 1, code: 'ORD001', name: 'Rozw�j aplikacji mobilnej', number: 2001, isAvailable: true, isCurrent: false },
        { id: 2, code: 'ORD002', name: 'Implementacja systemu CRM', number: 2002, isAvailable: true, isCurrent: true },
        { id: 3, code: 'ORD003', name: 'Modernizacja infrastruktury IT', number: 2003, isAvailable: true, isCurrent: false },
        { id: 4, code: 'ORD004', name: 'Projekt niedost�pny', number: 2004, isAvailable: false, isCurrent: false }
    ], []);

    const details: OrderItem[] = useMemo(() => [
        { id: 1, code: 'DET001', name: 'Frontend aplikacji', number: 3001, isAvailable: true, isCurrent: false },
        { id: 2, code: 'DET002', name: 'Backend API', number: 3002, isAvailable: true, isCurrent: true },
        { id: 3, code: 'DET003', name: 'Baza danych', number: 3003, isAvailable: true, isCurrent: false }
    ], []);

    const activities: ActivityItem[] = useMemo(() => [
        { id: 1, code: 'ACT001', name: 'Programowanie komponent�w React', shortName: 'React Dev', number: 4001, detailNumber: 3001, orderNumber: 2002, isAvailable: true, isCurrent: false },
        { id: 2, code: 'ACT002', name: 'Testowanie funkcjonalno�ci', shortName: 'Testing', number: 4002, detailNumber: 3002, orderNumber: 2002, isAvailable: true, isCurrent: true },
        { id: 3, code: 'ACT003', name: 'Code Review i dokumentacja', shortName: 'Review', number: 4003, detailNumber: 3002, orderNumber: 2002, isAvailable: true, isCurrent: false }
    ], []);

    const handleOrderClick = (type: 'bulk' | 'order' | 'detail' | 'activity', item: OrderItem | ActivityItem) => {
        if (!onOrderChange || !item.isAvailable) return;

        const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
        const scheduleDate = data.WorkerRegModel?.Schedule?.[0]?.Date || new Date().toISOString().split('T')[0];

        let params = '';
        switch (type) {
            case 'bulk':
                params = `bulk=${item.name};bulkId=${item.id};bulkNb=${item.number};gen=${timestamp};id=${scheduleDate};`;
                break;
            case 'order':
                params = `order=${item.name};orderId=${item.id};orderNb=${item.number};gen=${timestamp};id=${scheduleDate};`;
                break;
            case 'detail':
                params = `detailNb=${item.number};orderNb=${data.WorkerRegModel?.CurrentOrderNb || 0};gen=${timestamp};id=${scheduleDate};`;
                break;
            case 'activity':
                const actItem = item as ActivityItem;
                params = `activityId=${actItem.id};activityNb=${actItem.number};detailNb=${actItem.detailNumber};orderNb=${actItem.orderNumber};gen=${timestamp};id=${scheduleDate};`;
                break;
        }
        onOrderChange(params);
    };

    const handleEndActivity = () => {
        if (!onEndActivity) return;
        
        const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
        const scheduleDate = data.WorkerRegModel?.Schedule?.[0]?.Date || new Date().toISOString().split('T')[0];
        const currentActivity = activities.find(a => a.isCurrent);
        
        if (currentActivity) {
            const params = `id=${scheduleDate};mode=wyjOrder;gen=${timestamp};idActivity=${currentActivity.id}`;
            onEndActivity(params);
        }
    };

    const filterItems = <T extends OrderItem | ActivityItem>(items: T[], filter: string): T[] => {
        if (!filter) return items;
        return items.filter(item => 
            item.code.toLowerCase().includes(filter.toLowerCase()) ||
            item.name.toLowerCase().includes(filter.toLowerCase())
        );
    };

    const renderCurrentStatus = () => {
        if (data.IsBeginAvailable) {
            return (
                <Typography variant="body2" color="text.secondary">
                    {t('Schedule.CurrentlyYourNotWorking', 'Obecnie nie pracujesz')}
                </Typography>
            );
        } else if (data.IsEndAvailable) {
            const currentOrder = data.WorkerRegModel?.CurrentOrder_Detail_Activity;
            let currentOrderFrom = data.WorkerRegModel?.CurrentOrderFrom;
            // Ensure currentOrderFrom is a string for comparison
            let currentOrderFromStr: string = '';
            if (currentOrderFrom instanceof Date) {
                if (!isNaN(currentOrderFrom.getTime())) {
                    currentOrderFromStr = currentOrderFrom.toISOString();
                }
            } else if (typeof currentOrderFrom === 'string') {
                currentOrderFromStr = currentOrderFrom;
            } else if (typeof currentOrderFrom !== 'undefined') {
                currentOrderFromStr = String(currentOrderFrom);
            }
            let fromTime: string;
            if (
                currentOrderFromStr &&
                currentOrderFromStr !== '0001-01-01T00:00:00'
            ) {
                const dateObj = new Date(currentOrderFromStr);
                if (!isNaN(dateObj.getTime())) {
                    fromTime = dateObj.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' });
                } else {
                    fromTime = t('Common.BrakDanych', 'Brak danych');
                }
            } else {
                fromTime = t('Common.BrakDanych', 'Brak danych');
            }

            return (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <WorkIcon color="primary" fontSize="small" />
                        <Typography variant="body2">
                            {t('Schedule.CurrentlyYourWorkingOn', 'Obecnie pracujesz nad')}{' '}
                            <Typography component="span" fontWeight="bold">
                                {currentOrder || 'Nieznane zadanie'}
                            </Typography>
                            , {t('Common.From', 'Od')}: {' '}
                            <Typography component="span" fontWeight="bold">
                                {fromTime}
                            </Typography>
                        </Typography>
                    </Box>
                    {onEndActivity && (
                        <Button
                            variant="contained"
                            color="warning"
                            size="small"
                            startIcon={<ExitIcon />}
                            onClick={handleEndActivity}
                            disabled={data.NonRCPReader}
                            sx={{ ml: 2 }}
                        >
                            {t('Buttons.EndActivity', 'Zako�cz dzia�anie')}
                        </Button>
                    )}
                </Box>
            );
        } else {
            return (
                <Typography variant="body2" color="warning.main">
                    {t('Worker.LogInInOfficeHours', 'Zaloguj si� w godzinach pracy')}
                </Typography>
            );
        }
    };

    const renderOrderButtons = (items: OrderItem[], type: 'bulk' | 'order' | 'detail', filter: string) => {
        const filteredItems = filterItems(items, filter);

        if (filteredItems.length === 0) {
            return (
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                    {filter ? t('WorkerZone.NoItemsMatchFilter', 'Brak element�w pasuj�cych do filtra') : t('WorkerZone.NoAvailableItems', 'Brak dost�pnych element�w')}
                </Typography>
            );
        }

        return (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, p: 1 }}>
                {filteredItems.map((item) => {
                    const buttonSize = bigMode ? { width: 300, height: 40, fontSize: '14pt' } : { width: 180, fontSize: '11pt' };
                    return (
                        <Box key={item.id} sx={{ flex: '1 1 180px', minWidth: 180, maxWidth: bigMode ? 300 : 220 }}>
                            <Button
                                fullWidth
                                variant={item.isCurrent ? "contained" : "outlined"}
                                color={item.isCurrent ? "success" : item.isAvailable ? "primary" : "error"}
                                size="small"
                                startIcon={
                                    item.isCurrent ? <LocationOnIcon /> :
                                    item.isAvailable ? <LoginIcon /> : <BlockIcon />
                                }
                                onClick={() => handleOrderClick(type, item)}
                                disabled={!item.isAvailable || !onOrderChange}
                                sx={{
                                    textTransform: 'none',
                                    fontWeight: item.isCurrent ? 600 : 400,
                                    py: bigMode ? 1.5 : 0.5,
                                    justifyContent: 'flex-start',
                                    ...buttonSize
                                }}
                            >
                                <Box sx={{ 
                                    display: 'flex', 
                                    flexDirection: 'column', 
                                    alignItems: 'flex-start',
                                    textAlign: 'left',
                                    width: '100%'
                                }}>
                                    <Typography variant="caption" sx={{ fontWeight: 'bold', fontSize: bigMode ? '10pt' : '8pt' }}>
                                        {item.code}
                                    </Typography>
                                    <Typography 
                                        variant="caption" 
                                        sx={{ 
                                            fontSize: bigMode ? '9pt' : '7pt', 
                                            opacity: 0.8,
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap',
                                            maxWidth: '100%'
                                        }}
                                    >
                                        {item.name.length > 50 ? `${item.name.substring(0, 48)}...` : item.name}
                                    </Typography>
                                </Box>
                            </Button>
                        </Box>
                    );
                })}
            </Box>
        );
    };

    const renderActivityButtons = () => {
        const currentOrderNb = data.WorkerRegModel?.CurrentOrderNb;
        const currentDetailNb = data.WorkerRegModel?.CurrentDetailNb;
        
        if (!currentOrderNb || !currentDetailNb) {
            return (
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                    {t('WorkerZone.ChooseProjectToGetToActivityList', 'Wybierz projekt aby uzyska� list� dzia�a�')}
                </Typography>
            );
        }

        const filteredActivities = filterItems(
            activities.filter(a => a.orderNumber === currentOrderNb && a.detailNumber === currentDetailNb),
            activityFilter
        );

        if (filteredActivities.length === 0) {
            return (
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                    {activityFilter ? t('WorkerZone.NoActivitiesMatchFilter', 'Brak dzia�a� pasuj�cych do filtra') : t('WorkerZone.NoAvailableActivities', 'Brak dost�pnych dzia�a�')}
                </Typography>
            );
        }

        return (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, p: 1 }}>
                {filteredActivities.map((activity) => {
                    const buttonSize = bigMode ? { width: 300, height: 40, fontSize: '14pt' } : { width: 180, fontSize: '11pt' };
                    return (
                        <Box key={activity.id} sx={{ flex: '1 1 180px', minWidth: 180, maxWidth: bigMode ? 300 : 220 }}>
                            <Button
                                fullWidth
                                variant={activity.isCurrent ? "contained" : "outlined"}
                                color={activity.isCurrent ? "success" : activity.isAvailable ? "primary" : "error"}
                                size="small"
                                startIcon={
                                    activity.isCurrent ? <LocationOnIcon /> :
                                    activity.isAvailable ? <LoginIcon /> : <BlockIcon />
                                }
                                onClick={() => handleOrderClick('activity', activity)}
                                disabled={!activity.isAvailable || !onOrderChange}
                                sx={{
                                    textTransform: 'none',
                                    fontWeight: activity.isCurrent ? 600 : 400,
                                    py: bigMode ? 1.5 : 0.5,
                                    justifyContent: 'flex-start',
                                    ...buttonSize
                                }}
                            >
                                <Box sx={{ 
                                    display: 'flex', 
                                    flexDirection: 'column', 
                                    alignItems: 'flex-start',
                                    textAlign: 'left',
                                    width: '100%'
                                }}>
                                    <Typography variant="caption" sx={{ fontWeight: 'bold', fontSize: bigMode ? '10pt' : '8pt' }}>
                                        {activity.shortName}
                                    </Typography>
                                    <Typography 
                                        variant="caption" 
                                        sx={{ 
                                            fontSize: bigMode ? '9pt' : '7pt', 
                                            opacity: 0.8,
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap',
                                            maxWidth: '100%'
                                        }}
                                    >
                                        {activity.name}
                                    </Typography>
                                </Box>
                            </Button>
                        </Box>
                    );
                })}
            </Box>
        );
    };

    return (
        <Table
            size="small"
            sx={{
                '& .MuiTableCell-root': {
                    fontFamily: "'Segoe UI Light', 'Open Sans', Verdana, Arial, Helvetica, sans-serif",
                    fontSize: '10pt',
                    fontWeight: 300,
                    letterSpacing: '0.02em',
                    lineHeight: '12pt',
                    padding: '8px 12px',
                    borderBottom: `1px solid ${theme.palette.divider}`,
                    color: theme.palette.text.primary
                }
            }}
        >
            <TableBody>
                {/* Header Row */}
                <TableRow sx={{
                    backgroundColor: theme.palette.mode === 'dark'
                        ? theme.palette.grey[800]
                        : theme.palette.grey[100]
                }}>
                    <TableCell
                        component="th"
                        sx={{
                            fontWeight: 600,
                            color: theme.palette.text.primary
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <AssignmentIcon fontSize="small" color="primary" />
                            {t('Columns.Col_Order', 'Zlecenie')} / {t('Columns.Col_Project', 'Projekt')}
                        </Box>
                    </TableCell>
                </TableRow>

                {/* Current Status Row */}
                <TableRow sx={{
                    backgroundColor: theme.palette.mode === 'dark'
                        ? theme.palette.grey[900]
                        : theme.palette.grey[50]
                }}>
                    <TableCell>
                        {renderCurrentStatus()}
                    </TableCell>
                </TableRow>

                {/* Work Orders Section */}
                {data.IsEndAvailable ? (
                    <>
                        {/* Project Group Info */}
                        {data.OrderGroup && (
                            <TableRow>
                                <TableCell>
                                    <Typography variant="body2" fontWeight="bold">
                                        {t('WorkerZone.YouAreAssignedToProjectGroup', 'Jeste� przypisany do grupy projektowej')}: {data.OrderGroup}
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        )}

                        {/* Instructions */}
                        {onOrderChange && (
                            <TableRow>
                                <TableCell>
                                    <Typography variant="body2" color="info.main">
                                        {t('Worker.ClickToChangeWhatYouAreWorkingOn', 'Kliknij aby zmieni� na czym pracujesz')}
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        )}

                        {/* Daily Report Reminder */}
                        <TableRow sx={{
                            backgroundColor: theme.palette.mode === 'dark'
                                ? theme.palette.grey[900]
                                : theme.palette.grey[50]
                        }}>
                            <TableCell>
                                <Alert severity="warning" sx={{ fontSize: '9pt', py: 0.5 }}>
                                    <Typography variant="caption" sx={{ fontSize: '9pt' }}>
                                        <Typography component="span" fontWeight="bold">
                                            {t('Worker.ReportRequired', 'Wymagany raport')}
                                        </Typography>{' '}
                                        {t('Worker.AfterEnd', 'Po zako�czeniu')}{' '}
                                        <Typography component="span" fontWeight="bold">
                                            {t('Worker.DailyReport', 'Raport dzienny')}
                                        </Typography>
                                    </Typography>
                                </Alert>
                            </TableCell>
                        </TableRow>

                        {/* Bulk Orders */}
                        {bulkOrders.length > 0 && (
                            <>
                                <TableRow>
                                    <TableCell>
                                        <Typography variant="subtitle2" fontWeight="bold">
                                            {t('WorkerZone.BulkOrder', 'Zlecenie zbiorcze')}:
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell sx={{ p: 0 }}>
                                        {renderOrderButtons(bulkOrders, 'bulk', '')}
                                    </TableCell>
                                </TableRow>
                            </>
                        )}

                        {/* Orders */}
                        <TableRow>
                            <TableCell>
                                <Typography variant="subtitle2" fontWeight="bold">
                                    {t('WorkerZone.OrderProject', 'Zlecenie/Projekt')}:
                                </Typography>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>
                                <TextField
                                    size="small"
                                    placeholder={t('Buttons.Search', 'Szukaj')}
                                    value={orderFilter}
                                    onChange={(e) => setOrderFilter(e.target.value)}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <SearchIcon fontSize="small" />
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={{ mb: 1, maxWidth: 300 }}
                                />
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell sx={{ p: 0 }}>
                                {renderOrderButtons(orders, 'order', orderFilter)}
                            </TableCell>
                        </TableRow>

                        {/* Details */}
                        {data.WorkerRegModel?.CurrentOrderNb && (
                            <>
                                <TableRow>
                                    <TableCell>
                                        <TextField
                                            size="small"
                                            placeholder={t('Buttons.Search', 'Szukaj')}
                                            value={detailFilter}
                                            onChange={(e) => setDetailFilter(e.target.value)}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <SearchIcon fontSize="small" />
                                                    </InputAdornment>
                                                ),
                                            }}
                                            sx={{ mb: 1, maxWidth: 300 }}
                                        />
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell sx={{ p: 0 }}>
                                        {renderOrderButtons(details, 'detail', detailFilter)}
                                    </TableCell>
                                </TableRow>
                            </>
                        )}

                        {/* Activities */}
                        {data.WorkerRegModel?.CurrentDetailNb && (
                            <>
                                <TableRow>
                                    <TableCell>
                                        <Typography variant="subtitle2" fontWeight="bold">
                                            {t('WorkerZone.ActivityClient', 'Dzia�anie/Klient')}:
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>
                                        <TextField
                                            size="small"
                                            placeholder={t('Buttons.Search', 'Szukaj')}
                                            value={activityFilter}
                                            onChange={(e) => setActivityFilter(e.target.value)}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <SearchIcon fontSize="small" />
                                                    </InputAdornment>
                                                ),
                                            }}
                                            sx={{ mb: 1, maxWidth: 300 }}
                                        />
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell sx={{ p: 0 }}>
                                        {renderActivityButtons()}
                                    </TableCell>
                                </TableRow>
                            </>
                        )}
                    </>
                ) : (
                    /* Start Work Message */
                    <TableRow sx={{
                        backgroundColor: theme.palette.mode === 'dark'
                            ? theme.palette.grey[900]
                            : theme.palette.grey[50]
                    }}>
                        <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <ScheduleIcon color="warning" fontSize="small" />
                                <Typography variant="body2" color="warning.main">
                                    {t('Worker.StartWorkToPointWhatYouAreWorkingOn', 'Rozpocznij prac� aby wskaza� na czym pracujesz')}
                                </Typography>
                            </Box>
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );
};

export default OrderChangeComponent;