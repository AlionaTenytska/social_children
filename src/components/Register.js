import * as React from 'react';
import axios from "axios";
import { IconButton, Modal, Button, CssBaseline, TextField, Box, Typography, Container, FormControl, Grid, Stepper, Step, StepLabel, StepContent, FormControlLabel, Checkbox, FormGroup, ToggleButtonGroup, ToggleButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { Header } from './Header'
import { Theme } from './Theme'
import CloseIcon from '@mui/icons-material/Close';

const baseURL = process.env.REACT_APP_API_KEY;

function isValidIPN(message) {
  return this.test("isValidIPN", message, function (value) {
    const { path, createError } = this;

    if (value.length === 10) {
      let newArray = [];
      for (var i of value) {
        newArray.push(i);
      }
      let number = newArray.pop();
      let arr = [-1, 5, 7, 9, 4, 6, 10, 5, 7];

      let sum = newArray.reduce(function (r, a, i) { return r + a * arr[i] }, 0);
      let remainder = sum % 11;
      if (remainder === 10) {
        remainder = 0;
      }
      if (remainder != number) {
        return createError({ path, message: message });
      }

    }
    return true;
  });
}

const initialFormData = Object.freeze({
  surname: '',
  name: '',
  patronymic: '',
  number: '',
  month: '',
  date: '',
  time: ''
});

const monthNamesUkrainian = [
  'Січень',
  'Лютий',
  'Березень',
  'Квітень',
  'Травень',
  'Червень',
  'Липень',
  'Серпень',
  'Вересень',
  'Жовтень',
  'Листопад',
  'Грудень',
];

export const Form = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = React.useState(initialFormData);
  const [activeStep, setActiveStep] = React.useState(0);
  const [dates, setDates] = React.useState([]);
  const [month, setMonth] = React.useState([]);
  const [times] = React.useState([
    '9:00',
    '9:20',
    '9:40',
    '10:00',
    '10:20',
    '10:40',
    '11:00',
    '11:20',
    '11:40',
  ]);
  const [steps] = React.useState([
    {
      label: 'Інформаційна довідка',
    },
    {
      label: 'Персональні дані',
    },
    {
      label: 'Дата та час',
    },
  ]);

  Yup.addMethod(Yup.string, "isValidIPN", isValidIPN);

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .required("Це обов'язкове поле")
      .matches(/^([^0-9]*)$/, "Не коректно введені дані")
      .min(2, "Не коректно введені дані"),
    surname: Yup.string()
      .required("Це обов'язкове поле")
      .matches(/^([^0-9]*)$/, "Не коректно введені дані")
      .min(2, "Не коректно введені дані"),
    patronymic: Yup.string()
      .required("Це обов'язкове поле")
      .matches(/^([^0-9]*)$/, "Не коректно введені дані")
      .min(5, "Не коректно введені дані"),
    number: Yup.string()
      .matches(/^([^А-Я,а-я]*)$/, "Не коректно введені дані")
      .required("Це обов'язкове поле")
      .min(10, 'РНОКПП (ІПН) складається з десяти цифр')
      .max(10, 'РНОКПП (ІПН) складається з десяти цифр')
      .isValidIPN('Не вірно вказаний РНОКПП (ІПН)'),
    month: Yup.string()
      .required("Це обов'язкове поле")
      .typeError("Це обов'язкове поле"),
    date: Yup.string()
      .required("Це обов'язкове поле"),
    time: Yup.string()
      .required("Це обов'язкове поле")
  });

  const {
    register,
    formState: { errors },
  } = useForm({
    mode: 'all',
    resolver: yupResolver(validationSchema),
  });

  const handleChange = ({ target: { name, value } }) => {
    setFormData({ ...formData, hasChanged: true, [name]: value });
  };
  const [open, setOpen] = React.useState(false);
  const handleClose = () => setOpen(false);

  const [open2, setOpen2] = React.useState(false);
  const handleClose2 = () => setOpen2(false);

  const [open3, setOpen3] = React.useState(false);
  const handleClose3 = () => setOpen3(false);


  const handleSubmit = (e) => {
    e.preventDefault()
    axios.post(`${baseURL}/applications`, formData).then((response) => {
      if (response.data.status == 'number_is_exists') {
        setOpen(true);
      } else if (response.data.status == 'date_is_exists') {
        setOpen3(true);
      }
      else {
        navigate(`/coupon/${response.data.data.id}`);
      }
    }).catch(function (error) {
      setOpen2(true)
    });
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const [personData, setPersonData] = React.useState(false);
  function handleClickPersonData() {
    setPersonData(!personData);
  }

  const [isShown, setIsShown] = React.useState(false);

  function handleClickMonth() {
    setIsShown(true);
  }

  function getMondayTuesdaysWednesdayFormatted(month) {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const result = [];
    const monthId = monthNamesUkrainian.indexOf(month);
    let date = new Date(year, monthId, 1);
    while (date.getMonth() === monthId) {
      if (date.getDay() === 1 || date.getDay() === 2 || date.getDay() === 3) {
        const formattedDate = `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
        result.push(formattedDate);
      }
      date.setDate(date.getDate() + 1);
    }
    setDates(result);
  }

  const [chosenMonths, setChosenMonth] = React.useState('');
  const [chosenDate, setChosenDate] = React.useState('');
  const [chosenTime, setChosenTime] = React.useState('');

  const changeMonth = (e, newAlignment) => {
    setChosenMonth(newAlignment);
    setFormData({ ...formData, month: newAlignment, date: '', time: '' });
    getMondayTuesdaysWednesdayFormatted(newAlignment);
    setChosenDate('');
    setChosenTime('');
  }

  const changeDate = (e, newAlignment) => {
    setChosenDate(newAlignment);
    setFormData({ ...formData, date: newAlignment, time: '' });
    setChosenTime('');
  }

  const changeTime = (e, newAlignment) => {
    setChosenTime(newAlignment);
    setFormData({ ...formData, time: newAlignment });
  };

  async function getMonthFormatted() {
    const result = [];
    for (let i = 6; i < monthNamesUkrainian.length; i++) {
      result.push(monthNamesUkrainian[i]);
    }
    setMonth(result);
  }

  React.useEffect(() => {
    const expensesListResp = async () => {
      await getMonthFormatted();
    }
    expensesListResp();
  }, []);

  return (
    <Theme>
      <CssBaseline />
      <Header />
      <Container component="main" maxWidth="lg" sx={{ mb: 4, mt: 5 }}>
        <Typography component="h1" variant="h5" align='center' color="inherit" sx={{ mt: 2, fontWeight: 500 }}>
          ЗАПИС ДО ЕЛЕКТРОННОЇ ЧЕРГИ
        </Typography>

        <Typography align='center' color="inherit" sx={{ mb: 4, fontSize: 16 }}>
          для складання акту оцінки потреб сім’ї/особи для надання статусу дитині, яка постраждала в наслідок воєнних дій та збройних конфліктів
        </Typography>

        <Stepper activeStep={activeStep} orientation="vertical" sx={{
          ".css-obmozu-MuiSvgIcon-root-MuiStepIcon-root": {
            width: 35,
            height: 35,
          },
          ".css-1ii4bie .MuiStepLabel-iconContainer": {
            width: 35,
            height: 35,
          },
          ".css-114vcqt-MuiStepLabel-label.Mui-active": {
            fontSize: 20,
          },
          ".Mui-disabled .css-114vcqt-MuiStepLabel-label": {
            fontSize: 16,
          },
          ".Mui-completed .css-114vcqt-MuiStepLabel-label": {
            fontSize: 16,
          },
          ".css-14yr603-MuiStepContent-root, .css-d0mviz": {
            borderLeft: '2px solid rgb(22, 150, 22)',
            marginLeft: '17px',
          },
          ".css-8t49rw-MuiStepConnector-line, .css-vgb7rt": {
            borderLeft: '2px solid rgb(22, 150, 22)',
            marginLeft: '5px',
          },
          ".MuiStepLabel-iconContainer .MuiSvgIcon-root": {
            borderRadius: "50%",
            border: "1px solid rgb(22, 150, 22)",
            width: "1.5em",
            height: "1.5em"
          },
          ".MuiStepLabel-iconContainer .MuiSvgIcon-root:not(.Mui-completed)": {
            color: "white"
          },
          ".MuiStepLabel-iconContainer .MuiStepIcon-text": {
            fill: "rgb(22, 150, 22)",
            fontWeight: 500
          },
          ".MuiStepLabel-iconContainer .MuiSvgIcon-root.Mui-active": {
            color: "rgb(22, 150, 22)",
            padding: "3px",
            borderRadius: "50%",
            border: "1px solid rgb(22, 150, 22)",
            marginY: "-3px",
            width: "1.5em",
            height: "1.5em"
          },
          ".MuiStepLabel-iconContainer .Mui-active .MuiStepIcon-text": {
            fill: "white"
          }
        }}>
          {steps.map((step, index) => (
            <Step key={step.label}>
              <StepLabel>
                {step.label}
              </StepLabel>

              <StepContent>
                {index === 0 ? (
                  <Box>
                    <Grid container spacing={4}>

                      <Grid item xs={12} sm={6} >
                        <Typography align='left' color="inherit" sx={{ mb: 4, fontSize: 16 }}>
                          Звертаємо вашу увагу, що звертатися можуть тільки мешканці Сумської міської територіальної громади.
                        </Typography>
                        <Typography align='left' color="inherit" sx={{ mb: 4, fontSize: 16 }}>
                          <b>Адреса:</b> м. Суми, вул. Харківська 42
                        </Typography>
                      </Grid>

                      <Grid item xs={12} sm={6}>

                        <Typography align='left' color="inherit" sx={{ fontSize: 16, fontWeight: 700, mb: 1 }}>
                          Для складання акту оцінки потреб сім’ї/особи при собі необхідно мати оригінали документіви:
                        </Typography>
                        <Typography sx={{ fontSize: 16 }}>
                          — свідоцтво про народження дитини або інший документ, що посвідчує особу дитини;
                        </Typography>
                        <Typography>
                          — документ, що підтверджує повноваження законного представника дитини або родинні стосунки між дитиною та заявником;
                        </Typography>
                        <Typography>
                          — довідка про взяття дитини на облік як внутрішньо переміщеної особи (у разі наявності).
                        </Typography>
                      </Grid>

                    </Grid>
                    <div>
                      <Button
                        variant="contained"
                        onClick={handleNext}
                        size="large"
                        sx={{ mt: 2, pr: 4, pl: 4, borderRadius: 2 }}
                      >
                        Далі
                      </Button>
                    </div>
                  </Box>
                ) : null}
                {index === 1 ? (
                  <Box>
                    <Grid container spacing={4} sx={{ pt: 2 }}>

                      <Grid item xs={12} sm={6}>
                        <TextField
                          {...register("surname")}
                          required
                          fullWidth
                          id="lastname"
                          label="Прізвище"
                          name="surname"
                          autoComplete="surname"
                          onChange={handleChange}
                          value={formData.surname}
                          error={errors.surname ? true : false}
                          helperText={errors.surname?.message}
                        />
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <TextField
                          {...register("name")}
                          required
                          fullWidth
                          name="name"
                          label="Ім'я"
                          id="name"
                          value={formData.name}
                          autoComplete="name"
                          onChange={handleChange}
                          error={errors.name ? true : false}
                          helperText={errors.name?.message}
                        />
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <TextField
                          {...register("patronymic")}
                          required
                          fullWidth
                          name="patronymic"
                          label="По-батькові"
                          id="patronymic"
                          autoComplete="patronymic"
                          value={formData.patronymic}
                          onChange={handleChange}
                          error={errors.patronymic ? true : false}
                          helperText={errors.patronymic?.message}
                        />
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <TextField
                          {...register("number")}
                          required
                          fullWidth
                          inputProps={{ maxLength: 10 }}
                          name="number"
                          label="РНОКПП (ІПН)"
                          id="number"
                          autoComplete="number"
                          onChange={handleChange}
                          value={formData.number}
                          error={errors.number ? true : false}
                          helperText={errors.number?.message}
                        />
                      </Grid>
                    </Grid>
                    <div>
                      <Button
                        variant="contained"
                        onClick={handleNext}
                        size="large"
                        disabled={(Object.keys(errors) != 0) || !formData.surname || !formData.patronymic || !formData.name || !formData.number}
                        sx={{ mt: 2, pr: 4, pl: 4, borderRadius: 2 }}
                      >
                        Далі
                      </Button>
                      <Button
                        onClick={handleBack}
                        size="large"
                        sx={{ mt: 2, pr: 4, pl: 4, borderRadius: 2 }}
                      >
                        Назад
                      </Button>
                    </div>
                  </Box>

                ) : null}
                {index === 2 ? (
                  <Box>
                    <Grid container spacing={4}>
                      <Grid item xs={12} sm={12}>
                        <FormControl fullWidth>
                          <Typography align='left' color="inherit" sx={{ mb: 2 }}>
                            Оберіть місяць:*
                          </Typography>
                          <ToggleButtonGroup
                            color="primary"
                            spacing={{ xs: 0, md: 2, lg: 3 }}
                            value={chosenMonths}
                            exclusive
                            onChange={changeMonth}
                            onClick={handleClickMonth}
                            sx={{
                              display: 'grid',
                              gridGap: 8,
                              '@media (min-width: 320px)': { gridTemplateColumns: 'repeat(2, auto)' },
                              '@media (min-width: 400px)': { gridTemplateColumns: 'repeat(3, auto)' },
                              '@media (min-width: 600px)': { gridTemplateColumns: 'repeat(5, auto)' },
                              '@media (min-width: 700px)': { gridTemplateColumns: 'repeat(6, auto)' },
                              '@media (min-width: 900px)': { gridTemplateColumns: 'repeat(6, auto)' },
                              '@media (min-width: 1000px)': { gridTemplateColumns: 'repeat(6, auto)' },

                              ".MuiToggleButtonGroup-grouped:not(:first-of-type)": {
                                borderRadius: '3px',
                                borderLeft: "1px solid rgba(0, 0, 0, 0.12)"
                              },
                              ".MuiToggleButtonGroup-grouped:not(:last-of-type)": {
                                borderRadius: '3px',
                                borderLeft: "1px solid rgba(0, 0, 0, 0.12)"
                              }
                            }}
                          >
                            {month.map((month) => (
                              <ToggleButton key={month} value={month}>
                                {month}
                              </ToggleButton>
                            ))}
                          </ToggleButtonGroup>
                        </FormControl>
                      </Grid>



                      {(isShown && chosenMonths != null) ? (
                        <Grid item xs={12} sm={12}>
                          <FormControl fullWidth>
                            <Typography align='left' color="inherit" sx={{ mb: 2 }}>
                              Оберіть дату:*
                            </Typography>
                            <ToggleButtonGroup
                              color="primary"
                              spacing={{ xs: 0, md: 2, lg: 3 }}
                              value={chosenDate}
                              exclusive
                              onChange={changeDate}
                              sx={{
                                display: 'grid',
                                gridGap: 8,
                                '@media (min-width: 320px)': { gridTemplateColumns: 'repeat(2, auto)' },
                                '@media (min-width: 400px)': { gridTemplateColumns: 'repeat(3, auto)' },
                                '@media (min-width: 600px)': { gridTemplateColumns: 'repeat(5, auto)' },
                                '@media (min-width: 700px)': { gridTemplateColumns: 'repeat(6, auto)' },
                                '@media (min-width: 900px)': { gridTemplateColumns: 'repeat(8, auto)' },
                                '@media (min-width: 1000px)': { gridTemplateColumns: 'repeat(9, auto)' },

                                ".MuiToggleButtonGroup-grouped:not(:first-of-type)": {
                                  borderRadius: '3px',
                                  borderLeft: "1px solid rgba(0, 0, 0, 0.12)"
                                },
                                ".MuiToggleButtonGroup-grouped:not(:last-of-type)": {
                                  borderRadius: '3px',
                                  borderLeft: "1px solid rgba(0, 0, 0, 0.12)"
                                }
                              }}
                            >
                              {dates.map((date) => (
                                <ToggleButton key={date} value={date}>
                                  {date}
                                </ToggleButton>
                              ))}
                            </ToggleButtonGroup>
                          </FormControl>
                        </Grid>
                      ) : false}



                      {(isShown && chosenMonths != null) ? (
                        <Grid item xs={12} sm={12}>
                          <FormControl fullWidth error={errors.time ? true : false}>
                            <Typography align='left' color="inherit" sx={{ mb: 1 }}>
                              Оберіть час:*
                            </Typography>
                            <ToggleButtonGroup
                              color="primary"
                              value={chosenTime}
                              exclusive
                              onChange={changeTime}
                              sx={{
                                display: 'grid',
                                gridGap: 8,
                                '@media (min-width: 320px)': { gridTemplateColumns: 'repeat(2, auto)' },
                                '@media (min-width: 400px)': { gridTemplateColumns: 'repeat(3, auto)' },
                                '@media (min-width: 600px)': { gridTemplateColumns: 'repeat(5, auto)' },
                                '@media (min-width: 700px)': { gridTemplateColumns: 'repeat(6, auto)' },
                                '@media (min-width: 900px)': { gridTemplateColumns: 'repeat(8, auto)' },
                                '@media (min-width: 1000px)': { gridTemplateColumns: 'repeat(9, auto)' },

                                ".MuiToggleButtonGroup-grouped:not(:first-of-type)": {
                                  borderRadius: '3px',
                                  borderLeft: "1px solid rgba(0, 0, 0, 0.12)"
                                },
                                ".MuiToggleButtonGroup-grouped:not(:last-of-type)": {
                                  borderRadius: '3px',
                                  borderLeft: "1px solid rgba(0, 0, 0, 0.12)"
                                }
                              }}
                            >
                              {times.map((time) => (
                                <ToggleButton key={time} value={time} sx={{ pr: 4, pl: 4 }} disabled={!formData.date}>
                                  {time}
                                </ToggleButton>
                              ))}
                            </ToggleButtonGroup>
                          </FormControl>
                        </Grid>
                      ) : false}
                      <Grid item xs={12} sm={12} sx={{ mt: -2 }}>
                        <FormGroup >
                          <FormControlLabel control={<Checkbox checked={personData} onClick={handleClickPersonData} />} label="Даю згоду на обробку персональних даних* " />
                        </FormGroup>
                      </Grid>
                    </Grid>

                    <div>
                      <Button
                        onClick={handleSubmit}
                        disabled={(Object.keys(errors) != 0) || !formData.surname || !formData.patronymic || !formData.name || !formData.number || !formData.month || !formData.date || !formData.time || personData === false}
                        type="submit"
                        size="large"
                        variant="contained"
                        sx={{ mt: 2, mb: 2, pr: 3, pl: 3, borderRadius: 2 }}
                      >
                        Записатися
                      </Button>
                      <Button
                        onClick={handleBack}
                        size="large"
                        sx={{ mt: 2, mb: 2, pr: 3, pl: 3, borderRadius: 2 }}
                      >
                        Назад
                      </Button>
                    </div>
                  </Box>
                ) : null}

              </StepContent>

            </Step>
          ))}
        </Stepper>

        <Modal
          open={open}
          onClose={handleClose}
          sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 1 }}
        >
          <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            '@media (min-width: 300px)': { width: 250 },
            '@media (min-width: 400px)': { width: 300 },
            '@media (min-width: 600px)': { width: 400 },
            '@media (min-width: 700px)': { width: 450 },
            '@media (min-width: 900px)': { width: 500 },
            '@media (min-width: 1000px)': { width: 600 },
            minWidth: 200,
            bgcolor: 'background.paper',
            borderRadius: 3,
            boxShadow: 24,
            p: 4,
          }}>
            <IconButton
              aria-label="close"
              onClick={handleClose}
              sx={{
                position: 'absolute',
                right: 8,
                top: 8,
                color: (theme) => theme.palette.grey[500],
              }}
            >
              <CloseIcon />
            </IconButton>
            <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ textAlign: 'center', color: 'red' }}>
              Увага!
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 1 }}>
              Користувач з таким РНОКПП (ІПН) вже записаний до електронної черги.
            </Typography>
          </Box>
        </Modal>

        <Modal
          open={open3}
          onClose={handleClose3}
          sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 1 }}
        >
          <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            '@media (min-width: 300px)': { width: 250 },
            '@media (min-width: 400px)': { width: 300 },
            '@media (min-width: 600px)': { width: 400 },
            '@media (min-width: 700px)': { width: 450 },
            '@media (min-width: 900px)': { width: 500 },
            '@media (min-width: 1000px)': { width: 600 },
            minWidth: 200,
            bgcolor: 'background.paper',
            borderRadius: 3,
            boxShadow: 24,
            p: 4,
          }}>
            <IconButton
              aria-label="close"
              onClick={handleClose3}
              sx={{
                position: 'absolute',
                right: 8,
                top: 8,
                color: (theme) => theme.palette.grey[500],
              }}
            >
              <CloseIcon />
            </IconButton>
            <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ textAlign: 'center', color: 'red' }}>
              Вибачте, обрані дата та час вже зайняті.
            </Typography>
          </Box>
        </Modal>

        <Modal
          open={open2}
          onClose={handleClose2}
          sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 1 }}
        >
          <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            '@media (min-width: 300px)': { width: 250 },
            '@media (min-width: 400px)': { width: 300 },
            '@media (min-width: 600px)': { width: 400 },
            '@media (min-width: 700px)': { width: 450 },
            '@media (min-width: 900px)': { width: 500 },
            '@media (min-width: 1000px)': { width: 600 },
            minWidth: 200,
            bgcolor: 'background.paper',
            borderRadius: 3,
            boxShadow: 24,
            p: 4,
          }}>
            <IconButton
              aria-label="close"
              onClick={handleClose2}
              sx={{
                position: 'absolute',
                right: 8,
                top: 8,
                color: (theme) => theme.palette.grey[500],
              }}
            >
              <CloseIcon />
            </IconButton>
            <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ textAlign: 'center', color: 'red' }}>
              Сервер не відповідає! Будь ласка, повторіть запит пізніше.
            </Typography>
          </Box>
        </Modal>

      </Container>
    </Theme>
  );
}