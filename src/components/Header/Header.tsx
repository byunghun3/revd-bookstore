import React, { useState, useEffect, useContext } from "react"
import { Link, NavLink } from "react-router-dom"
import AppBar from "@mui/material/AppBar"
import Toolbar from "@mui/material/Toolbar"
import AccountCircleIcon from "@mui/icons-material/AccountCircle"
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart"
import MenuIcon from "@mui/icons-material/Menu"
import { styled } from "@mui/system"
import Logo from "../../assets/icons/bookstore-logo.png"
import { LoginContext } from "../../contexts/LoginContext"
import classes from "./Header.module.css"

const HeaderToolbar = styled(Toolbar)({
    display: "flex",
    justifyContent: "center",
    alignItems: "end",
    maxWidth: "100%",
    // backgroundColor: "#d7ccc8",
    // backgroundColor: "#01579b",
    // backgroundColor: "#4db6ac",
    // backgroundColor: "#66bb6a",
    // backgroundColor: "#80cbc4",
    // width: "100%"
})

const StyledAccountIcon = styled(AccountCircleIcon)({
    verticalAlign: "middle",
    marginRight: "0.3rem",
    color: "black",
    fontSize: "2.7rem",
    // color: "white"
})

const StyledCartIcon = styled(ShoppingCartIcon)({
    verticalAlign: "middle",
    marginLeft: "0.3rem",
    color: "black",
    fontSize: "2.7rem",
    // color: "white"
})

const NavBar = styled(Toolbar)({
    minHeight: "7rem",
    maxWidth: "100%",
    // "@media (max-width: 500px)": {
    // position: "relative",
    // display: "flex"
    // justifyContent: "flex-end",
    //     alignItems: "center",
    // },
    // border: "solid black",
    // width: "100%",
    // backgroundColor: "#d7ccc8"
    // backgroundColor: "#01579b"
    // backgroundColor: "#4db6ac"
    // backgroundColor: "#66bb6a"
    // backgroundColor: "#80cbc4",
    // backgroundColor: "#607d8b",
    // backgroundColor: "#795548",
    // backgroundColor: "#e57373",
    // backgroundColor: "#1565c0",
    // backgroundColor: "#0d47a1",
    // backgroundColor: "#1a237e",
    // backgroundColor: "#3f51b5",
    // backgroundColor: "#311b92",
    // backgroundColor: "#58B19F",
    backgroundColor: "#487eb0",
})

const ExpandedNavBar = styled(Toolbar)({
    minHeight: "7rem",
    maxWidth: "100%",
    // "@media (max-width: 500px)": {
    // position: "relative",
    // display: "flex"
    // justifyContent: "flex-end",
    //     alignItems: "center",
    // },
    // border: "solid black",
    // width: "100%",
    // backgroundColor: "#d7ccc8"
    // backgroundColor: "#01579b"
    // backgroundColor: "#4db6ac"
    // backgroundColor: "#66bb6a"
    // backgroundColor: "#80cbc4",
    // backgroundColor: "#607d8b",
    // backgroundColor: "#795548",
    // backgroundColor: "#e57373",
    // backgroundColor: "#1565c0",
    // backgroundColor: "#0d47a1",
    // backgroundColor: "#1a237e",
    // backgroundColor: "#3f51b5",
    // backgroundColor: "#311b92",
    // backgroundColor: "#58B19F",
    // backgroundColor: "#487eb0",
    backgroundColor: "black",
})

const StyledMenuIcon = styled(MenuIcon)({
    position: "absolute",
    top: "50%",
    right: "0",
    transform: "translate(-50%, -50%)",
    // float: "right",
    // display: "block",
    color: "white",
    fontSize: "4rem",
    cursor: "pointer",
    "@media (min-width: 501px)": {
        display: "none"
    }
})

function Header() {
    const { isLoggedIn, setIsLoggedIn } = useContext(LoginContext)
    // const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [isExpanded, setIsExpanded] = useState(false)
    const cart = JSON.parse(localStorage.getItem("cart") || "[]")
    // const users = JSON.parse(localStorage.getItem("users") || "[]")
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "[]")

    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cart))
        // localStorage.setItem("users", JSON.stringify(users))
    }, [cart])

    const greeting = currentUser.map((el: any) => {
        return <div key={el.email}>Hello, {el.firstName}</div>
    })

    const handleExpandMenu = () => {
        setTimeout(() => { setIsExpanded(!isExpanded) }, 200)
    }

    return (
        <div>
            <AppBar
                color="inherit"
                elevation={0}
                position="sticky"
            >
                <HeaderToolbar>
                    <div className={classes.leftSection}>
                        {/* <img className={classes.logo} src={Logo} alt="" /> */}
                        <Link to="/" className={classes.headerLink}>
                            <span className={classes.title}>Revd Bookstore</span>
                        </Link>
                    </div>
                    <div className={classes.rightSection}>
                        {isLoggedIn ? <div className={classes.greeting}>{greeting}</div> : null}
                        {isLoggedIn ?
                            <Link to="/profile" className={classes.headerLink}>
                                <StyledAccountIcon />
                            </Link> :
                            <Link to="/login" className={classes.headerLink}>
                                <StyledAccountIcon />
                            </Link>
                        }
                        <Link to="/cart" className={classes.headerLink}>
                            <StyledCartIcon />
                            <span className={classes.cartLength}>({cart.length})</span>
                        </Link>
                    </div>
                </HeaderToolbar>
                <NavBar>
                    <NavLink to="/about" className={({ isActive }) => (isActive ? classes.activeNavLink : classes.navLink)}>About</NavLink>
                    <NavLink to="/browse" className={({ isActive }) => (isActive ? classes.activeNavLink : classes.navLink)}>Browse</NavLink>
                    <NavLink to="/suggest" className={({ isActive }) => (isActive ? classes.activeNavLink : classes.navLink)}>Suggest</NavLink>
                    <NavLink to="/contact" className={({ isActive }) => (isActive ? classes.activeNavLink : classes.navLink)}>Contact</NavLink>
                    <StyledMenuIcon onClick={handleExpandMenu} />
                </NavBar>
                {isExpanded && <div>
                    <ExpandedNavBar><NavLink to="/about" className={classes.expandedNavLink} onClick={handleExpandMenu}>About</NavLink></ExpandedNavBar>
                    <ExpandedNavBar><NavLink to="/browse" className={classes.expandedNavLink} onClick={handleExpandMenu}>Browse</NavLink></ExpandedNavBar>
                    <ExpandedNavBar><NavLink to="/suggest" className={classes.expandedNavLink} onClick={handleExpandMenu}>Suggest</NavLink></ExpandedNavBar>
                    <ExpandedNavBar><NavLink to="/contact" className={classes.expandedNavLink} onClick={handleExpandMenu}>Contact</NavLink></ExpandedNavBar>
                </div>
                }
            </AppBar>
        </div>
    )
}

export default Header
