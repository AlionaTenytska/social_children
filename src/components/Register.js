import * as React from 'react';
import axios from "axios";
import { IconButton, Modal, Button, CssBaseline, TextField, Box, Typography, Container, Select, InputLabel, MenuItem, OutlinedInput, FormControl, Grid, FormHelperText, Stepper, Step, StepLabel, StepContent, Paper, RadioGroup, FormControlLabel, FormLabel, Radio, Checkbox, FormGroup, ButtonGroup, ToggleButtonGroup, ToggleButton } from '@mui/material';
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
  region: '',
  community_id: '',
  date: '',
  time: ''
});

export const Form = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = React.useState(initialFormData);
  const [activeStep, setActiveStep] = React.useState(0);
  const [dates, setDates] = React.useState([]);
  const [communities, setCommunities] = React.useState([]);
  const [regions, setRegions] = React.useState([]);
  const [times] = React.useState([
    '8:15',
    '8:45',
    '9:15',
    '9:45',
    '10:15',
    '10:45',
    '11:15',
    '13:15',
    '13:45',
    '14:15',
  ]);
  const [steps] = React.useState([
    {
      label: 'Персональні дані',
    },
    {
      label: 'Підстава для отримання статусу дитини, яка постраждала внаслідок воєнних дій та збройних конфліктів',
    },
    {
      label: 'Місце, дата та час',
    },
  ]);
  const [reservedDates, setReservedDates] = React.useState([]);

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
    region: Yup.string()
      .required("Це обов'язкове поле")
      .typeError("Це обов'язкове поле"),
    community_id: Yup.string()
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


  const handleSubmit = (e) => {
    e.preventDefault()
    axios.post(`${baseURL}/applications`, formData).then((response) => {
      if (response.data.status == 'number_is_exists') {
        setOpen(true);
      } else {
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

  const [state, setState] = React.useState();
  function handleChangeRadio(event) {
    setState(event.target.value);
  }

  const [isShown, setIsShown] = React.useState(false);

  function handleClickRadio() {
    setIsShown(true);
  }

  const [assesAct, setAssesAct] = React.useState(false);
  function handleClickAssesAct() {
    setAssesAct(!assesAct);
  }

  const [conclusion, setConclusion] = React.useState(false);
  function handleClickConclusion() {
    setConclusion(!conclusion);
  }

  const [personData, setPersonData] = React.useState(false);
  function handleClickPersonData() {
    setPersonData(!personData);
  }

  const filteredCommunities = () => {
    return communities.filter(item => {
      return item.region_id == formData.region
    })
  }

  const [chosenDate, setChosenDate] = React.useState('');

  const changeDate = (e, newAlignment) => {
    setChosenDate(newAlignment);
    setFormData({ ...formData, date: newAlignment });
  }

  const [chosenTime, setChosenTime] = React.useState('');
  const changeTime = (e, newAlignment) => {
    setChosenTime(newAlignment);
    setFormData({ ...formData, time: newAlignment });
  };

  function selectCommunities(e) {
    setFormData({ ...formData, hasChanged: true, [e.target.name]: e.target.value });
    axios.get(`${baseURL}/applications/dates`, {
      params: {
        community_id: e.target.value
      }
    })
      .then((response) => {
        setReservedDates(response.data);
      })
      .catch(function (error) {
        setOpen2(true)
      })
  }

  async function getTuesdaysAndThursdaysFormatted() {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const year = currentDate.getFullYear();
    const result = [];
    let date = new Date(year, currentMonth, 1);
    while (date.getMonth() === currentMonth) {
      if (date.getDay() === 2 || date.getDay() === 4) {
        const formattedDate = `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
        result.push(formattedDate);
      }
      date.setDate(date.getDate() + 1);
    }
    setDates(result);
  }

  async function getRegions() {
    axios.get(`${baseURL}/regions`)
      .then((response) => {
        setRegions(response.data);
      })
      .catch(function (error) {
        setOpen2(true)
      })
  }

  async function getCommunities() {
    axios.get(`${baseURL}/communities`)
      .then((response) => {
        setCommunities(response.data);
      })
      .catch(function (error) {
        setOpen2(true)
      })
  }

  React.useEffect(() => {
    const expensesListResp = async () => {
      await getRegions();
      await getCommunities();
      await getTuesdaysAndThursdaysFormatted();
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
          Робота з дитиною, яка постраждала в наслідок воєнних дій та збройних конфліктів
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
            borderLeft: '2px solid rgba(50,84,255,1)',
            marginLeft: '15px',
          },
          ".css-8t49rw-MuiStepConnector-line, .css-vgb7rt": {
            borderLeft: '2px solid rgba(50,84,255,1)',
            marginLeft: '3px',
          },
          ".MuiStepLabel-iconContainer .MuiSvgIcon-root": {
            borderRadius: "50%",
            border: "1px solid rgba(50,84,255,1)"
          },
          ".MuiStepLabel-iconContainer .MuiSvgIcon-root:not(.Mui-completed)": {
            color: "white"
          },
          ".MuiStepLabel-iconContainer .MuiStepIcon-text": {
            fill: "rgba(50,84,255,1)",
            fontWeight: 500
          },
          ".MuiStepLabel-iconContainer .MuiSvgIcon-root.Mui-active": {
            color: "rgba(50,84,255,1)",
            padding: "3px",
            borderRadius: "50%",
            border: "1px solid rgba(50,84,255,1)",
            marginY: "-3px"
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
                    </div>
                  </Box>
                ) : null}
                {index === 1 ? (
                  <Box>
                    <Grid container spacing={4}>

                      <Grid item xs={12} sm={6} >
                        <FormControl>
                          <RadioGroup
                            aria-labelledby="demo-radio-buttons-group-label"
                            name="radio-buttons-group"
                            onChange={handleChangeRadio}
                            onClick={handleClickRadio}
                          >
                            <FormControlLabel value="wound" control={<Radio checked={true ? (state === 'wound') : false} />} label="Отримали поранення, контузію, каліцтво" />
                            <FormControlLabel value="violence" control={<Radio checked={true ? (state === 'violence') : false} />} label="Зазнали фізичного, сексуального насильства" />
                            <FormControlLabel value="stolen" control={<Radio checked={true ? (state === 'stolen') : false} />} label="Були викрадені або незаконно вивезені за межі України" />
                            <FormControlLabel value="participation" control={<Radio checked={true ? (state === 'participation') : false} />} label="Залучалися до участі у діях воєнізованих чи збройних формувань" />
                            <FormControlLabel value="maintenance" control={<Radio checked={true ? (state === 'maintenance') : false} />} label="Незаконно утримувалися, у тому числі в полоні" />
                            <FormControlLabel value="psychological" control={<Radio checked={true ? (state === 'psychological') : false} />} label="Зазнали психологічного насильства" />
                          </RadioGroup>
                        </FormControl>
                        {isShown && state === 'psychological' ? (
                          <FormGroup>
                            <FormLabel sx={{ mt: 2 }}>Відмітьте наявніть наступних документів: </FormLabel>
                            <FormControlLabel required control={<Checkbox checked={assesAct} onClick={handleClickAssesAct} />} label="Акт оцінки потреб сім’ї " />
                            <FormControlLabel required control={<Checkbox checked={conclusion} onClick={handleClickConclusion} />} label="Висновок оцінки потреби сім’ї " />
                          </FormGroup>
                        ) : false}
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        {isShown && state === 'wound' ? (
                          <Paper elevation={3} sx={{ p: 2 }}>
                            <Typography align='center' color="inherit" sx={{ fontSize: 16, fontWeight: 700, mb: 1 }}>
                              Для надання статусу необхідний перелік документів:
                            </Typography>
                            <Typography sx={{ fontSize: 16 }}>
                              — свідоцтва про народження дитини або іншого документа, що посвідчує особу дитини;
                            </Typography>
                            <Typography>
                              — документа, що посвідчує особу заявника;
                            </Typography>
                            <Typography>
                              — документа, що підтверджує повноваження законного представника дитини або родинні стосунки між дитиною та заявником;
                            </Typography>
                            <Typography>
                              — довідки про взяття дитини на облік як внутрішньо переміщеної особи (у разі наявності);
                            </Typography>
                            <Typography>
                              — паспорта громадянина України, виготовленого у формі книжечки (у разі наявності);
                            </Typography>
                            <Typography>
                              — паспорта громадянина України або паспорта громадянина України для виїзду за кордон у формі е-паспорта або е-паспорта для виїзду за кордон (у разі наявності);
                            </Typography>
                            <Typography>
                              — витягу з реєстру територіальної громади (у разі наявності);
                            </Typography>
                            <Typography>
                              — виписки з медичної картки дитини або консультаційного висновку спеціаліста, видані після медичного обстеження та лікування дитини в закладах охорони здоров’я та науково-дослідних установах, визначених МОЗ, із зазначенням діагнозу згідно з Міжнародною класифікацією хвороб та споріднених проблем здоров’я десятого перегляду, отриманих у період здійснення воєнних дій, збройних конфліктів.
                            </Typography>
                          </Paper>
                        ) : false}

                        {isShown && state === 'violence' ? (
                          <Paper elevation={3} sx={{ p: 2 }}>
                            <Typography align='center' color="inherit" sx={{ fontSize: 16, fontWeight: 700, mb: 1 }}>
                              Для надання статусу необхідний перелік документів:
                            </Typography>
                            <Typography sx={{ fontSize: 16 }}>
                              — свідоцтва про народження дитини або іншого документа, що посвідчує особу дитини;
                            </Typography>
                            <Typography>
                              — документа, що посвідчує особу заявника;
                            </Typography>
                            <Typography>
                              — документа, що підтверджує повноваження законного представника дитини або родинні стосунки між дитиною та заявником;
                            </Typography>
                            <Typography>
                              — довідки про взяття дитини на облік як внутрішньо переміщеної особи (у разі наявності);
                            </Typography>
                            <Typography>
                              — паспорта громадянина України, виготовленого у формі книжечки (у разі наявності);
                            </Typography>
                            <Typography>
                              — паспорта громадянина України або паспорта громадянина України для виїзду за кордон у формі е-паспорта або е-паспорта для виїзду за кордон (у разі наявності);
                            </Typography>
                            <Typography>
                              — витягу з реєстру територіальної громади (у разі наявності);
                            </Typography>
                            <Typography>
                              — заяви про вчинення щодо дитини кримінального правопорушення або про залучення дитини до провадження як потерпілої, зареєстрованої в установленому порядку у відповідних правоохоронних органах;
                            </Typography>
                            <Typography>
                              — витягу з Єдиного реєстру досудових розслідувань про відкриття кримінального провадження (назалежно від результатів досудового розслідування) за зазначеною заявою про вчинення злочину щодо дитини в зоні воєнних дій та збройних конфліктів;
                            </Typography>
                            <Typography>
                              — висновку експерта за результатами судової експертизи (за наявності), проведеної в ході досудового розслідування в кримінальному провадженні, якою встановлено факти фізичного, сексуального насильства щодо дитини внаслідок воєнних дій та збройних конфліктів.
                            </Typography>
                          </Paper>
                        ) : false}
                        {isShown && state === 'stolen' || state === 'participation' || state === 'maintenance' ? (
                          <Paper elevation={3} sx={{ p: 2 }}>
                            <Typography align='center' color="inherit" sx={{ fontSize: 16, fontWeight: 700, mb: 1 }}>
                              Для надання статусу необхідний перелік документів:
                            </Typography>
                            <Typography sx={{ fontSize: 16 }}>
                              — свідоцтва про народження дитини або іншого документа, що посвідчує особу дитини;
                            </Typography>
                            <Typography>
                              — документа, що посвідчує особу заявника;
                            </Typography>
                            <Typography>
                              — документа, що підтверджує повноваження законного представника дитини (у разі коли дитина постійно проживає/перебуває у закладі охорони здоров’я, закладі освіти або іншому дитячому закладі;
                            </Typography>
                            <Typography>
                              — документа, що підтверджує факт перебування дитини в такому закладі) або родинні стосунки між дитиною та заявником;
                            </Typography>
                            <Typography>
                              — довідки про взяття дитини на облік як внутрішньо переміщеної особи (у разі наявності);
                            </Typography>
                            <Typography>
                              — паспорта громадянина України, виготовленого у формі книжечки (у разі наявності);
                            </Typography>
                            <Typography>
                              — паспорта громадянина України або паспорта громадянина України для виїзду за кордон у формі е-паспорта або е-паспорта для виїзду за кордон (у разі наявності);
                            </Typography>
                            <Typography>
                              — витягу з реєстру територіальної громади (у разі наявності);
                            </Typography>
                            <Typography>
                              — заяви про вчинення щодо дитини кримінального правопорушення або про залучення дитини до провадження як потерпілої, зареєстрованої в установленому порядку у відповідних правоохоронних органах;
                            </Typography>
                            <Typography>
                              — витягу з Єдиного реєстру досудових розслідувань про відкриття кримінального провадження (назалежно від результатів досудового розслідування) за зазначеною заявою про вчинення злочину щодо дитини в зоні воєнних дій та збройних конфліктів.
                            </Typography>
                          </Paper>
                        ) : false}
                        {isShown && state === 'psychological' ? (
                          <Paper elevation={3} sx={{ p: 2 }}>
                            <Typography align='center' color="inherit" sx={{ fontSize: 16, fontWeight: 700, mb: 1 }}>
                              Для надання статусу необхідний перелік документів:
                            </Typography>
                            <Typography sx={{ fontSize: 16 }}>
                              — свідоцтва про народження дитини або іншого документа, що посвідчує особу дитини;
                            </Typography>
                            <Typography>
                              — документа, що посвідчує особу заявника;
                            </Typography>
                            <Typography>
                              — документа, що підтверджує повноваження законного представника дитини або родинні стосунки між дитиною та заявником;
                            </Typography>
                            <Typography>
                              — довідки про взяття дитини на облік як внутрішньо переміщеної особи (у разі наявності);
                            </Typography>
                            <Typography>
                              — паспорта громадянина України, виготовленого у формі книжечки (у разі наявності);
                            </Typography>
                            <Typography>
                              — паспорта громадянина України або паспорта громадянина України для виїзду за кордон у формі е-паспорта або е-паспорта для виїзду за кордон (у разі наявності);
                            </Typography>
                            <Typography>
                              — витягу з реєстру територіальної громади (у разі наявності);
                            </Typography>
                            <Typography>
                              — висновок оцінки потреб сім’ї (особи) у соціальних послугах, підготовлений центром соціальних служб для сім’ї, дітей та молоді за формою, затвердженою Мінсоцполітики.
                            </Typography>
                          </Paper>
                        ) : false}
                      </Grid>

                    </Grid>
                    <div>
                      <Button
                        variant="contained"
                        onClick={handleNext}
                        disabled={
                          !state || ((state === 'psychological' && (assesAct === false || conclusion === false)) ? (true) : false)
                        }
                        size="large"
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
                      <Grid item xs={12} sm={6} sx={{ mt: 1 }}>
                        <FormControl fullWidth error={errors.region ? true : false}>
                          <InputLabel id="region">Оберіть район *</InputLabel>
                          <Select
                            {...register("region")}
                            labelId="region"
                            id="region"
                            name="region"
                            required
                            value={formData.region}
                            onChange={handleChange}
                            input={<OutlinedInput label="Оберіть район *" />}
                            error={errors.region ? true : false}
                          >
                            {regions.map((item) => (
                              <MenuItem
                                key={item.id}
                                value={item.id}
                              >
                                {item.title}
                              </MenuItem>
                            ))}
                          </Select>
                          <FormHelperText sx={{ color: "#bf3333" }}>
                            {errors.region?.message}
                          </FormHelperText>
                        </FormControl>
                      </Grid>

                      <Grid item xs={12} sm={6} sx={{ mt: 1 }}>
                        <FormControl fullWidth error={errors.community_id ? true : false}>
                          <InputLabel id="community_id">Оберіть громаду *</InputLabel>
                          <Select
                            {...register("community_id")}
                            labelId="community_id"
                            id="community_id"
                            required
                            value={formData.community_id}
                            name="community_id"
                            onChange={(e) => { selectCommunities(e) }}
                            input={<OutlinedInput label="Оберіть громаду *" />}
                            error={errors.community_id ? true : false}
                          >
                            {filteredCommunities().map((item) => (
                              <MenuItem
                                key={item.id}
                                value={item.id}
                              >
                                {item.title}
                              </MenuItem>
                            ))}
                          </Select>
                          <FormHelperText sx={{ color: "#bf3333" }}>
                            {errors.community_id?.message}
                          </FormHelperText>

                        </FormControl>
                      </Grid>

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
                              <ToggleButton key={date} value={date} disabled={!formData.community_id || date.split('.', 1) < (new Date().getDate()) || reservedDates.some((element) => (element.date === date && element.selectTime.length === times.length))}>
                                {date}
                              </ToggleButton>
                            ))}
                          </ToggleButtonGroup>
                        </FormControl>
                      </Grid>

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
                              '@media (min-width: 1000px)': { gridTemplateColumns: 'repeat(10, auto)' },

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
                              <ToggleButton key={time} value={time} sx={{ pr: 4, pl: 4 }} disabled={!formData.community_id || !chosenDate || reservedDates.some((element) => (element.date === chosenDate && element.selectTime.find(timeEl => timeEl === time)))} >
                                {time}
                              </ToggleButton>
                            ))}
                          </ToggleButtonGroup>
                        </FormControl>
                        <FormGroup sx={{ mt: 1 }}>
                          <FormControlLabel control={<Checkbox checked={personData} onClick={handleClickPersonData} />} label="Даю згоду на обробку персональних даних* " />
                        </FormGroup>
                      </Grid>
                    </Grid>
                    <div>
                      <Button
                        onClick={handleSubmit}
                        disabled={(Object.keys(errors) != 0) || !formData.surname || !formData.patronymic || !formData.name || !formData.number || !formData.community_id || !formData.region || !formData.time || personData === false || !state || ((state === 'psychological' && (assesAct === false || conclusion === false)) ? (true) : false)}
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