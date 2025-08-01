import React, { useCallback } from 'react';
import { 
    Card, 
    Typography, 
    Box, 
    ButtonBase, 
    useTheme 
} from '@mui/material';
import { Grid } from '@mui/system';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { eventPath } from '../../routes/eventPath';
import type { AttendanceListNavigationModel } from '../../schemas/AttendanceWorkerListModel';
import PeopleIcon from '@mui/icons-material/People';
import GroupIcon from '@mui/icons-material/Group';
import PersonIcon from '@mui/icons-material/Person';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import LaunchIcon from '@mui/icons-material/Launch';

interface AttendanceNavigationStatsProps {
    navigation: AttendanceListNavigationModel;
    currentPage: 'workers' | 'guests' | 'guestsPresence' | 'vehicles';
}

export const AttendanceNavigationStats: React.FC<AttendanceNavigationStatsProps> = ({
    navigation,
    currentPage
}) => {
    const { t } = useTranslation();
    const theme = useTheme();
    const navigate = useNavigate();

    // Navigation handlers
    const handleWorkerClick = useCallback(() => {
        if (currentPage !== 'workers') {
            navigate(eventPath.attendancelist.path);
        }
    }, [navigate, currentPage]);

    const handleGuestClick = useCallback(() => {
        if (currentPage !== 'guests') {
            navigate(eventPath.attendanceguests.path);
        }
    }, [navigate, currentPage]);

    const handleGuestPresenceClick = useCallback(() => {
        if (currentPage !== 'guestsPresence') {
            navigate(eventPath.attendanceguestspresence.path);
        }
    }, [navigate, currentPage]);

    const handleVehicleClick = useCallback(() => {
        if (currentPage !== 'vehicles') {
            navigate(eventPath.attendancevehicles.path);
        }
    }, [navigate, currentPage]);

    const statisticsData = [
        {
            icon: <PeopleIcon sx={{ color: theme.palette.primary.main, fontSize: 40 }} />,
            title: t('AttendanceList.Workers', 'Pracownicy'),
            value: navigation.WorkerCount,
            color: theme.palette.primary.main,
            onClick: handleWorkerClick,
            isCurrent: currentPage === 'workers',
            tooltip: currentPage === 'workers' ? 
                t('AttendanceList.CurrentPage', 'Aktualna strona') : 
                t('AttendanceList.WorkersTooltip', 'Kliknij aby przej�� do listy pracownik�w')
        },
        {
            icon: <GroupIcon sx={{ color: theme.palette.secondary.main, fontSize: 40 }} />,
            title: t('AttendanceList.Guests', 'Go�cie'),
            value: navigation.GuestCount,
            color: theme.palette.secondary.main,
            onClick: handleGuestClick,
            isCurrent: currentPage === 'guests',
            tooltip: currentPage === 'guests' ? 
                t('AttendanceList.CurrentPage', 'Aktualna strona') : 
                t('AttendanceList.GuestsTooltip', 'Kliknij aby przej�� do listy go�ci')
        },
        {
            icon: <PersonIcon sx={{ color: theme.palette.info.main, fontSize: 40 }} />,
            title: t('AttendanceList.GuestPresence', 'Obecno�� go�ci'),
            value: navigation.GuestPresenceCount,
            color: theme.palette.info.main,
            onClick: handleGuestPresenceClick,
            isCurrent: currentPage === 'guestsPresence',
            tooltip: currentPage === 'guestsPresence' ? 
                t('AttendanceList.CurrentPage', 'Aktualna strona') : 
                t('AttendanceList.GuestPresenceTooltip', 'Kliknij aby przej�� do obecno�ci go�ci')
        },
        {
            icon: <DirectionsCarIcon sx={{ color: theme.palette.warning.main, fontSize: 40 }} />,
            title: t('AttendanceList.Vehicles', 'Pojazdy'),
            value: navigation.VehicleCount,
            color: theme.palette.warning.main,
            onClick: handleVehicleClick,
            isCurrent: currentPage === 'vehicles',
            tooltip: currentPage === 'vehicles' ? 
                t('AttendanceList.CurrentPage', 'Aktualna strona') : 
                t('AttendanceList.VehiclesTooltip', 'Kliknij aby przej�� do listy pojazd�w')
        }
    ];

    return (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            {statisticsData.map((stat, index) => (
                <Box 
                    key={index}
                    sx={{
                        display: 'flex',
                        minWidth: 0,
                        width: { xs: 'calc(50% - 8px)', md: 'calc(25% - 12px)' },
                        '& > *': {
                            width: '100%',
                            minWidth: 200,
                            maxWidth: '100%'
                        }
                    }}
                >
                    <ButtonBase
                        onClick={stat.onClick}
                        disabled={stat.isCurrent}
                        sx={{
                            width: '100%',
                            height: '100%',
                            borderRadius: 1,
                            cursor: stat.isCurrent ? 'default' : 'pointer',
                            display: 'flex',
                            flexDirection: 'column',
                            minWidth: 200, // DODANO - minimalna szeroko�� ButtonBase
                            '&:hover .stat-card': !stat.isCurrent ? {
                                transform: 'translateY(-4px)',
                                boxShadow: theme.shadows[4]
                            } : {},
                            '&:hover .stat-icon': !stat.isCurrent ? {
                                transform: 'scale(1.1)'
                            } : {},
                            '&:hover .launch-icon': !stat.isCurrent ? {
                                opacity: 1
                            } : {}
                        }}
                        title={stat.tooltip}
                    >
                        <Card
                            className="stat-card"
                            elevation={stat.isCurrent ? 3 : 1}
                            sx={{
                                textAlign: 'center',
                                p: 2,
                                borderRadius: 1,
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                position: 'relative',
                                width: '100%',
                                height: 160,
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                boxSizing: 'border-box',
                                minWidth: 200, // DODANO - minimalna szeroko�� Card
                                ...(stat.isCurrent ? {
                                    borderColor: stat.color,
                                    borderWidth: 2,
                                    borderStyle: 'solid',
                                    backgroundColor: `${stat.color}10`,
                                    margin: 0
                                } : {
                                    borderWidth: 2,
                                    borderStyle: 'solid',
                                    borderColor: 'transparent',
                                    '&:hover': {
                                        borderColor: stat.color
                                    }
                                })
                            }}
                        >
                            {!stat.isCurrent && (
                                <LaunchIcon 
                                    className="launch-icon"
                                    sx={{ 
                                        position: 'absolute',
                                        top: 8,
                                        right: 8,
                                        fontSize: 16,
                                        color: stat.color,
                                        opacity: 0,
                                        transition: 'opacity 0.2s ease-in-out'
                                    }} 
                                />
                            )}
                            
                            {/* Top section with icon */}
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <Box 
                                    className="stat-icon"
                                    sx={{ 
                                        transition: 'transform 0.2s ease-in-out',
                                        display: 'inline-block',
                                        mb: 1
                                    }}
                                >
                                    {stat.icon}
                                </Box>
                                <Typography
                                    variant="h4"
                                    sx={{
                                        fontWeight: 600,
                                        color: stat.color,
                                        mb: 0.5
                                    }}
                                >
                                    {stat.value}
                                </Typography>
                            </Box>

                            {/* Middle section with title (fixed height) */}
                            <Box 
                                sx={{ 
                                    flex: 1,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    minHeight: 48,
                                    maxHeight: 48, // DODANO - maksymalna wysoko�� dla consistency
                                    px: 1,
                                    width: '100%' // DODANO - pe�na szeroko��
                                }}
                            >
                                <Typography
                                    variant="body2"
                                    color="textSecondary"
                                    sx={{ 
                                        fontSize: '0.875rem',
                                        textAlign: 'center',
                                        lineHeight: 1.2,
                                        overflow: 'hidden',
                                        display: '-webkit-box',
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: 'vertical',
                                        width: '100%', // DODANO - pe�na szeroko��
                                        wordBreak: 'break-word', // DODANO - �amanie d�ugich s��w
                                        hyphens: 'auto' // DODANO - automatyczne dzielenie wyraz�w
                                    }}
                                >
                                    {stat.title}
                                </Typography>
                            </Box>

                            {/* Bottom section with action text (fixed height) */}
                            <Box 
                                sx={{ 
                                    height: 32,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: '100%' // DODANO - pe�na szeroko��
                                }}
                            >
                                <Typography
                                    variant="caption"
                                    sx={{
                                        color: stat.color,
                                        opacity: 0.7,
                                        fontSize: '0.7rem',
                                        fontWeight: stat.isCurrent ? 600 : 400,
                                        textAlign: 'center',
                                        lineHeight: 1.1,
                                        overflow: 'hidden',
                                        display: '-webkit-box',
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: 'vertical',
                                        width: '100%', // DODANO - pe�na szeroko��
                                        wordBreak: 'break-word' // DODANO - �amanie d�ugich s��w
                                    }}
                                >
                                    {stat.isCurrent ? 
                                        t('AttendanceList.CurrentPage', 'Aktualna strona') : 
                                        t('AttendanceList.ClickToView', 'Kliknij aby wy�wietli�')
                                    }
                                </Typography>
                            </Box>
                        </Card>
                    </ButtonBase>
                </Box>
            ))}
        </Box>
    );
};