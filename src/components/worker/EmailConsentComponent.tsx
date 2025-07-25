import React, { useState } from 'react';
import {
    Box,
    Table,
    TableBody,
    TableRow,
    TableCell,
    Typography,
    TextField,
    FormControlLabel,
    Checkbox,
    Button,
    FormGroup,
    Alert,
    CircularProgress,
    useTheme
} from '@mui/material';
import {
    Email as EmailIcon,
    Phone as PhoneIcon,
    Save as SaveIcon,
    Info as InfoIcon
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import type { WorkerModel } from '../../schemas/WorkerModel';

// Interface for email consent form data
interface EmailConsentFormData {
    email: string;
    phone: string;
    consent_OnDemand: boolean;
    consent_Mailing: boolean;
    consent_MailingPit: boolean;
    consent_MailingOveral: boolean;
    consent_Sms: boolean;
    code: string;
}

interface EmailConsentComponentProps {
    data: WorkerModel;
    onSave: (formData: EmailConsentFormData) => Promise<void>;
}

export const EmailConsentComponent: React.FC<EmailConsentComponentProps> = ({
    data,
    onSave
}) => {
    const { t } = useTranslation();
    const theme = useTheme();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState<EmailConsentFormData>({
        email: data.Email || '',
        phone: data.Phone || '',
        consent_OnDemand: data.Consent_OnDemand || false,
        consent_Mailing: data.Consent_Mailing || false,
        consent_MailingPit: data.Consent_MailingPit || false,
        consent_MailingOveral: data.Consent_MailingOveral || false,
        consent_Sms: data.Consent_Sms || false,
        code: data.Code || ''
    });

    const handleInputChange = (field: keyof EmailConsentFormData, value: string | boolean) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            await onSave(formData);
        } catch (error) {
            console.error('B³¹d podczas zapisywania zgód email:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const isFormChanged = () => {
        return (
            formData.email !== (data.Email || '') ||
            formData.phone !== (data.Phone || '') ||
            formData.consent_OnDemand !== (data.Consent_OnDemand || false) ||
            formData.consent_Mailing !== (data.Consent_Mailing || false) ||
            formData.consent_MailingPit !== (data.Consent_MailingPit || false) ||
            formData.consent_MailingOveral !== (data.Consent_MailingOveral || false) ||
            formData.consent_Sms !== (data.Consent_Sms || false)
        );
    };

    return (
        <Box
            sx={{
                width: '85%', // ZMNIEJSZONA SZEROKOŒÆ O 15% (mniej drastycznie ni¿ 30%)
                maxWidth: '500px', // Wiêksza maksymalna szerokoœæ dla lepszej czytelnoœci
                margin: '0 auto' // Centrowanie komponentu
            }}
        >
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
                    {/* Email Field */}
                    <TableRow>
                        <TableCell
                            component="th"
                            sx={{
                                fontWeight: 600,
                                backgroundColor: theme.palette.mode === 'dark'
                                    ? theme.palette.grey[800]
                                    : theme.palette.grey[50],
                                width: '30%'
                            }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <EmailIcon color="primary" fontSize="small" />
                                {t('Worker.Email', 'Email')}:
                            </Box>
                        </TableCell>
                        <TableCell>
                            <TextField
                                fullWidth
                                variant="outlined"
                                size="small"
                                value={formData.email}
                                onChange={(e) => handleInputChange('email', e.target.value)}
                                placeholder={t('Worker.EmailPlaceholder', 'WprowadŸ adres email')}
                                type="email"
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        fontSize: '10pt',
                                        fontFamily: "'Segoe UI Light', 'Open Sans', Verdana, Arial, Helvetica, sans-serif",
                                        height: '32px'
                                    }
                                }}
                            />
                        </TableCell>
                    </TableRow>

                    {/* Phone Field */}
                    <TableRow>
                        <TableCell
                            component="th"
                            sx={{
                                fontWeight: 600,
                                backgroundColor: theme.palette.mode === 'dark'
                                    ? theme.palette.grey[800]
                                    : theme.palette.grey[50]
                            }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <PhoneIcon color="primary" fontSize="small" />
                                {t('Worker.Phone', 'Telefon')}:
                            </Box>
                        </TableCell>
                        <TableCell>
                            <TextField
                                fullWidth
                                variant="outlined"
                                size="small"
                                value={formData.phone}
                                onChange={(e) => handleInputChange('phone', e.target.value)}
                                placeholder={t('Worker.PhonePlaceholder', 'WprowadŸ numer telefonu')}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        fontSize: '10pt',
                                        fontFamily: "'Segoe UI Light', 'Open Sans', Verdana, Arial, Helvetica, sans-serif",
                                        height: '32px'
                                    }
                                }}
                            />
                        </TableCell>
                    </TableRow>

                    {/* Consent Information and Checkboxes */}
                    <TableRow>
                        <TableCell colSpan={2} sx={{ pt: 2 }}>
                            <Alert
                                severity="info"
                                icon={<InfoIcon />}
                                sx={{
                                    mb: 2,
                                    '& .MuiAlert-message': {
                                        fontSize: '9pt',
                                        lineHeight: 1.3
                                    }
                                }}
                            >
                                <Typography variant="body2" sx={{ mb: 0.5, fontSize: '9pt' }}>
                                    {t('Worker.EmailInfoPart1')}
                                </Typography>
                                <Typography variant="body2" sx={{ mb: 0.5, fontSize: '9pt' }}>
                                    {t('Worker.EmailInfoPart2')}
                                </Typography>
                                <Typography variant="body2" sx={{ mb: 0.5, fontSize: '9pt' }}>
                                    {t('Worker.EmailInfoPart3')}
                                </Typography>
                                <Typography variant="body2" sx={{ fontSize: '9pt' }}>
                                    {t('Worker.EmailInfoPart4')}
                                </Typography>
                            </Alert>

                            <FormGroup sx={{ mb: 2 }}>
                                {[
                                    { key: 'consent_OnDemand', label: t('Worker.ConsentOnDemand') },
                                    { key: 'consent_Mailing', label: t('Worker.ConsentMailing') },
                                    { key: 'consent_MailingPit', label: t('Worker.ConsentMailingPit') },
                                    { key: 'consent_MailingOveral', label: t('Worker.ConsentOveral') },
                                    { key: 'consent_Sms', label: t('Worker.ConsentSms') }
                                ].map((consent) => (
                                    <FormControlLabel
                                        key={consent.key}
                                        control={
                                            <Checkbox
                                                checked={formData[consent.key as keyof EmailConsentFormData] as boolean}
                                                onChange={(e) => handleInputChange(consent.key as keyof EmailConsentFormData, e.target.checked)}
                                                color="primary"
                                                size="small"
                                            />
                                        }
                                        label={
                                            <Typography variant="body2" sx={{ fontSize: '10pt' }}>
                                                {consent.label}
                                            </Typography>
                                        }
                                        sx={{ mb: 0.5 }}
                                    />
                                ))}
                            </FormGroup>

                            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <Button
                                    variant="contained"
                                    size="small"
                                    startIcon={isSubmitting ? <CircularProgress size={12} /> : <SaveIcon />}
                                    onClick={handleSubmit}
                                    disabled={isSubmitting || !isFormChanged()}
                                    sx={{
                                        fontFamily: "'Segoe UI', 'Open Sans', Verdana, Arial, Helvetica, sans-serif",
                                        fontWeight: 400,
                                        fontSize: '10pt'
                                    }}
                                >
                                    {isSubmitting
                                        ? t('Common.Saving', 'Zapisywanie...')
                                        : t('Common.Save', 'Zapisz zmiany')
                                    }
                                </Button>
                            </Box>
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </Box>
    );
};

export default EmailConsentComponent;

// Export the interface for use in other components
export type { EmailConsentFormData };