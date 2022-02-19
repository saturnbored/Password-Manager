import React from 'react';
import Button  from "@material-ui/core/Button";
import { TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core';
import LoginIcon from '@mui/icons-material/Login';
// import CreateAccountIcon from '@mui/icons-material/PersonAdd';
// import { ClassNames } from '@emotion/react';
import PersonAdd from '@mui/icons-material/PersonAdd';

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

function Signup() {
    const classes = useStyle();
    return(
        <>
            <div className='login-page'>
            <h1>your<span id='name'>Vault</span></h1>
                <div className ='login'>
                    <div className='loginDeatils' >
                    <TextField className={classes.input} id="userName" label="Username" variant="outlined" type= "text" required />
                    <TextField className={classes.input} id="uEmail" label="Email" variant="outlined" type= "email" required />
                    <TextField className={classes.input} id="mobileNo" label="Mobile No." variant="outlined" type= "tel" required />
                    <TextField className={classes.input} id="massterPass" label="Master Password" variant="outlined" type= "password" required />
                    </div>
                    <Button 
                        
                        className={classes.btn2}
                        variant ='contained'
                        startIcon = { <PersonAdd />} 
                        color='secondary'
                        size='small'
                    >Create Account</Button>
                    <p>Already have account? </p>
                    <Button 
                        className={classes.btn}
                        variant ='contained'
                        startIcon = { <LoginIcon />} 
                        color='secondary'
                        size='small'
                        href='/'
                    >Login</Button>
                </div>
            </div>
        </>
    );
}

export default Signup;