import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField'

const steps = [
  {
    label: 'Персональні дані',
  },
  {
    label: 'Підстава для отримання статусу дитини, яка постраждала внаслідок воєнних дій та збройних конфліктів',
  },
  {
    label: 'Дата та час',
  },
];

const initialFormData = Object.freeze({
    surname: '',
    name: '',
    fatherly: '',
    ipn: '',
    region: '',
    community: '',
    dateRecording: '',
    recordingTime: ''
  });

export const VerticalLinearStepper = () => {
  const [activeStep, setActiveStep] = React.useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const [formData, setFormData] = React.useState(initialFormData);

  const handleChange = ({ target: { name, value } }) => {
    setFormData({ ...formData, hasChanged: true, [name]: value });
  };

  
  return (
    <Box sx={{ maxWidth: 400 }}>
      <Stepper activeStep={activeStep} orientation="vertical">
        {steps.map((step, index) => (
          <Step key={step.label}>
            <StepLabel
              optional={
                index === 2 ? (
                  <Typography variant="caption">Last step</Typography>
                ) : null
              }
            >
              {step.label}
            </StepLabel>

            <StepContent>
              {/* <Typography>{step.description}</Typography> */}
                {index === 0 ? (
                    <TextField
                    required
                    fullWidth
                    id="lastname"
                    label="Прізвище"
                    name="surname"
                    onChange={handleChange}
                    autoFocus
                    value={formData.surname}
                    autoComplete="surname"
                  />
                ) : null}
                {index === 1 ? (
                    <TextField
                    required
                    fullWidth
                    id="lastname"
                    label="Ім'я"
                    name="surname"
                    autoComplete="surname"
                    autoFocus
                  />
                ) : null}
                {index === 2 ? (
                    <TextField
                    required
                    fullWidth
                    id="lastname"
                    label="Ім'я"
                    name="surname"
                    autoComplete="surname"
                    autoFocus
                  />
                ) : null}
              <Box sx={{ mb: 2 }}>
                <div>
                  <Button
                    variant="contained"
                    onClick={handleNext}
                    sx={{ mt: 1, mr: 1 }}
                  >
                    {index === steps.length - 1 ? 'Finish' : 'Continue'}
                  </Button>
                  <Button
                    disabled={index === 0}
                    onClick={handleBack}
                    sx={{ mt: 1, mr: 1 }}
                  >
                    Back
                  </Button>
                </div>
              </Box>
            </StepContent>

          </Step>
        ))}
      </Stepper>
      {activeStep === steps.length && (
        <Paper square elevation={0} sx={{ p: 3 }}>
          <Typography>All steps completed - you&apos;re finished</Typography>
          <Button onClick={handleReset} sx={{ mt: 1, mr: 1 }}>
            Reset
          </Button>
        </Paper>
      )}
    </Box>
  );
}