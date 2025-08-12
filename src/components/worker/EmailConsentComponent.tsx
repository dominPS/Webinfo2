import React, { useState } from 'react';
import {
    Box,
    Typography,
    TextField,
    FormControlLabel,
    Checkbox,
    Button,
    FormGroup,
    CircularProgress,
    useTheme
} from '@mui/material';
import {
    Email as EmailIcon,
    Phone as PhoneIcon,
    Save as SaveIcon
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
            console.error('B��d podczas zapisywania zg�d email:', error);
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
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                gap: 2
            }}
        >
            {/* Górna sekcja - Email i Telefon obok siebie */}
            <Box sx={{ display: 'flex', gap: 2, height: 'auto' }}>
                {/* Lewa strona - Email */}
                <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle2" sx={{ 
                        fontWeight: 600, 
                        mb: 1, 
                        fontSize: '10pt',
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 0.5 
                    }}>
                        <EmailIcon color="primary" fontSize="small" />
                        {t('Worker.Email', 'Email')}
                    </Typography>
                    <TextField
                        fullWidth
                        variant="outlined"
                        size="small"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder={t('Worker.EmailPlaceholder', 'Wprowadź adres email')}
                        type="email"
                        sx={{
                            mb: 2,
                            '& .MuiOutlinedInput-root': {
                                fontSize: '9pt',
                                fontFamily: "'Segoe UI Light', 'Open Sans', Verdana, Arial, Helvetica, sans-serif",
                                height: '32px'
                            }
                        }}
                    />
                    <Typography variant="body2" sx={{ 
                        fontSize: '8pt', 
                        lineHeight: 1.3,
                        color: theme.palette.text.secondary,
                        textAlign: 'left'
                    }}>
                        Jeśli chcesz usprawnić komunikację z działem HR i przyspieszyć formę otrzymywania informacji dotyczących swojego zatrudnienia możesz nam w pełni dobrowolnie podać swój prywatny adres poczty elektronicznej.
                        <br /><br />
                        Adres poczty elektronicznej będzie przetwarzany wyłącznie w celach, na które wyrazisz zgodę, a wysyłka materiałów dotyczących zatrudnienia będzie trwać do czasu jej cofnięcia.
                        <br /><br />
                        Zgoda może zostać cofnięta w każdym czasie bez podawania przyczyny. Cofnięcie zgody nie ma wpływu na przetwarzanie danych osobowych przed jej cofnięciem.
                        <br /><br />
                        Pamiętaj - podanie danych jest w 100% dobrowolne, a ich niepodanie spowoduje jedynie brak zmiany dotychczasowej formy kontaktu z działem HR w celu uzyskania informacji dotyczących zatrudnienia.
                    </Typography>
                </Box>

                {/* Prawa strona - Telefon */}
                <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle2" sx={{ 
                        fontWeight: 600, 
                        mb: 1, 
                        fontSize: '10pt',
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 0.5 
                    }}>
                        <PhoneIcon color="primary" fontSize="small" />
                        {t('Worker.Phone', 'Telefon')}
                    </Typography>
                    <TextField
                        fullWidth
                        variant="outlined"
                        size="small"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder={t('Worker.PhonePlaceholder', 'Wprowadź numer telefonu')}
                        sx={{
                            mb: 2,
                            '& .MuiOutlinedInput-root': {
                                fontSize: '9pt',
                                fontFamily: "'Segoe UI Light', 'Open Sans', Verdana, Arial, Helvetica, sans-serif",
                                height: '32px'
                            }
                        }}
                    />
                    
                    {/* Zgody na przetwarzanie danych */}
                    <Typography variant="subtitle2" sx={{ 
                        fontWeight: 600, 
                        mb: 1.5, 
                        fontSize: '10pt'
                    }}>
                        Zgody na przetwarzanie danych
                    </Typography>
                    
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
                                        sx={{ padding: '4px' }}
                                    />
                                }
                                label={
                                    <Typography variant="body2" sx={{ fontSize: '9pt', lineHeight: 1.3 }}>
                                        {consent.label}
                                    </Typography>
                                }
                                sx={{ mb: 0.5, marginLeft: 0 }}
                            />
                        ))}
                    </FormGroup>
                </Box>
            </Box>

            {/* Dolna sekcja - Przycisk zatwierdzania */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 'auto' }}>
                <Button
                    variant="contained"
                    startIcon={<SaveIcon />}
                    onClick={handleSubmit}
                    disabled={isSubmitting || !isFormChanged()}
                >
                    {isSubmitting
                        ? t('Common.Saving', 'Zapisywanie...')
                        : t('Common.Save', 'Zatwierdź zmiany')
                    }
                </Button>
            </Box>
        </Box>
    );
};

export default EmailConsentComponent;

// Export the interface for use in other components
export type { EmailConsentFormData };