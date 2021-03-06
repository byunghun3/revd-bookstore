import React, { FC, useState, useEffect, useContext } from "react";
import { useParams, useNavigate, Params } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { Grid } from "@mui/material";
import { BooksData } from "../../data/BooksData";
import { LoginContext } from "../../contexts/LoginContext";
import { ProductDetails } from "../../components/ProductDetails/ProductDetails";
import { AccordionComponent } from "../../components/AccordionComponent/AccordionComponent";
import { ProductReviews } from "../../components/ProductReviews/ProductReviews";
import { IBook, IBookForOrder, IUser, IReview } from "../../interfaces/Interfaces";
import { styled } from "@mui/system";
import classes from "./Product.module.css";

const ContainerGrid = styled(Grid)({
  display: "flex",
  justifyContent: "center"
});

const ItemGrid = styled(Grid)({
  display: "block",
  marginBottom: "5vh"
});

const ReaderReviewGrid = styled(Grid)({
  flex: "1",
  flexDirection: "column",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "5%",
  maxWidth: "100%"
});

export const Product: FC = () => {
  const [cart, setCart] = useState<IBookForOrder[]>(JSON.parse(localStorage.getItem("cart") || "[]"));
  const [reviews, setReviews] = useState<IReview[]>(JSON.parse(localStorage.getItem("reviews") || "[]"));
  const [comment, setComment] = useState<string>("");
  const [rating, setRating] = useState<number>(0);
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const { isLoggedIn } = useContext(LoginContext);
  const currentUser: IUser[] = JSON.parse(localStorage.getItem("currentUser") || "[]");
  const books = BooksData;
  const { id }: any = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
    navigate(`/browse/${books[id - 1].id}`);
  }, [cart, reviews]);

  const handleChangeReviewComment = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isLoggedIn) {
      setComment(e.target.value);
    } else {
      setShowDialog(true);
    }
  };

  const maxStock = books.find((book: IBook) => {
    return book.id === books[id - 1].id;
  })?.stock;

  const handleAddToCart = () => {
    let newCart = [...cart];

    let duplicateInCart = newCart.find((book: IBookForOrder) => {
      return book.id === books[id - 1].id;
    });

    if (duplicateInCart && duplicateInCart.quantity === maxStock) {
      alert("out of stock");
    } else if (duplicateInCart) {
      duplicateInCart.quantity++;
    } else {
      newCart.push({
        id: books[id - 1].id,
        title: books[id - 1].title,
        author: books[id - 1].author,
        image: books[id - 1].image,
        type: books[id - 1].type,
        genre: books[id - 1].genre,
        rating: books[id - 1].rating,
        price: books[id - 1].sale > 0 ? Number((books[id - 1].price - (books[id - 1].price * books[id - 1].sale)).toFixed(2)) : books[id - 1].price,
        stock: books[id - 1].stock,
        sale: books[id - 1].sale,
        status: books[id - 1].status,
        quantity: 1,
        review: books[id - 1].review
      });
    }
    setCart(newCart);

    localStorage.setItem("cart", JSON.stringify(newCart));
  };

  const handleRating = (rate: number): void => {
    if (isLoggedIn) {
      setRating(rate);
    } else {
      setRating(0);
      setShowDialog(true);
    }
  };

  const handleSubmitReview = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    const thisDay = new Date().getDate();
    const thisMonth = new Date().getMonth() + 1;
    const thisFullYear = new Date().getFullYear();

    if (isLoggedIn) {
      let newReview = [...reviews];

      newReview.push({
        id: uuidv4(),
        date: `${thisMonth}/${thisDay}/${thisFullYear}`,
        user:
        {
          firstName: currentUser[0].firstName,
          lastName: currentUser[0].lastName,
          email: currentUser[0].email,
          password: currentUser[0].password
        },
        review:
        {
          bookId: books[id - 1].id,
          title: books[id - 1].title,
          author: books[id - 1].author,
          comment: comment,
          rating: rating / 20
        }
      });

      setReviews(newReview);

      localStorage.setItem("reviews", JSON.stringify(newReview));

      setRating(0);

      setComment("");
    } else {
      setShowDialog(true);
    }
  };

  const handleCloseDialog = (): void => {
    setShowDialog(false);
  };

  const handleGoToLogin = (): void => {
    navigate("/login");
  };

  return (
    <div className={classes.productPage}>
      <ContainerGrid container >
        <ItemGrid item xs={12} sm={6} md={6}>
          <img className={classes.bookCover} src={books[id - 1].image} alt="" />
        </ItemGrid>
        <ItemGrid item xs={12} sm={6} md={6}>
          <ProductDetails
            title={books[id - 1].title}
            author={books[id - 1].author}
            type={books[id - 1].type}
            rating={books[id - 1].rating}
            price={books[id - 1].price}
            sale={books[id - 1].sale}
            stock={books[id - 1].stock}
            onSubmit={handleAddToCart}
          />
          <div className={classes.accordion}>
            <AccordionComponent
              accordionSummary="Revd Review (may contain spoilers!)"
              accordionDetails={books[id - 1].review}
            />
          </div>
        </ItemGrid>
      </ContainerGrid>
      <ReaderReviewGrid>
        <ProductReviews
          id={books[id - 1].id}
          rating={rating}
          comment={comment}
          open={showDialog}
          onSubmit={handleSubmitReview}
          onRate={handleRating}
          onChange={handleChangeReviewComment}
          onClose={handleCloseDialog}
          onLogIn={handleGoToLogin}
        />
      </ReaderReviewGrid>
    </div>
  );
};