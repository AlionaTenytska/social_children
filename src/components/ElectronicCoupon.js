import * as React from 'react';
import axios from "axios";
import { useParams } from "react-router-dom";
import { Button, TableContainer, TextField, Box, Typography, Container, Grid, Paper, Table, TableBody, TableCell, TableRow } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import * as Yup from 'yup';
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import { Header } from './Header'
import { Theme } from './Theme'

const baseURL = 'http://127.0.0.1:8000/api'

function createData(name, data) {
  return { name, data };
}

const id = 2;


export const ElectronicCoupon = () => {

  let params = useParams();
  const [userData, setUserData] = React.useState([]);

  React.useEffect(() => {
    const expensesListResp = async () => {
      await axios.get(`${baseURL}/applications/${params.id}`)
        .then(
          response => setUserData(response.data))
    }
    expensesListResp();
  }, []);

  const rows = [
    createData('Прізвище:', userData.surname),
    createData("Ім'я:", userData.name),
    createData("По-батькові:", userData.patronymic),
    createData('РНОКПП (ІПН):', userData.number),
    createData('Дата:', '19.10.2023'),
    createData('Час:', userData.time),
  ];

  const ref = React.useRef(null);

  const [formData, setFormData] = React.useState('');
  const [isActive, setIsActive] = React.useState(false);

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .required("Це обов'язкове поле")
      .email("E-mail має бути в правильному форматі")
  });

  const handleClick = () => {
    setIsActive(true);
    ref.current?.scrollIntoView();
  };

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

  return (
    <Theme>
      <Box>
        <Header />
        <Container component="main" maxWidth="sm" sx={{ mb: 2, mt: 5 }}>
          <Typography component="h1" variant="h5" align='center' sx={{ mt: 2, mb: 4, fontWeight: 500 }}>
            ТАЛОН ЕЛЕКТРОННОЇ ЧЕРГИ
          </Typography>
          <TableContainer component={Paper}>
            <Table aria-label="simple table">
              <TableBody>
                {rows.map((row) => (
                  <TableRow
                    key={row.name}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 }, fontWeight: 800 }}>
                    <TableCell component="th" scope="row">
                      {row.name}
                    </TableCell>
                    <TableCell align="right">{row.data}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Container>

        <Container component="main" maxWidth="sm" >
          <Grid
            container
            justifyContent="center"
            alignItems="center"
          >
            <Button
              type="submit"
              size="large"
              variant="contained"
              sx={{ mt: 1, mb: 1, pr: 9, pl: 9, borderRadius: 2 }}
            >
              Зберегти
            </Button>
          </Grid>

          <Grid
            container
            justifyContent="center"
            alignItems="center"
          >
            <Button
              type="submit"
              size="large"
              variant="contained"
              sx={{ mt: 1, mb: 1, borderRadius: 2 }}
              onClick={handleClick}
            >
              Надіслати на пошту
            </Button>

            {/* <a href={`${baseURL}/applications/${id}/pdf`}>Завантажити пдф</a> */}
          </Grid>
        </Container>

        <Container maxWidth="sm" ref={ref} sx={{ mb: 4, mt: 4, display: isActive ? '' : 'none' }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={8}>
              <TextField
                {...register("email")}
                required
                fullWidth
                name="email"
                label="E-mail"
                id="email"
                autoComplete="email"
                onChange={handleChange}
                value={formData.email}
                error={errors.email ? true : false}
                helperText={errors.email?.message}
              />
            </Grid>

            <Grid item xs={12} sm={4} justifyContent="center" alignItems="center">
              <Button
                type="submit"
                disabled={(Object.keys(errors) != 0) || !formData.email}
                size="large"
                variant="contained"
                sx={{ mt: 1, mb: 1, borderRadius: 2 }}
              >
                Надіслати
              </Button>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Theme>
  );
}