import * as React from 'react';
import axios from "axios";
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { DemoItem } from '@mui/x-date-pickers/internals/demo';
import { Button, CssBaseline, TextField, Box, Typography, Container, Select, InputLabel, MenuItem, useTheme, OutlinedInput, FormControl, Grid, FormHelperText } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { Header } from './Header'
import { Theme } from './Theme'

const baseURL = 'http://127.0.0.1:8000/api/applications'

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

function isValidIPN(message) {
  return this.test("isValidIPN", message, function (value) {
    const { path, createError } = this;

    if (value.length == 10) {
      let newArray = [];
      for (var i of value) {
        newArray.push(i);
      }
      let number = newArray.pop();
      let arr = [-1, 5, 7, 9, 4, 6, 10, 5, 7];

      let sum = newArray.reduce(function (r, a, i) { return r + a * arr[i] }, 0);
      let remainder = sum % 11;
      if (remainder == 10) {
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

export const Form = () => {

  const navigate = useNavigate();
  const [formData, setFormData] = React.useState(initialFormData);

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


  const theme = useTheme();
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
    axios.post(baseURL, userData).then((response) => {
      navigate(`/coupon/${response.data.id}`);
    });
  };

  return (
    <Theme>
      <CssBaseline />
      <Header />
      <Container component="main" maxWidth="lg" sx={{ mb: 4, mt: 5 }}>
        <Typography component="h1" variant="h5" align='center' color="inherit" sx={{ mt: 2, mb: 4, fontWeight: 500 }}>
          ЗАПИС ДО ЕЛЕКТРОННОЇ ЧЕРГИ
        </Typography>
        <Grid container spacing={4}>

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
              autoFocus
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
                {names_districs.map((names_districs) => (
                  <MenuItem
                    key={names_districs}
                    value={names_districs}
                  >
                    {names_districs}
                  </MenuItem>
                ))}
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
                    name = "dateRecording"
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

        <Grid
          container
          justifyContent="center"
          alignItems="center">
          <Button
            onClick={handleSubmit}
            disabled={(Object.keys(errors) != 0) || !formData.surname || !formData.fatherly || !formData.name || !formData.ipn || !formData.community || !formData.region || !formData.recordingTime}
            type="submit"
            size="large"
            variant="contained"
            sx={{ mt: 4, mb: 2, pr: 6, pl: 6, borderRadius: 2 }}
          >
            Записатися
          </Button>
        </Grid>
      </Container>
    </Theme>
  );
}