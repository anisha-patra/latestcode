import React, { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
// import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Login from "./login";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import Firebase from "./firebase";
import { getDatabase, ref, push, set, onValue, get, onChildAdded, update } from "firebase/database";


function Copyright(props) {
    return (
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
            {'Copyright © '}
            <Link color="inherit" href="https://mui.com/">
                Your Website
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

const theme = createTheme();

export default function SignInSide() {
    const [check1, setcheck1] = useState(false)
    const [name, setname] = useState("")
    const [email, setemail] = useState("")
    const [password, setpassword] = useState("")
    const [mobile, setmobile] = useState("")
    const [emailempty, setemailempty] = useState(false);
    const [passwordempty, setpasswordempty] = useState(false);
    const [isPasswordValid, setIsPasswordValid] = useState(true);
    const [isEmailValid, setisEmailValid] = useState(false);
    const handleSubmit = (event) => {
        let passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/
        let testPassword = passwordPattern.test(password);

        const auth = getAuth();
        const dbRef = getDatabase();
        console.log("email", email);
        console.log("password", password);
        console.log("auth", auth);
        if (email == "") {
            setemailempty(true);
        } else if (password == "") {
            setpasswordempty(true);
        } else if (testPassword !== true) {
            setIsPasswordValid(true);
        }
        else {
            createUserWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    // Signed in 
                    const user = userCredential.user;
                    // ...
                    console.log("user", userCredential);
                    set(ref(dbRef, 'users/' + userCredential.user.uid), {
                        userid: userCredential.user.uid,
                        name: name,
                        emailid: userCredential.user.email,
                        mobile: mobile

                    },

                        (error) => {
                            if (error) {
                                alert("something went wrong");
                            } else {
                                console.log("127");


                            }
                        }
                    );
                    window.alert("Registered successfully")

                    setTimeout(() => {
                        window.location.href = "/login"
                    }, 3000);

                })
                .catch((error) => {
                    console.log("error", error);
                    window.alert(error.message);
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    // ..
                });
        }
    };

    function validateEmail(emailId) {
        let regex = /\S+@\S+\.\S+/;
        let valid = regex.test(emailId);
        console.log(valid);
        setisEmailValid(valid ? false : true);
    }
    function validatePassword(password) {
        let regex =
            /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
        let valid = regex.test(password);
        setIsPasswordValid(valid ? false : true);
    }

    return (
        <>
            {check1 ?

                <Login /> :
                <ThemeProvider theme={theme}>
                    <Grid container component="main" sx={{ height: '100vh' }}>
                        <CssBaseline />
                        <Grid
                            item
                            xs={false}
                            sm={4}
                            md={7}
                            sx={{
                                backgroundImage: 'url(https://source.unsplash.com/random)',
                                backgroundRepeat: 'no-repeat',
                                backgroundColor: (t) =>
                                    t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                            }}
                        />
                        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
                            <Box
                                sx={{
                                    my: 8,
                                    mx: 4,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                }}
                            >
                                <h2>Visitor's Register Form</h2>
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="name"
                                    label="Name"
                                    name="name"
                                    autoComplete="name"
                                    autoFocus
                                    onChange={(val) => {
                                        console.log("val", val.target.value)
                                        setname(val.target.value)

                                    }}
                                />

                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="email"
                                    label="Email Address"
                                    name="email"
                                    autoComplete="email"
                                    autoFocus
                                    onChange={(val) => {
                                        console.log("val", val.target.value)
                                        setemail(val.target.value)
                                        if (val.target.value) {
                                            setemailempty(false)
                                            validateEmail(val.target.value);
                                        }
                                        else {
                                            setemailempty(true)
                                            validateEmail(val.target.value);
                                        }
                                    }}
                                />
                                {emailempty ? (
                                    <small style={{ color: "red" }}>
                                        {" "}
                                        Please enter a email.{" "}
                                    </small>
                                ) : isEmailValid ?
                                    <small style={{ color: "red" }}>
                                        {" "}
                                        Please enter a valid email.{" "}
                                    </small> :
                                    null}
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    name="password"
                                    label="Password"
                                    type="password"
                                    id="password"
                                    autoComplete="current-password"
                                    onChange={(val) => {
                                        console.log("val", val.target.value)
                                        setpassword(val.target.value)
                                        if (val.target.value) {
                                            setpasswordempty(false);
                                            validatePassword(val.target.value);
                                        } else {
                                            setpasswordempty(true);
                                            validatePassword(val.target.value);
                                        }
                                    }}
                                />
                                {passwordempty ? (
                                    <small style={{ color: "red" }}>
                                        {" "}
                                        Please enter a password.{" "}
                                    </small>
                                ) :
                                    isPasswordValid ? (
                                        <small style={{ color: "red" }}>
                                            {" "}
                                            ***Password must contain minimum eight
                                            characters, at least one letter, one number
                                            and one special character.{" "}
                                        </small>
                                    ) :
                                        null}
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="mobile"
                                    label="Mobile"
                                    name="mobile"
                                    autoComplete="mobile"
                                    autoFocus
                                    onChange={(val) => {
                                        console.log("val", val.target.value)
                                        setmobile(val.target.value)
                                    }}
                                    value={mobile}
                                />

                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    sx={{ mt: 3, mb: 2 }}
                                    onClick={() => {
                                        handleSubmit()
                                    }}
                                >
                                    Sign Up
                                </Button>
                                <Grid container>




                                    <Grid item>
                                        <Link href="/login" variant="body2"
                                            onClick={() => {
                                                setcheck1(true)
                                            }}
                                        >
                                            Don't have an account? Sign in
                                        </Link>
                                    </Grid>
                                </Grid>
                                <Copyright sx={{ mt: 5 }} />
                                {/* </Box> */}
                            </Box>
                        </Grid>
                    </Grid>
                </ThemeProvider>
            }
        </>
    );
}