import React, { useState } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  Box,
  Stack,
  Alert,
  CircularProgress,
  Chip,
  Divider,
} from '@mui/material';
import { useAuthStore } from '../../lib/stores';
import { useMyIDPPlans, useCreateIDPPlan, useAddIDPGoalFrontend } from '../../lib/hooks';
import type { CreateIDPGoalRequest, IDPFrontendDto, IDPGoalFrontendDto } from '../../lib/api/types';

const IDPTestPage: React.FC = () => {
  const { user } = useAuthStore();
  const { data: idpPlans, isLoading, error, refetch } = useMyIDPPlans();
  const createPlanMutation = useCreateIDPPlan();
  const addGoalMutation = useAddIDPGoalFrontend();

  const [newGoal, setNewGoal] = useState<CreateIDPGoalRequest>({
    title: '',
    description: '',
    category: 'business',
  });
  const [selectedPlanId, setSelectedPlanId] = useState<string>('');

  const handleCreatePlan = async () => {
    if (!user) return;
    
    try {
      await createPlanMutation.mutateAsync({
        employeeId: user.id,
        year: new Date().getFullYear(),
      });
      refetch();
    } catch (error) {
      console.error('Failed to create plan:', error);
    }
  };

  const handleAddGoal = async () => {
    if (!selectedPlanId || !newGoal.title || !newGoal.description) return;

    try {
      await addGoalMutation.mutateAsync({
        planId: selectedPlanId,
        data: newGoal,
      });
      setNewGoal({ title: '', description: '', category: 'business' });
      refetch();
    } catch (error) {
      console.error('Failed to add goal:', error);
    }
  };

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        🎯 Test Integracji IDP
      </Typography>
      
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        Witaj, {user?.firstName} {user?.lastName}! Testujemy integrację z backendem.
      </Typography>

      <Divider sx={{ my: 3 }} />

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          Błąd podczas ładowania planów IDP: {error.message}
        </Alert>
      )}

      {/* Create New Plan Section */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Tworzenie nowego planu IDP
          </Typography>
          <Button
            variant="contained"
            onClick={handleCreatePlan}
            disabled={createPlanMutation.isPending}
          >
            {createPlanMutation.isPending && <CircularProgress size={20} sx={{ mr: 1 }} />}
            Utwórz nowy plan na {new Date().getFullYear()}
          </Button>
        </CardContent>
      </Card>

      {/* Existing Plans Section */}
      <Typography variant="h6" gutterBottom>
        Twoje plany IDP ({idpPlans?.length || 0})
      </Typography>

      <Stack spacing={2}>
        {idpPlans?.map((plan: IDPFrontendDto) => (
          <Card key={plan.id}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="start" mb={2}>
                <Typography variant="h6">
                  Plan {plan.year}
                </Typography>
                <Chip 
                  label={plan.status} 
                  color={plan.status === 'draft' ? 'default' : 'primary'}
                  size="small"
                />
              </Box>
              
              <Typography variant="body2" color="text.secondary" gutterBottom>
                ID: {plan.id}
              </Typography>
              
              <Typography variant="body2" gutterBottom>
                Liczba celów: {plan.goals?.length || 0}
              </Typography>

              {plan.goals && plan.goals.length > 0 && (
                <Box mt={2}>
                  <Typography variant="subtitle2" gutterBottom>
                    Cele:
                  </Typography>
                  {plan.goals.map((goal: IDPGoalFrontendDto) => (
                    <Box key={goal.id} sx={{ mb: 1, p: 1, bgcolor: 'grey.50', borderRadius: 1 }}>
                      <Typography variant="body2" fontWeight="medium">
                        {goal.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {goal.category} | {goal.status}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              )}

              <Button
                size="small"
                onClick={() => setSelectedPlanId(plan.id)}
                sx={{ mt: 2 }}
              >
                Wybierz do dodania celu
              </Button>
            </CardContent>
          </Card>
        ))}
      </Stack>

      {/* Add Goal Section */}
      {selectedPlanId && (
        <Card sx={{ mt: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Dodaj cel do planu {selectedPlanId}
            </Typography>
            
            <Stack spacing={2}>
              <TextField
                fullWidth
                label="Tytuł celu"
                value={newGoal.title}
                onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
              />
              
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Opis celu"
                value={newGoal.description}
                onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
              />
              
              <TextField
                fullWidth
                select
                label="Kategoria"
                value={newGoal.category}
                onChange={(e) => setNewGoal({ ...newGoal, category: e.target.value as 'business' | 'development' })}
                SelectProps={{
                  native: true,
                }}
              >
                <option value="business">Business</option>
                <option value="development">Development</option>
              </TextField>
              
              <Box>
                <Button
                  variant="contained"
                  onClick={handleAddGoal}
                  disabled={addGoalMutation.isPending || !newGoal.title || !newGoal.description}
                >
                  {addGoalMutation.isPending && <CircularProgress size={20} sx={{ mr: 1 }} />}
                  Dodaj cel
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => setSelectedPlanId('')}
                  sx={{ ml: 2 }}
                >
                  Anuluj
                </Button>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      )}

      {/* Refresh Button */}
      <Box mt={4} display="flex" justifyContent="center">
        <Button variant="outlined" onClick={() => refetch()}>
          Odśwież dane
        </Button>
      </Box>
    </Container>
  );
};

export default IDPTestPage;
