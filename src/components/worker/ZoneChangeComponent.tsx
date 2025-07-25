import React from 'react';
import {
    Box,
    Table,
    TableBody,
    TableRow,
    TableCell,
    Typography,
    useTheme,
    Button,
    Chip,
    Alert
} from '@mui/material';

import {
    LocationOn as LocationOnIcon,
    Login as LoginIcon,
    Work as WorkIcon,
    Schedule as ScheduleIcon
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import type { WorkerModel } from '../../schemas/WorkerModel';

interface ZoneChangeComponentProps {
    data: WorkerModel;
    onZoneChange?: (zoneCode: string, zoneFull: string) => void;
}

export const ZoneChangeComponent: React.FC<ZoneChangeComponentProps> = ({ 
    data, 
    onZoneChange 
}) => {
    const { t } = useTranslation();
    const theme = useTheme();

    const handleZoneClick = (zoneCode: string, zoneFull: string) => {
        if (onZoneChange) {
            onZoneChange(zoneCode, zoneFull);
        }
    };

    const renderCurrentStatus = () => {
        if (data.IsBeginAvailable) {
            return (
                <Typography variant="body2" color="text.secondary">
                    {t('Schedule.CurrentlyYourNotWorking', 'Obecnie nie pracujesz')}
                </Typography>
            );
        } else if (data.IsEndAvailable) {
            const currentZone = data.WorkerRegModel?.CurrentZoneFull || '';
            const currentZoneFrom = data.WorkerRegModel?.CurrentZoneFrom;
            let fromTime = t('Common.BrakDanych', 'Brak danych');
            let currentZoneFromStr = '';
            if (typeof currentZoneFrom === 'string') {
                currentZoneFromStr = currentZoneFrom;
            } else if (currentZoneFrom instanceof Date && !isNaN(currentZoneFrom.getTime())) {
                currentZoneFromStr = currentZoneFrom.toISOString();
            }
            if (currentZoneFromStr && currentZoneFromStr !== '0001-01-01T00:00:00') {
                const dateObj = new Date(currentZoneFromStr);
                if (!isNaN(dateObj.getTime())) {
                    fromTime = dateObj.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' });
                }
            }

            return (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LocationOnIcon color="primary" fontSize="small" />
                    <Typography variant="body2">
                        {t('Schedule.CurrentlyYourWorkingOn', 'Obecnie pracujesz na')}{' '}
                        <Typography component="span" fontWeight="bold">
                            {currentZone}
                        </Typography>
                        , {t('Common.From', 'Od')}: {' '}
                        <Typography component="span" fontWeight="bold">
                            {fromTime}
                        </Typography>
                    </Typography>
                </Box>
            );
        } else {
            return (
                <Typography variant="body2" color="warning.main">
                    {t('Worker.LogInInOfficeHours', 'Zaloguj się w godzinach pracy')}
                </Typography>
            );
        }
    };

    const renderZoneButtons = () => {
        const availableZones = data.WorkerRegModel?.AvailableZones || {};
        const currentZone = data.WorkerRegModel?.CurrentZone;
        const zones = Object.entries(availableZones);

        if (zones.length === 0) {
            return (
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                    {t('Worker.NoAvailableZones', 'Brak dost�pnych stref')}
                </Typography>
            );
        }

        return (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, p: 1 }}>
                {zones.map(([zoneCode, zoneFull], index) => {
                    const isCurrentZone = currentZone === zoneCode;
                    return (
                        <Box key={zoneCode} sx={{ flex: '1 1 220px', minWidth: 160, maxWidth: 320 }}>
                            <Button
                                fullWidth
                                variant={isCurrentZone ? "contained" : "outlined"}
                                color={isCurrentZone ? "success" : "primary"}
                                size="small"
                                startIcon={isCurrentZone ? <LocationOnIcon /> : <LoginIcon />}
                                onClick={() => handleZoneClick(zoneCode, zoneFull)}
                                disabled={!onZoneChange}
                                sx={{
                                    textTransform: 'none',
                                    fontSize: '9pt',
                                    fontWeight: isCurrentZone ? 600 : 400,
                                    py: 0.5,
                                    justifyContent: 'flex-start',
                                    backgroundColor: isCurrentZone 
                                        ? theme.palette.success.main 
                                        : 'transparent',
                                    '&:hover': {
                                        backgroundColor: isCurrentZone 
                                            ? theme.palette.success.dark 
                                            : theme.palette.action.hover,
                                    }
                                }}
                            >
                                <Box sx={{ 
                                    display: 'flex', 
                                    flexDirection: 'column', 
                                    alignItems: 'flex-start',
                                    textAlign: 'left',
                                    width: '100%'
                                }}>
                                    <Typography variant="caption" sx={{ fontWeight: 'bold', fontSize: '8pt' }}>
                                        {zoneCode}
                                    </Typography>
                                    <Typography variant="caption" sx={{ fontSize: '7pt', opacity: 0.8 }}>
                                        {zoneFull}
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
                            <WorkIcon fontSize="small" color="primary" />
                            {t('Columns.Task', 'Zadanie')} / {t('Columns.Col_Zone', 'Strefa')} {t('Worker.Work', 'Praca')}
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

                {/* Instructions and Zones */}
                {data.IsEndAvailable ? (
                    <>
                        {/* Change Zone Instruction */}
                        {onZoneChange && (
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

                        {/* Zone Buttons */}
                        <TableRow>
                            <TableCell sx={{ p: 0 }}>
                                {renderZoneButtons()}
                            </TableCell>
                        </TableRow>
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

export default ZoneChangeComponent;