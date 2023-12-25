import * as React from 'react';
import { Button, CssBaseline, Typography, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Header } from './Header'
import { Theme } from './Theme'

export const NotFound = () => {
    const navigate = useNavigate();

    const returnToMain = () => {
        navigate(`/`);
    };

    return (
        <Theme>
            <CssBaseline />
            <Header />
            <Container component="main" maxWidth="lg" sx={{ mb: 4, mt: 5 }}>
                <Typography component="h1" variant="h5" align='center' color="inherit" sx={{
                    mt: 2, fontWeight: 500, fontSize: 30,
                    '@media (min-width: 250px)': { fontSize: 20 },
                    '@media (min-width: 600px)': { fontSize: 25 },
                    '@media (min-width: 900px)': { fontSize: 30 }
                }}>
                    ПОМИЛКА
                </Typography>
                <Typography
                    component="h1"
                    variant="h5"
                    align='center'
                    sx={{
                        mt: 1, fontWeight: 500, fontSize: 200, color: 'rgba(50,84,255,1)',
                        '@media (min-width: 250px)': { fontSize: 100 },
                        '@media (min-width: 600px)': { fontSize: 170 },
                        '@media (min-width: 900px)': { fontSize: 200 }
                    }}>
                    4 0 4
                </Typography>

                <Typography align='center' color="inherit" sx={{
                    mb: 2, fontWeight: 500, fontSize: 30,
                    '@media (min-width: 250px)': { fontSize: 20 },
                    '@media (min-width: 600px)': { fontSize: 25 },
                    '@media (min-width: 900px)': { fontSize: 30 }
                }}>
                    Сторінку не знайдено
                </Typography>
                <div align='center'><Button
                    onClick={returnToMain}
                    type="submit"
                    size="large"
                    variant="contained"
                    sx={{ mt: 2, mb: 2, pr: 3, pl: 3, borderRadius: 2 }}
                >
                    Повернутися на головну
                </Button></div>
            </Container>
        </Theme>
    );
}