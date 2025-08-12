import React from "react";
import {
    Box,
    Table,
    TableBody,
    TableCell,
    TableRow,
    Typography,
    useTheme,
    Paper,
    Alert,
    Chip,
    Fade,
    Stack,
    Button,
    Tooltip,
    IconButton
} from '@mui/material';
import {
    Warning as WarningIcon,
    Schedule as ScheduleIcon,
    WorkOff as WorkOffIcon,
    AccessTime as TimeIcon,
    Coffee as CoffeeIcon,
    PowerSettingsNew as PowerIcon,
    PlayArrow as StartIcon,
    Stop as StopIcon,
    Assignment as AssignmentIcon,
    ExitToApp as ExitIcon
} from '@mui/icons-material';
import type { WorkerModel } from "../../schemas/WorkerModel";
import { useTranslation } from "react-i18next";

type Props = {
    data: WorkerModel;
    onRegistration?: (params: string) => void;
};

interface ScheduleItem {
    Date: string;
    ScheduleText: string;
    ScheduleAllowedTo: string;
    AllowedWorkingTime?: string;
    DayType: "Working" | "DayOff" | "SundayOrHoliday";
    DayTypeAbsenceShort: string;
    AbsenceCode?: string;
    IsWorking: boolean;
    IsAllowedTime: boolean;
}

// Custom Button Component for Worker Actions
const WorkerActionButton: React.FC<{
    children: React.ReactNode;
    onClick?: () => void;
    disabled?: boolean;
    variant?: 'start' | 'end' | 'break' | 'submit' | 'settlement' | 'disabled';
    fullWidth?: boolean;
    size?: 'small' | 'medium' | 'large';
    icon?: React.ReactNode;
    tooltip?: string;
}> = ({
    children,
    onClick,
    disabled = false,
    variant = 'start',
    fullWidth = false,
    size = 'small',
    icon,
    tooltip
}) => {
        const theme = useTheme();

        const getVariantStyles = () => {
            switch (variant) {
                case 'start':
                    return {
                        backgroundColor: theme.palette.success.main,
                        color: theme.palette.success.contrastText,
                        '&:hover': {
                            backgroundColor: theme.palette.success.dark,
                            transform: 'translateY(-1px)',
                            boxShadow: theme.shadows[4],
                        }
                    };
                case 'end':
                    return {
                        backgroundColor: theme.palette.error.main,
                        color: theme.palette.error.contrastText,
                        '&:hover': {
                            backgroundColor: theme.palette.error.dark,
                            transform: 'translateY(-1px)',
                            boxShadow: theme.shadows[4],
                        }
                    };
                case 'break':
                    return {
                        backgroundColor: theme.palette.warning.main,
                        color: theme.palette.warning.contrastText,
                        '&:hover': {
                            backgroundColor: theme.palette.warning.dark,
                            transform: 'translateY(-1px)',
                            boxShadow: theme.shadows[4],
                        }
                    };
                case 'submit':
                    return {
                        backgroundColor: theme.palette.primary.main,
                        color: theme.palette.primary.contrastText,
                        '&:hover': {
                            backgroundColor: theme.palette.primary.dark,
                            transform: 'translateY(-1px)',
                            boxShadow: theme.shadows[4],
                        }
                    };
                case 'settlement':
                    return {
                        backgroundColor: theme.palette.secondary.main,
                        color: theme.palette.secondary.contrastText,
                        '&:hover': {
                            backgroundColor: theme.palette.secondary.dark,
                            transform: 'translateY(-1px)',
                            boxShadow: theme.shadows[4],
                        }
                    };
                case 'disabled':
                    return {
                        backgroundColor: theme.palette.action.disabledBackground,
                        color: theme.palette.action.disabled,
                    };
                default:
                    return {
                        backgroundColor: theme.palette.primary.main,
                        color: theme.palette.primary.contrastText,
                    };
            }
        };

        const buttonContent = (
            <Button
                onClick={onClick}
                disabled={disabled}
                fullWidth={fullWidth}
                size={size}
                variant="contained"
                startIcon={icon}
            >
                {children}
            </Button>
        );

        return tooltip ? (
            <Tooltip title={tooltip} placement="top">
                <span>{buttonContent}</span>
            </Tooltip>
        ) : buttonContent;
    };

