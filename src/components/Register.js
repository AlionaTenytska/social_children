import * as React from 'react';
import axios from "axios";
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { DemoItem } from '@mui/x-date-pickers/internals/demo';
import { Button, CssBaseline, TextField, Box, Typography, Container, Select, InputLabel, MenuItem, OutlinedInput, FormControl, Grid, FormHelperText, Stepper, Step, StepLabel, StepContent, Paper, RadioGroup, FormControlLabel, FormLabel, Radio, Checkbox, FormGroup } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { Header } from './Header'
import { Theme } from './Theme'

const baseURL = 'http://127.0.0.1:8000/api'

const names_districs = [
  'Сумський район',
  'Конотопський район',
  'Шосткинський район',
  'Охтирський район',
  'Роменський район',
];

const name_community = [
  'Test name1',
  'Test name 2',
  'Test name 3',
  'Test name 4',
  'Test name 5',
]

const times = [
  '8:15',
  '9:00',
  '9:45',
  '10:30',
  '11:15'
]

const steps = [
  {
    label: 'Персональні дані',
  },
  {
    label: 'Підстава для отримання статусу дитини, яка постраждала внаслідок воєнних дій та збройних конфліктів',
  },
  {
    label: 'Місце, дата та час',
  },
];


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
  fatherly: '',
  ipn: '',
  region: '',
  community: '',
  dateRecording: '',
  recordingTime: ''
});

let regions = [];

axios.get(`${baseURL}/regions`)
.then(
  regions = respons.data)

  console.log(regions)

