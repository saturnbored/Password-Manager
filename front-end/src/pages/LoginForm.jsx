import React from 'react';
import Button  from "@material-ui/core/Button";
import { TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core';
import LoginIcon from '@mui/icons-material/Login';
import Signup from '@mui/icons-material/PersonAdd';
// import { ClassNames } from '@emotion/react';

const useStyle = makeStyles({
    btn:{
        background:"green",
        margin : '20px',
    },
    input:{
        margin : '15px',
        width : '400px'
    },
    btn2:{
        margin : '20px',
    },

})

function LoginForm() {
    const classes = useStyle();
    return(
        <>
            <div className='login-page'>
                <h1>your<span id='name'>Vault</span></h1>
                <div className ='login'>
                    <div className='loginDeatils' >
                    <TextField className={classes.input} id="uEmail" label="Email" variant="outlined" type= "email" required />
                    <TextField className={classes.input} id="massterPass" label="Master Password" variant="outlined" type= "password" required />
                    </div>
                    <Button 
                        className={classes.btn}
                        variant ='contained'
                        startIcon = { <LoginIcon />} 
                        color='secondary'
                        size='small'
                    >Login</Button>
                    <Button 
                        className={classes.btn2}
                        variant ='contained'
                        startIcon = { <Signup />} 
                        color='secondary'
                        size='small'
                        href='/register'
                    >Create Account</Button>
                </div>
            </div>  
        </>
    );
}

export default LoginForm;