export const BeginEndPartial: React.FC<Props> = ({
    data,
    onRegistration
}) => {
    const { t } = useTranslation();
    const theme = useTheme();

    const handleRegistration = (mode: string, scheduleDate: string) => {
        const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
        const params = `id=${scheduleDate};mode=${mode};gen=${timestamp}`;
        onRegistration?.(params);
    };

    const getDayTypeColor = (dayType: string) => {
        switch (dayType) {
            case "DayOff":
                return theme.palette.warning.main;
            case "SundayOrHoliday":
                return theme.palette.error.main;
            default:
                return theme.palette.text.primary;
        }
    };

    const getDayTypeIcon = (dayType: string) => {
        switch (dayType) {
            case "DayOff":
                return <WorkOffIcon fontSize="small" />;
            case "SundayOrHoliday":
                return <ScheduleIcon fontSize="small" />;
            default:
                return <TimeIcon fontSize="small" />;
        }
    };

    const renderAllowedWorkingTime = (schedule: ScheduleItem) => {
        if (data.IsEndAvailable && data.IsEndAtEndAvailable) {
            return (
                <Stack spacing={1} alignItems="center">
                    <Typography variant="body2" color="text.secondary">
                        {t('Worker.AllowedWorkTime')}
                    </Typography>
                    <Chip
                        label={schedule.ScheduleAllowedTo}
                        color="error"
                        size="small"
                        icon={<WarningIcon />}
                    />
                </Stack>
            );
        }

        if (schedule.AllowedWorkingTime) {
            return (
                <Stack spacing={1} alignItems="center">
                    <Typography variant="body2" color="text.secondary">
                        {t('Worker.AllowedWorkTime')}
                    </Typography>
                    <Typography variant="body2" color="text.primary" fontWeight="medium">
                        {schedule.AllowedWorkingTime}
                    </Typography>
                </Stack>
            );
        }

        return (
            <Typography variant="body2" color="text.secondary">
                {t('Worker.NoAllowedWorkingTime')}
            </Typography>
        );
    };

    const renderActionButton = (schedule: ScheduleItem) => {
        if (data.IsBeginAvailable && data.IsAutoNorm) {
            return (
                <Typography variant="body2" color="info.main" textAlign="center">
                    {t('Worker.YourWorkingTimeIsRankedAutomatically')}
                </Typography>
            );
        }

        if (data.IsEndAvailable && data.IsBreakAvailable && data.IsAutoNormAfterReg) {
            return (
                <Typography variant="body2" color="success.main" textAlign="center">
                    {t('Worker.YourPresenceHasBeenReproted')}
                </Typography>
            );
        }

        if (data.IsEndAvailable && data.IsBreakAvailable) {
            return (
                <WorkerActionButton
                    variant={data.NonRCPReader ? "disabled" : "break"}
                    onClick={() => handleRegistration('break', schedule.Date)}
                    disabled={data.NonRCPReader}
                    icon={<CoffeeIcon />}
                    tooltip={data.NonRCPReader ? t('Worker.CautionCurrentReaderIsNotYourRCPReader') : ''}
                >
                    {t('Buttons.Break')}
                </WorkerActionButton>
            );
        }

        if (data.IsEndAvailable && data.IsEndAtEndAvailable) {
            return (
                <WorkerActionButton
                    variant="end"
                    onClick={() => handleRegistration('wyjEnd', schedule.Date)}
                    icon={<PowerIcon />}
                    size="medium"
                    tooltip={`${t('Buttons.End')} o ${schedule.ScheduleAllowedTo}`}
                >
                    {`${t('Buttons.End')} ${schedule.ScheduleAllowedTo}`}
                </WorkerActionButton>
            );
        }

        const firstSchedule = data.WorkerRegModel?.Schedule?.[0];
        if (firstSchedule?.AbsenceCode?.toUpperCase()?.startsWith("CH")) {
            return (
                <Chip
                    label={t('Worker.YouAreSick')}
                    color="error"
                    size="small"
                    variant="outlined"
                />
            );
        }

        if (firstSchedule?.AbsenceCode) {
            return (
                <Chip
                    label={t('Worker.YouHaveAbsence')}
                    color="warning"
                    size="small"
                    variant="outlined"
                />
            );
        }

        if (data.IsPendingRequest) {
            return (
                <Chip
                    label={t('Worker.YourAbsenceRequestIsBeingProcessed')}
                    color="info"
                    size="small"
                    variant="outlined"
                />
            );
        }

        return (
            <Typography variant="body2" color="text.secondary">
                {t('Worker.OutsideTime')}
            </Typography>
        );
    };

    const renderStatus = (schedule: ScheduleItem) => {
        if (data.IsBeginAvailable) {
            if (!data.IsAutoNorm) {
                return (
                    <Stack spacing={1}>
                        <Typography variant="body2" color="text.secondary">
                            {t('Schedule.CurrentlyYourNotWorking')}
                        </Typography>
                        {data.WorkerRegModel?.BreakTime !== "0" && (
                            <Typography variant="body2" color="warning.main">
                                {t('Worker.BreakSince')}
                                <Typography component="span" fontWeight="bold" ml={0.5}>
                                    {data.WorkerRegModel?.LastOut}
                                </Typography>
                            </Typography>
                        )}
                    </Stack>
                );
            }
            return null;
        }

        if (data.IsEndAvailable) {
            const workingFromTime = data.WorkerRegModel?.FirstIn === "" && data.WorkerRegModel?.LastReq
                ? data.WorkerRegModel.LastReq.DateToHourly
                : data.WorkerRegModel?.FirstIn;

            let workingFromTimeStr: string = "-";
            if (workingFromTime instanceof Date) {
                workingFromTimeStr = workingFromTime.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' });
            } else if (typeof workingFromTime === 'string') {
                workingFromTimeStr = workingFromTime;
            } else if (typeof workingFromTime !== 'undefined') {
                workingFromTimeStr = String(workingFromTime);
            }

            return (
                <Stack spacing={1}>
                    <Typography variant="body2" color="success.main">
                        {t('Worker.YourWorkingFrom')}
                        <Typography component="span" fontWeight="bold" ml={0.5}>
                            {workingFromTimeStr}
                        </Typography>
                    </Typography>
                    {data.WorkerRegModel?.FirstIn === "" && data.WorkerRegModel?.LastReq && (
                        <Chip
                            label={t('Worker.PendingRequest')}
                            color="info"
                            size="small"
                            variant="outlined"
                        />
                    )}
                    {data.WorkerRegModel?.BreakTime !== "0" && (
                        <Typography variant="body2" color="info.main">
                            {t('Worker.RegisteredMinutesOfBreak')}
                            <Typography component="span" fontWeight="bold" ml={0.5}>
                                {data.WorkerRegModel?.BreakTime}
                            </Typography>
                        </Typography>
                    )}
                </Stack>
            );
        }

        return <Typography variant="body2" color="text.secondary">-</Typography>;
    };

    const renderStartEndButtons = (schedule: ScheduleItem) => {
        const isWorkingAllowed = schedule.IsWorking || schedule.IsAllowedTime;
        const notRequestedText = t('Worker.YouWereNotRequestedToWorkOnDayOff');

        if (data.IsBeginAvailable) {
            if (data.IsAutoNormAfterReg || data.IsAutoNorm) {
                if (!data.IsAutoNorm) {
                    return isWorkingAllowed ? (
                        <WorkerActionButton
                            variant={data.NonRCPReader ? "disabled" : "submit"}
                            onClick={() => handleRegistration('wej', schedule.Date)}
                            disabled={data.NonRCPReader}
                            icon={<AssignmentIcon />}
                            size="medium"
                            tooltip={data.NonRCPReader ? t('Worker.CautionCurrentReaderIsNotYourRCPReader') : ''}
                        >
                            <Box sx={{ textAlign: 'center' }}>
                                <Typography variant="body2" component="div">
                                    {t('Worker.SubmitPresence')}
                                </Typography>
                            </Box>
                        </WorkerActionButton>
                    ) : (
                        <Alert severity="warning" sx={{ fontSize: '0.75rem', py: 0.5 }}>
                            {notRequestedText}
                        </Alert>
                    );
                }
                return null;
            }

            return isWorkingAllowed ? (
                <WorkerActionButton
                    variant={data.NonRCPReader ? "disabled" : "start"}
                    onClick={() => handleRegistration('wej', schedule.Date)}
                    disabled={data.NonRCPReader}
                    icon={<StartIcon />}
                    tooltip={data.NonRCPReader ? t('Worker.CautionCurrentReaderIsNotYourRCPReader') : ''}
                >
                    {t('Buttons.Start')}
                </WorkerActionButton>
            ) : (
                <Alert severity="warning" sx={{ fontSize: '0.75rem', py: 0.5 }}>
                    {notRequestedText}
                </Alert>
            );
        }

        if (data.IsEndAvailable) {
            if (data.IsAutoNormAfterReg) {
                return (
                    <Chip
                        label={t('Worker.YourPresenceHasBeenReproted')}
                        color="success"
                        size="small"
                    />
                );
            }

            if (!(data.IsEndAvailable && data.IsBreakAvailable && data.IsAutoNormAfterReg)) {
                return (
                    <WorkerActionButton
                        variant={data.NonRCPReader ? "disabled" : "end"}
                        onClick={() => handleRegistration('wyj', schedule.Date)}
                        disabled={data.NonRCPReader}
                        icon={<StopIcon />}
                        tooltip={data.NonRCPReader ? t('Worker.CautionCurrentReaderIsNotYourRCPReader') : ''}
                    >
                        {t('Buttons.End')}
                    </WorkerActionButton>
                );
            }
        }

        return null;
    };

    const renderScheduleRowsAsCards = () => {
        const schedules = data.WorkerRegModel?.Schedule;

        if (!schedules?.length) {
            return (
                <TableRow>
                    <TableCell colSpan={2} align="center">
                        <Alert severity="info" sx={{ fontSize: '0.875rem' }}>
                            {t('Worker.NeedScheduleToStartWork')}
                        </Alert>
                    </TableCell>
                </TableRow>
            );
        }

        // Helper to map DayType number to string
        const mapDayType = (dayType: any): "Working" | "DayOff" | "SundayOrHoliday" => {
            if (typeof dayType === 'string') return dayType as any;
            switch (dayType) {
                case 0:
                case 'Working':
                    return "Working";
                case 1:
                case 'DayOff':
                    return "DayOff";
                case 2:
                case 'SundayOrHoliday':
                    return "SundayOrHoliday";
                default:
                    return "Working";
            }
        };

        return schedules.map((schedule, idx) => {
            // Map DayType and Date to expected types
            let safeDate = '';
            if (typeof schedule.Date === 'string') {
                const d = new Date(schedule.Date);
                safeDate = isNaN(d.getTime()) ? '' : d.toISOString().slice(0, 10);
            } else if (schedule.Date instanceof Date) {
                safeDate = isNaN(schedule.Date.getTime()) ? '' : schedule.Date.toISOString().slice(0, 10);
            } else {
                safeDate = '';
            }
            
            const mappedSchedule: ScheduleItem = {
                ...schedule,
                DayType: mapDayType(schedule.DayType),
                Date: safeDate,
                ScheduleText: schedule.ScheduleText || '',
                ScheduleAllowedTo: schedule.ScheduleAllowedTo || '',
                DayTypeAbsenceShort: schedule.DayTypeAbsenceShort || '',
                AbsenceCode: schedule.AbsenceCode || undefined,
                IsWorking: Boolean(schedule.IsWorking),
                IsAllowedTime: Boolean(schedule.IsAllowedTime)
            };

            return (
                <React.Fragment key={idx}>
                    {/* Grafik row */}
                    <TableRow>
                        <TableCell component="th" sx={{
                            fontWeight: 600,
                            backgroundColor: theme.palette.mode === 'dark'
                                ? theme.palette.grey[800]
                                : theme.palette.grey[50],
                            width: '35%'
                        }}>
                            {t('Columns.Col_Schedule')}
                        </TableCell>
                        <TableCell>
                            {mappedSchedule.ScheduleText}
                        </TableCell>
                    </TableRow>
                    
                    {/* Status row */}
                    <TableRow>
                        <TableCell component="th" sx={{
                            fontWeight: 600,
                            backgroundColor: theme.palette.mode === 'dark'
                                ? theme.palette.grey[800]
                                : theme.palette.grey[50]
                        }}>
                            {t('Columns.Col_Status')}
                        </TableCell>
                        <TableCell>
                            {renderAllowedWorkingTime(mappedSchedule)}
                        </TableCell>
                    </TableRow>
                    
                    {/* Typ dnia row */}
                    <TableRow>
                        <TableCell component="th" sx={{
                            fontWeight: 600,
                            backgroundColor: theme.palette.mode === 'dark'
                                ? theme.palette.grey[800]
                                : theme.palette.grey[50]
                        }}>
                            {t('Columns.Col_DayType')}
                        </TableCell>
                        <TableCell>
                            {renderStatus(mappedSchedule)}
                        </TableCell>
                    </TableRow>
                    
                    {/* Action button row */}
                    <TableRow>
                        <TableCell component="th" sx={{
                            fontWeight: 600,
                            backgroundColor: theme.palette.mode === 'dark'
                                ? theme.palette.grey[800]
                                : theme.palette.grey[50]
                        }}>
                            Akcje
                        </TableCell>
                        <TableCell>
                            {renderActionButton(mappedSchedule)}
                        </TableCell>
                    </TableRow>
                    
                    {/* Separator row between records */}
                    {idx < schedules.length - 1 && (
                        <TableRow>
                            <TableCell colSpan={2} sx={{ 
                                height: '8px',
                                borderBottom: `2px solid ${theme.palette.divider}`,
                                padding: 0
                            }} />
                        </TableRow>
                    )}
                </React.Fragment>
            );
        });
    };

    const renderScheduleRows = () => {
        const schedules = data.WorkerRegModel?.Schedule;

        if (!schedules?.length) {
            return (
                <TableRow>
                    <TableCell colSpan={4} align="center">
                        <Alert severity="info" sx={{ fontSize: '0.875rem' }}>
                            {t('Worker.NeedScheduleToStartWork')}
                        </Alert>
                    </TableCell>
                </TableRow>
            );
        }

        // Helper to map DayType number to string
        const mapDayType = (dayType: any): "Working" | "DayOff" | "SundayOrHoliday" => {
            if (typeof dayType === 'string') return dayType as any;
            switch (dayType) {
                case 0:
                case 'Working':
                    return "Working";
                case 1:
                case 'DayOff':
                    return "DayOff";
                case 2:
                case 'SundayOrHoliday':
                    return "SundayOrHoliday";
                default:
                    return "Working";
            }
        };

        return schedules.map((schedule, idx) => {
            // Map DayType and Date to expected types, and ensure all required fields are correct types
            // Safely parse Date
            let safeDate = '';
            if (typeof schedule.Date === 'string') {
                // Try to parse as date string
                const d = new Date(schedule.Date);
                safeDate = isNaN(d.getTime()) ? '' : d.toISOString().slice(0, 10);
            } else if (schedule.Date instanceof Date) {
                safeDate = isNaN(schedule.Date.getTime()) ? '' : schedule.Date.toISOString().slice(0, 10);
            } else {
                safeDate = '';
            }
            const mappedSchedule: ScheduleItem = {
                ...schedule,
                DayType: mapDayType(schedule.DayType),
                Date: safeDate,
                ScheduleText: schedule.ScheduleText ?? '',
                ScheduleAllowedTo: schedule.ScheduleAllowedTo ?? '',
                DayTypeAbsenceShort: schedule.DayTypeAbsenceShort ?? '',
                AbsenceCode: schedule.AbsenceCode === null ? undefined : schedule.AbsenceCode,
                IsWorking: typeof schedule.IsWorking === 'boolean' ? schedule.IsWorking : false,
                IsAllowedTime: typeof schedule.IsAllowedTime === 'boolean' ? schedule.IsAllowedTime : false,
            };
            return (
                <React.Fragment key={idx}>
                    <Fade in timeout={300 + idx * 100}>
                        <TableRow
                            sx={{
                                backgroundColor: theme.palette.background.paper,
                                '&:hover': {
                                    backgroundColor: theme.palette.action.hover,
                                }
                            }}
                        >
                            <TableCell colSpan={3} align="center">
                                <Stack direction="row" spacing={1} alignItems="center" justifyContent="center">
                                    {getDayTypeIcon(mappedSchedule.DayType)}
                                    <Box sx={{ color: getDayTypeColor(mappedSchedule.DayType) }}>
                                        {renderAllowedWorkingTime(mappedSchedule)}
                                    </Box>
                                </Stack>
                            </TableCell>
                            <TableCell align="center">
                                {renderActionButton(mappedSchedule)}
                            </TableCell>
                        </TableRow>
                    </Fade>

                    <Fade in timeout={400 + idx * 100}>
                        <TableRow
                            sx={{
                                backgroundColor: theme.palette.action.hover,
                                '&:hover': {
                                    backgroundColor: theme.palette.action.selected,
                                }
                            }}
                        >
                            <TableCell align="center">
                                <Typography variant="body2" fontWeight="medium">
                                    {mappedSchedule.ScheduleText}
                                </Typography>
                            </TableCell>
                            <TableCell align="center">
                                {renderStatus(mappedSchedule)}
                            </TableCell>
                            <TableCell align="center">
                                <Chip
                                    label={mappedSchedule.DayTypeAbsenceShort}
                                    size="small"
                                    variant="outlined"
                                    color={mappedSchedule.DayType === 'Working' ? "primary" : "warning"}
                                />
                            </TableCell>
                            <TableCell align="center">
                                {renderStartEndButtons(mappedSchedule)}
                            </TableCell>
                        </TableRow>
                    </Fade>
                </React.Fragment>
            );
        });
    };

    const renderSettlementButton = () => {
        if (!data.WorkerRegModel?.Schedule || !data.IsLastDayNotOver) return null;

        return (
            <WorkerActionButton
                variant="settlement"
                onClick={() => window.location.href = '/Settlement2/Index'}
                icon={<ExitIcon />}
                tooltip={t('Settlement.ToSettl')}
            >
                {t('Settlement.ToSettl')}
            </WorkerActionButton>
        );
    };

    return (
        <Box id="beginEndPartial">
            {/* Message display */}
            {data.WorkerRegModel?.Message && (
                <Alert severity="info">
                    <div dangerouslySetInnerHTML={{ __html: data.WorkerRegModel.Message }} />
                </Alert>
            )}

            {/* Non-RCP Reader warning */}
            {data.NonRCPReader && (
                <Alert severity="warning">
                    {t('Worker.CautionCurrentReaderIsNotYourRCPReader')}
                </Alert>
            )}

            {/* Yesterday work not finished warning */}
            {data.WorkerRegModel?.Schedule && data.IsLastDayNotOver && (
                <Box>
                    <Alert severity="warning">
                        {t('Schedule.HelloYesterdayWorkWasNotFInished')}
                    </Alert>
                    {renderSettlementButton()}
                </Box>
            )}

            {/* Table with row-based layout */}
            <Paper>
                <Table size="small" sx={{ 
                    '& .MuiTableCell-root': {
                        fontFamily: "'Segoe UI Light', 'Open Sans', Verdana, Arial, Helvetica, sans-serif",
                        fontSize: '9pt',
                        fontWeight: 300,
                        letterSpacing: '0.02em',
                        lineHeight: '11pt',
                        padding: '6px 8px',
                        borderBottom: `1px solid ${theme.palette.divider}`,
                        color: theme.palette.text.primary
                    }
                }}>
                    <TableBody>
                        {renderScheduleRowsAsCards()}
                    </TableBody>
                </Table>
            </Paper>
        </Box>
    );
};

export default BeginEndPartial;