export const Form = () => {

  const navigate = useNavigate();
  const [formData, setFormData] = React.useState(initialFormData);
  const [activeStep, setActiveStep] = React.useState(0);

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
    fatherly: Yup.string()
      .required("Це обов'язкове поле")
      .matches(/^([^0-9]*)$/, "Не коректно введені дані")
      .min(5, "Не коректно введені дані"),
    ipn: Yup.string()
      .matches(/^([^А-Я,а-я]*)$/, "Не коректно введені дані")
      .required("Це обов'язкове поле")
      .min(10, 'РНОКПП (ІПН) складається з десяти цифр')
      .max(10, 'РНОКПП (ІПН) складається з десяти цифр')
      .isValidIPN('Не вірно вказаний РНОКПП (ІПН)'),
    region: Yup.string()
      .required("Це обов'язкове поле")
      .typeError("Це обов'язкове поле"),
    community: Yup.string()
      .required("Це обов'язкове поле")
      .typeError("Це обов'язкове поле"),
    dateRecording: Yup.string()
      .required("Це обов'язкове поле"),
    recordingTime: Yup.string()
      .required("Це обов'язкове поле")
  });

  const {
    register,
    formState: { errors },
  } = useForm({
    mode: 'all',
    resolver: yupResolver(validationSchema),
  });


  const [value, setValue] = React.useState([]); // Для дати, поки не видаляю

  const handleChange = ({ target: { name, value } }) => {
    setFormData({ ...formData, hasChanged: true, [name]: value });
  };

  const handleSubmit = (e) => {

    e.preventDefault()

    const userData = {
      name: formData.name,
      surname: formData.surname,
      patronymic: formData.fatherly,
      number: formData.ipn,
      locality: formData.region,
      community_id: 1,
      date: '19.10.2023',
      time: formData.recordingTime
    }
    axios.post(`${baseURL}/applications`, userData).then((response) => {
      navigate(`/coupon/${response.data.id}`);
    });
  };


  const [reg, setReg] = React.useState([]);

  // React.useEffect(() => {
     
    // }, []);



  // React.useEffect(() => {
  //   const fetchData = async () => {
  //     const result = await axios(`${baseURL}/regions`);
  //     setReg(result.data);
  //   };
  //   fetchData();
  // }, []);

  console.log(reg);
  
  // reg.map((r)=>(
  //   console.log(r.title)
  // ));

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };


  const [state, setState] = React.useState();
  function handleChangeRadio(event) {
    setState(event.target.value);
    // console.log(state);
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






  return (
    <Theme>
      <CssBaseline />
      <Header />
      <Container component="main" maxWidth="lg" sx={{ mb: 4, mt: 5 }}>
        <Typography component="h1" variant="h5" align='center' color="inherit" sx={{ mt: 2, mb: 4, fontWeight: 500 }}>
          ЗАПИС ДО ЕЛЕКТРОННОЇ ЧЕРГИ
        </Typography>

        <Stepper activeStep={activeStep} orientation="vertical" sx={{
          ".css-obmozu-MuiSvgIcon-root-MuiStepIcon-root": {
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
          ".css-14yr603-MuiStepContent-root": {
            borderLeft: '2px solid rgba(50,84,255,1)',
            marginLeft: '15px',
          },
          ".css-8t49rw-MuiStepConnector-line": {
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
                    <Grid container spacing={4}>

                      <Grid item xs={12} sm={6} sx={{ mt: 2 }}>
                        <TextField
                          {...register("surname")}
                          required
                          fullWidth
                          id="lastname"
                          label="Прізвище"
                          name="surname"
                          autoComplete="surname"
                          onChange={handleChange}
                          // autoFocus
                          value={formData.surname}
                          error={errors.surname ? true : false}
                          helperText={errors.surname?.message}
                        />
                      </Grid>

                      <Grid item xs={12} sm={6} sx={{ mt: 2 }}>
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
                          {...register("fatherly")}
                          required
                          fullWidth
                          name="fatherly"
                          label="По-батькові"
                          id="fatherly"
                          autoComplete="fatherly"
                          value={formData.fatherly}
                          onChange={handleChange}
                          error={errors.fatherly ? true : false}
                          helperText={errors.fatherly?.message}
                        />
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <TextField
                          {...register("ipn")}
                          required
                          fullWidth
                          inputProps={{ maxLength: 10 }}
                          name="ipn"
                          label="РНОКПП (ІПН)"
                          id="ipn"
                          autoComplete="ipn"
                          onChange={handleChange}
                          value={formData.ipn}
                          error={errors.ipn ? true : false}
                          helperText={errors.ipn?.message}
                        />
                      </Grid>
                    </Grid>
                    <div>
                      <Button
                        variant="contained"
                        onClick={handleNext}
                        size="large"
                        // disabled={(Object.keys(errors) != 0) || !formData.surname || !formData.fatherly || !formData.name}
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
                          {/* <FormLabel id="demo-radio-buttons-group-label">Оберіть підставу для отримання статусу дитини, яка постраждала внаслідок воєнних дій та збройних конфліктів: </FormLabel> */}
                          <RadioGroup
                            aria-labelledby="demo-radio-buttons-group-label"
                            name="radio-buttons-group"
                            onChange={handleChangeRadio}
                            onClick={handleClickRadio}
                          >
                            <FormControlLabel value="wound" control={<Radio checked = {true ? (state === 'wound'): false} />} label="Отримали поранення, контузію, каліцтво" />
                            <FormControlLabel value="violence" control={<Radio checked = {true ? (state === 'violence'): false} />} label="Зазнали фізичного, сексуального насильства" />
                            <FormControlLabel value="stolen" control={<Radio checked = {true ? (state === 'stolen'): false} />} label="Були викрадені або незаконно вивезені за межі України" />
                            <FormControlLabel value="participation" control={<Radio checked = {true ? (state === 'participation'): false} />} label="Залучалися до участі у діях воєнізованих чи збройних формувань" />
                            <FormControlLabel value="maintenance" control={<Radio checked = {true ? (state === 'maintenance'): false} />} label="Незаконно утримувалися, у тому числі в полоні" />
                            <FormControlLabel value="psychological" control={<Radio checked = {true ? (state === 'psychological'): false} />} label="Зазнали психологічного насильства" />
                          </RadioGroup>
                        </FormControl>
                        {isShown && state === 'psychological' ? (
                        <FormGroup>
                          <FormLabel sx={{ mt: 2 }}>Відмітьте наявніть наступних документів: </FormLabel>
                          <FormControlLabel required control={<Checkbox checked={assesAct} onClick={handleClickAssesAct}/>} label="Акт оцінки потреб сім’ї " />
                          <FormControlLabel required control={<Checkbox checked={conclusion} onClick={handleClickConclusion}/>} label="Висновок оцінки потреби сім’ї " />
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
                          !state || ((state === 'psychological' && (assesAct === false || conclusion === false))?(true) : false)
                        }
                        size="large"
                        sx={{ mt: 2, pr: 4, pl: 4, borderRadius: 2 }}
                      >
                        Далі
                      </Button>
                      <Button
                        // disabled={index === 0}
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
                      <Grid item xs={12} sm={6}>
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
                            {/* {names_districs.map((names_districs) => (
                              <MenuItem
                                key={names_districs}
                                value={names_districs}
                              >
                                {names_districs}
                              </MenuItem>
                            ))} */}

                            {/* {reg.map((r) => (
                              <MenuItem
                                key={r.id}
                                value={r.title}
                              >
                                {r.title}
                              </MenuItem>
                            ))} */}
                          </Select>
                          <FormHelperText sx={{ color: "#bf3333" }}>
                            {errors.region?.message}
                          </FormHelperText>
                        </FormControl>
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <FormControl fullWidth error={errors.community ? true : false}>
                          <InputLabel id="community">Оберіть громаду *</InputLabel>
                          <Select
                            {...register("community")}
                            labelId="community"
                            id="community"
                            required
                            value={formData.community}
                            name="community"
                            onChange={handleChange}
                            input={<OutlinedInput label="Оберіть громаду *" />}
                            error={errors.community ? true : false}
                          >
                            {name_community.map((name_community) => (
                              <MenuItem
                                key={name_community}
                                value={name_community}
                              >
                                {name_community}
                              </MenuItem>
                            ))}
                          </Select>
                          <FormHelperText sx={{ color: "#bf3333" }}>
                            {errors.community?.message}
                          </FormHelperText>

                        </FormControl>
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <Box >
                          <LocalizationProvider dateAdapter={AdapterDayjs} >
                            <DemoItem >
                              <MobileDatePicker
                                label="Оберіть дату *"
                                name="dateRecording"
                                id="dateRecording"
                              // {...register("dateRecording")}
                              //value={formData.dateRecording}
                              // onChange={handleChange}


                              // onError={(newError) => setError(newError)}
                              // error={errors.dateRecording ? true : false}
                              // helperText={ errors.dateRecording?.message }  
                              // slotProps={{
                              //   textField: {
                              //     helperText: errors.dateRecording?.message,
                              //   },
                              // }}
                              />
                            </DemoItem>
                          </LocalizationProvider>

                        </Box>
                        <FormGroup sx = {{mt:1}}>
                          <FormControlLabel required control={<Checkbox checked={personData} onClick={handleClickPersonData}/>} label="Даю згоду на обробку персональних даних " />
                      </FormGroup>
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <FormControl fullWidth error={errors.recordingTime ? true : false}>
                          <InputLabel id="recordingTime">Оберіть час *</InputLabel>
                          <Select
                            {...register("recordingTime")}
                            labelId="recordingTime"
                            id="recordingTime"
                            required
                            value={formData.recordingTime}
                            name="recordingTime"
                            onChange={handleChange}
                            input={<OutlinedInput label="Оберіть час *" />}
                            error={errors.recordingTime ? true : false}
                          >
                            {times.map((time) => (
                              <MenuItem
                                key={time}
                                value={time}
                              >
                                {time}
                              </MenuItem>
                            ))}
                          </Select>
                          <FormHelperText sx={{ color: "#bf3333" }}>
                            {errors.recordingTime?.message}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                    </Grid>
                    <div>
                      <Button
                        onClick={handleSubmit}
                        disabled={(Object.keys(errors) != 0) || !formData.surname || !formData.fatherly || !formData.name || !formData.ipn || !formData.community || !formData.region || !formData.recordingTime || personData === false || !state || ((state === 'psychological' && (assesAct === false || conclusion === false))?(true) : false)}
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
                        sx={{ mt: 2, pr: 4, pl: 4, borderRadius: 2 }}
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
      </Container>
    </Theme>
  );
}