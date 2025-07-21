import React from 'react';
import { 
  Button as MUIButton, 
  Card, 
  CardContent, 
  Typography, 
  TextField,
  Stack,
  Box,
  Paper,
  IconButton,
  Chip,
  Alert
} from '@mui/material';
import { 
  Person as PersonIcon,
  Settings as SettingsIcon,
  Dashboard as DashboardIcon,
  Notifications as NotificationsIcon
} from '@mui/icons-material';
import styled from '@emotion/styled';
import { useTheme } from '@emotion/react';

// Custom styled component with Emotion
const CustomCard = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  border: 1px solid ${({ theme }) => theme.colors.border};
  backdrop-filter: blur(10px);
`;

const AnimatedButton = styled(MUIButton)`
  transition: all 0.3s ease;
  transform: scale(1);
  
  &:hover {
    transform: scale(1.05);
    box-shadow: 0 8px 25px rgba(0, 123, 255, 0.3);
  }
`;

export const MUIComponentsDemo: React.FC = () => {
  const theme = useTheme();

  return (
    <Box sx={{ p: 3, maxWidth: 800, margin: '0 auto' }}>
      <Typography variant="h3" gutterBottom sx={{ textAlign: 'center', mb: 4 }}>
        MUI Integration Demo
      </Typography>

      <Stack spacing={4}>
        {/* Buttons Section */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>
            Buttons (MUI + Custom Styling)
          </Typography>
          <Stack direction="row" spacing={2} flexWrap="wrap" sx={{ gap: 2 }}>
            <MUIButton variant="contained" color="primary">
              Standard MUI Button
            </MUIButton>
            <AnimatedButton variant="outlined" color="secondary">
              Custom Animated Button
            </AnimatedButton>
            <MUIButton variant="text" startIcon={<PersonIcon />}>
              With Icon
            </MUIButton>
          </Stack>
        </Paper>

        {/* Cards Section */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>
            Cards (MUI vs Custom)
          </Typography>
          <Stack direction="row" spacing={3} sx={{ flexWrap: 'wrap', gap: 2 }}>
            <Card sx={{ minWidth: 275, flex: '1 1 300px' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  MUI Card
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  This is a standard Material-UI card with theme integration.
                  It automatically adapts to light/dark mode.
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Chip label="MUI Component" color="primary" size="small" />
                </Box>
              </CardContent>
            </Card>

            <CustomCard style={{ minWidth: '275px', flex: '1 1 300px' }}>
              <Typography variant="h6" gutterBottom>
                Custom Emotion Card
              </Typography>
              <Typography variant="body2" color="text.secondary">
                This is our custom card using Emotion styling.
                It maintains the same glassmorphism effect as our other components.
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Chip label="Custom Component" color="secondary" size="small" />
              </Box>
            </CustomCard>
          </Stack>
        </Paper>

        {/* Form Elements */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>
            Form Elements
          </Typography>
          <Stack spacing={3}>
            <TextField
              label="Name"
              variant="outlined"
              fullWidth
              placeholder="Enter your name"
            />
            <TextField
              label="Email"
              variant="outlined"
              type="email"
              fullWidth
              placeholder="Enter your email"
            />
            <Stack direction="row" spacing={2}>
              <MUIButton variant="contained" color="primary" fullWidth>
                Submit
              </MUIButton>
              <MUIButton variant="outlined" color="secondary" fullWidth>
                Cancel
              </MUIButton>
            </Stack>
          </Stack>
        </Paper>

        {/* Icons and Actions */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>
            Icons and Actions
          </Typography>
          <Stack direction="row" spacing={2} alignItems="center">
            <IconButton color="primary">
              <DashboardIcon />
            </IconButton>
            <IconButton color="secondary">
              <PersonIcon />
            </IconButton>
            <IconButton color="default">
              <SettingsIcon />
            </IconButton>
            <IconButton color="warning">
              <NotificationsIcon />
            </IconButton>
          </Stack>
        </Paper>

        {/* Alerts */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>
            Alerts
          </Typography>
          <Stack spacing={2}>
            <Alert severity="success">
              MUI components are now integrated with your custom theme!
            </Alert>
            <Alert severity="info">
              You can use both MUI and custom components side by side.
            </Alert>
            <Alert severity="warning">
              Make sure to maintain consistency in your design system.
            </Alert>
          </Stack>
        </Paper>
      </Stack>
    </Box>
  );
};
