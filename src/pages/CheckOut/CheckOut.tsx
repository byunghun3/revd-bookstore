import React, { FC, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { Oval } from "react-loader-spinner";
import { Card, Button } from "@mui/material";
import { PaymentInfo } from "../../components/PaymentInfo/PaymentInfo";
import { ShippingInfo } from "../../components/ShippingInfo/ShippingInfo";
import { OrderSummary } from "../../components/OrderSummary/OrderSummary";
import { DialogComponent } from "../../components/DialogComponent/DialogComponent";
import { IOrder, IUser, IBookForOrder } from "../../interfaces/Interfaces";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import { styled } from "@mui/system";
import classes from "./Checkout.module.css";

const InfoCard = styled(Card)({
    position: "relative",
    width: "60vw",
    margin: "5%",
    "@media (max-width: 499px)": {
        minWidth: "28rem"
    }
});

const CheckoutCard = styled(Card)({
    position: "relative",
    height: "75%",
    width: "40vw",
    margin: "5% 5% 5% 0",
    "@media (max-width: 499px)": {
        margin: "3rem 0 5rem 0",
        width: "25rem"
    }
});

const CartButton = styled(Button)({
    fontSize: "1.3rem"
});

const CheckOutButton = styled(Button)({
    marginBottom: "1.5rem",
    fontSize: "1.4rem"
});

export const Checkout: FC = () => {
    const [addressLineOne, setAddressLineOne] = useState<string>("");
    const [addressLineTwo, setAddressLineTwo] = useState<string>("");
    const [city, setCity] = useState<string>("");
    const [stateCode, setStateCode] = useState<string>("");
    const [zipCode, setZipCode] = useState<string>("");
    const [orders, setOrders] = useState<IOrder[]>(JSON.parse(localStorage.getItem("orders") || "[]"));
    const [cardName, setCardName] = useState<string>("");
    const [cardNumber, setCardNumber] = useState<string>("");
    const [expiry, setExpiry] = useState<string>("");
    const [cvc, setCvc] = useState<string>("");
    const [focus, setFocus] = useState<string>("");
    const [isCardInvalid, setIsCardInvalid] = useState<boolean>(false);
    const [isExpiryInvalid, setIsExpiryInvalid] = useState<boolean>(false);
    const [isCvcInvalid, setIsCvcInvalid] = useState<boolean>(false);
    const [cardNumberErrorText, setCardNumberErrorText] = useState<string>("");
    const [expiryErrorText, setExpiryErrorText] = useState<string>("");
    const [cvcErrorText, setCvcErrorText] = useState<string>("");
    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    const cart: IBookForOrder[] = JSON.parse(localStorage.getItem("cart") || "[]");
    const currentUser: IUser[] = JSON.parse(localStorage.getItem("currentUser") || "[]");
    const navigate = useNavigate();

    const numOfItems = cart.reduce((total: number, item: IBookForOrder) => {
        return total + item.quantity;
    }, 0);

    const itemPrice = cart.reduce((total: number, item: IBookForOrder) => {
        return total + (item.price * item.quantity);
    }, 0);

    const shippingPrice: number = (cart.find((item: IBookForOrder) => { return item.type === "HARD COPY"; }) ? 7.50 : 0);

    const taxPrice: number = (0.06625 * (itemPrice + shippingPrice));

    const totalPrice: number = itemPrice + shippingPrice + taxPrice;

    const capitalizeStateCode = (code: string) => {
        return code.toUpperCase();
    };

    const handleSaveOrder = (e: React.FormEvent<HTMLFormElement>): void => {
        e.preventDefault();

        const thisDay = new Date().getDate();
        const thisFullYear = new Date().getFullYear();
        const thisMonth = new Date().getMonth() + 1;
        const thisYear = new Date().getFullYear().toString().slice(-2);
        const cardNumberRules = cardNumber.length < 13 || cardNumber.length > 19 || !/^\d+$/.test(cardNumber);
        const expiryRules = Number(expiry.substring(0, 2)) < 1 || Number(expiry.substring(0, 1)) > 12 ||
            Number(expiry.substring(2, 4)) < Number(thisYear) || (Number(expiry.substring(0, 2)) < thisMonth &&
                Number(expiry.substring(2, 4)) === Number(thisYear));
        const cvcRules = cvc.length < 3 || cvc.length > 4;

        if (cardNumberRules) {
            setIsCardInvalid(true);
            setCardNumberErrorText("Please enter a valid card number");
        } else {
            setIsCardInvalid(false);
        }

        if (expiryRules) {
            setIsExpiryInvalid(true);
            setExpiryErrorText("Please enter a valid date");
        } else {
            setIsExpiryInvalid(false);
        }

        if (cvcRules) {
            setIsCvcInvalid(true);
            setCvcErrorText("Please enter a valid CVC");
        } else {
            setIsCvcInvalid(false);
        }

        if (cart.length < 1) {
            alert("Your cart is empty");
            navigate("/browse");
        }

        if (!cardNumberRules && !expiryRules && !cvcRules) {
            setIsProcessing(true);

            setTimeout(
                () => {
                    let newOrder = [...orders];

                    newOrder.push({
                        id: uuidv4(),
                        date: `${thisMonth}/${thisDay}/${thisFullYear}`,
                        total: Number(totalPrice.toFixed(2)),
                        address:
                        {
                            addressLineOne: addressLineOne,
                            addressLineTwo: addressLineTwo,
                            city: city,
                            state: capitalizeStateCode(stateCode),
                            zipCode: zipCode
                        },
                        payment:
                        {
                            name: cardName,
                            number: cardNumber,
                            expiry: expiry,
                            cvc: cvc
                        },
                        user:
                        {
                            firstName: currentUser[0].firstName,
                            lastName: currentUser[0].lastName,
                            email: currentUser[0].email,
                            password: currentUser[0].password
                        },
                        details: [...cart]
                    });

                    setOrders(newOrder);

                    localStorage.setItem("orders", JSON.stringify(newOrder));

                    localStorage.setItem("cart", JSON.stringify([]));

                    setIsProcessing(false);

                    navigate("/ordercomplete");
                }, 4000);
        }
    };

    return (
        <div className={classes.checkoutPage}>
            <div className={classes.checkoutHeader}>
                <div className={classes.checkoutHeaderText}>
                    Checkout - {numOfItems} {numOfItems === 1 ? "item" : "items"}
                </div>
                <Link className={classes.buttonLink} to="/cart">
                    <CartButton type="button">
                        Back to Cart
                    </CartButton>
                </Link>
            </div>
            <form className={classes.checkoutForm} onSubmit={handleSaveOrder}>
                <InfoCard>
                    <section className={classes.shippingInfoSection}>
                        <ShippingInfo
                            addressLineOne={addressLineOne}
                            addressLineTwo={addressLineTwo}
                            city={city}
                            stateCode={stateCode}
                            zipCode={zipCode}
                            onChangeAddressLineOne={(e: React.ChangeEvent<HTMLInputElement>) => { setAddressLineOne(e.target.value); }}
                            onChangeAddressLineTwo={(e: React.ChangeEvent<HTMLInputElement>) => { setAddressLineTwo(e.target.value); }}
                            onChangeCity={(e: React.ChangeEvent<HTMLInputElement>) => { setCity(e.target.value); }}
                            onChangeStateCode={(e: React.ChangeEvent<HTMLInputElement>) => { setStateCode(e.target.value); }}
                            onChangeZipCode={(e: React.ChangeEvent<HTMLInputElement>) => { setZipCode(e.target.value); }}
                        />
                    </section>
                    <section className={classes.paymentInfoSection}>
                        <PaymentInfo
                            cardName={cardName}
                            cardNumber={cardNumber}
                            expiry={expiry}
                            cvc={cvc}
                            focus={focus}
                            onFocus={(e: React.FocusEvent<HTMLInputElement>) => { setFocus(e.target.name); }}
                            onChangeName={(e: React.ChangeEvent<HTMLInputElement>) => { setCardName(e.target.value); }}
                            onChangeExpiry={(e: React.ChangeEvent<HTMLInputElement>) => { setExpiry(e.target.value); }}
                            onChangeCvc={(e: React.ChangeEvent<HTMLInputElement>) => { setCvc(e.target.value); }}
                            onChangeNumber={(e: React.ChangeEvent<HTMLInputElement>) => { setCardNumber(e.target.value); }}
                            cardNumberError={isCardInvalid}
                            expiryError={isExpiryInvalid}
                            cvcError={isCvcInvalid}
                            cardNumberErrorText={cardNumberErrorText}
                            expiryErrorText={expiryErrorText}
                            cvcErrorText={cvcErrorText}
                        />
                    </section>
                </InfoCard>
                <CheckoutCard>
                    <OrderSummary
                        item={Number(itemPrice.toFixed(2))}
                        shipping={Number(shippingPrice.toFixed(2))}
                        tax={Number(taxPrice.toFixed(2))}
                        total={Number(totalPrice.toFixed(2))}
                    />
                    <CheckOutButton variant="contained" type="submit">
                        Confirm and Pay
                    </CheckOutButton>
                </CheckoutCard>
            </form>
            <DialogComponent
                open={isProcessing}
                onClose={undefined}
                contentText={
                    <div className={classes.processing}>
                        <Oval
                            color="#6993ab"
                            height={120}
                            width={120}
                        />
                        <p>Please wait</p>
                        <p>Your order is processing...</p>
                    </div>
                }
                color="error"
                onClick={undefined}
                buttonText={undefined}
            />
        </div>
    );
};