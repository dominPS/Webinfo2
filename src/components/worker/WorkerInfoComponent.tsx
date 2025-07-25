import React from 'react';
import {
    Table,
    TableBody,
    TableRow,
    TableCell,
    Typography,
    Box,
    useTheme
} from '@mui/material';
import {
    Person as PersonIcon,
    Badge as BadgeIcon,
    Business as BusinessIcon,
    Work as WorkIcon,
    Group as GroupIcon
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import type { WorkerModel } from '../../schemas/WorkerModel';

interface WorkerInfoComponentProps {
    data: WorkerModel;
}

export const WorkerInfoComponent: React.FC<WorkerInfoComponentProps> = ({ data }) => {
    const { t } = useTranslation();
    const theme = useTheme();

    const workerFields = [
        {
            key: 'Badge',
            label: t('Worker.BadgeNumber', 'Numer ewidencyjny'),
            value: data.Badge,
            icon: <BadgeIcon fontSize="small" />,
            required: true
        },
        {
            key: 'Name',
            label: t('Worker.FirstName', 'Imiê'),
            value: data.Name,
            icon: <PersonIcon fontSize="small" />,
            required: true
        },
        {
            key: 'Surname',
            label: t('Worker.LastName', 'Nazwisko'),
            value: data.Surname,
            icon: <PersonIcon fontSize="small" />,
            required: true
        },
        {
            key: 'Department',
            label: t('Worker.Department', 'Wydzia³'),
            value: data.Department,
            icon: <BusinessIcon fontSize="small" />,
            required: true
        },
        {
            key: 'Position',
            label: t('Worker.Position', 'Stanowisko'),
            value: data.Position,
            icon: <WorkIcon fontSize="small" />,
            required: false
        },
        {
            key: 'Group',
            label: t('Worker.Group', 'Grupa'),
            value: data.Group,
            icon: <GroupIcon fontSize="small" />,
            required: true
        },
        {
            key: 'WorkGroup',
            label: t('Worker.WorkGroup', 'Grupa projektowa'),
            value: data.WorkGroup,
            icon: <GroupIcon fontSize="small" />,
            required: true
        }
    ];

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
                    padding: '6px 8px',
                    borderBottom: `1px solid ${theme.palette.divider}`,
                    color: theme.palette.text.primary
                }
            }}
        >
            <TableBody>
                {workerFields.map((field) => {
                    if (!field.required && !field.value) return null;

                    return (
                        <TableRow
                            key={field.key}
                            sx={{
                                '&:hover': {
                                    backgroundColor: theme.palette.action.hover
                                }
                            }}
                        >
                            <TableCell
                                component="th"
                                sx={{
                                    fontWeight: 600,
                                    backgroundColor: theme.palette.mode === 'dark'
                                        ? theme.palette.grey[800]
                                        : theme.palette.grey[50],
                                    width: '45%'
                                }}
                            >
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                    <Box sx={{ color: theme.palette.primary.main }}>
                                        {field.icon}
                                    </Box>
                                    {field.label}
                                </Box>
                            </TableCell>
                            <TableCell>
                                <Typography
                                    variant="body2"
                                    sx={{
                                        fontWeight: field.value ? 400 : 300,
                                        color: field.value
                                            ? theme.palette.text.primary
                                            : theme.palette.text.disabled,
                                        fontSize: '10pt'
                                    }}
                                >
                                    {field.value || t('Common.NotSpecified', 'Nie okreœlono')}
                                </Typography>
                            </TableCell>
                        </TableRow>
                    );
                })}
            </TableBody>
        </Table>
    );
};

export default WorkerInfoComponent;