import React, { FC, useState } from "react";
import { Link } from "react-router-dom";
import { InputLabel, FormControl, OutlinedInput, Button, Card } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { IUser } from "../../interfaces/Interfaces";
import { styled } from "@mui/system";
import classes from "./ForgotPassword.module.css";

const ForgotPWCard = styled(Card)({
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    margin: "5% 0 10% 0",
    minHeight: "55vh",
    width: "40rem",
    "@media (max-width: 499px)": {
        minHeight: "45vh",
        width: "90vw",
        marginTop: "20%"
    }
});

const StyledAccountCircleIcon = styled(AccountCircleIcon)({
    flex: "1",
    marginTop: "5%",
    fontSize: "3.5rem"
});

const EmailForm = styled(FormControl)({
    margin: "2% 0",
    width: "80%"
});

const StyledInputLabel = styled(InputLabel)({
    fontSize: "1.5rem"
});

const StyledOutlinedInput = styled(OutlinedInput)({
    fontSize: "1.5rem"
});

const BackToLoginButton = styled(Button)({
    margin: "2% 0",
    textDecoration: "none",
    fontSize: "1.3rem"
});

const SendLinkButton = styled(Button)({
    margin: "3% 0 5% 0",
    width: "60%",
    fontSize: "1.3rem",
    "@media (max-width: 499px)": {
        width: "80%"
    }
});

const SignUpButton = styled(Button)({
    textDecoration: "none",
    fontSize: "1.3rem"
});

export const ForgotPassword: FC = () => {
    const [email, setEmail] = useState<string>("");
    const [showForgotPassword, setShowForgotPassword] = useState<boolean>(true);
    const [resetLinkSent, setResetLinkSent] = useState<boolean>(false);
    const [emailError, setEmailError] = useState<boolean>(false);
    const users: IUser[] = JSON.parse(localStorage.getItem("users") || "[]");

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const emailExists = users.find((user: IUser) => {
            return email === user.email;
        });

        if (emailExists) {
            setShowForgotPassword(false);
            setEmailError(false);
            setResetLinkSent(true);
        } else {
            setShowForgotPassword(true);
            setEmailError(true);
        }
    };

    return (
        <div className={classes.forgotPasswordPage}>
            <ForgotPWCard>
                <StyledAccountCircleIcon />
                {showForgotPassword &&
                    <form className={classes.forgotPasswordContent} onSubmit={handleSubmit}>
                        <div className={classes.forgotPW}>Forgot your password?</div>
                        <div className={classes.enterEmail}>Please enter your email address</div>
                        <EmailForm variant="outlined">
                            <StyledInputLabel>Email</StyledInputLabel>
                            <StyledOutlinedInput
                                label="Email"
                                name="email"
                                value={email}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setEmail(e.target.value); }}
                                required />
                            {emailError && <div className={classes.errorMessage}>The email you entered does not exist</div>}
                        </EmailForm>
                        <SendLinkButton type="submit" color="primary" variant="contained">
                            Send reset link
                        </SendLinkButton>
                        <div>
                            <Link className={classes.link} to="/login">
                                <BackToLoginButton type="button">
                                    Back to Login
                                </BackToLoginButton>
                            </Link>
                        </div>
                        <div className={classes.signUpContent}>
                            <span className={classes.signUpText}>Don&apos;t have account?</span>
                            <Link className={classes.link} to="/signup">
                                <SignUpButton type="button">
                                    Sign up
                                </SignUpButton>
                            </Link>
                        </div>
                    </form>
                }
                {resetLinkSent &&
                    <div className={classes.linkSentContent}>
                        <div className={classes.linkSent}>Password reset link has been sent to {email}!</div>
                        <div>
                            <Link className={classes.link} to="/login">
                                <BackToLoginButton type="button">
                                    Back to login
                                </BackToLoginButton>
                            </Link>
                        </div>
                    </div>
                }
            </ForgotPWCard>
        </div >
    );
};