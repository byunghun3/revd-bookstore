import React, { useState, useEffect, useContext } from "react"
import { Link, useParams, useNavigate } from "react-router-dom"
import { v4 as uuidv4 } from "uuid"
import { Button, Card, Dialog, DialogActions, DialogContent, DialogContentText } from "@mui/material"
import { Grid } from "@mui/material"
import { Accordion, AccordionSummary, AccordionDetails } from "@mui/material"
import { TextField } from "@mui/material"
import { styled } from "@mui/system"
import classes from "./Product.module.css"
import { BooksData } from "../../data/BooksData"
import { ReaderReviewsData } from "../../data/ReaderReviewsData"
import { LoginContext } from "../../contexts/LoginContext"
import ProductDetails from "../../components/ProductDetails/ProductDetails"
import AccordionComponent from "../../components/AccordionComponent/AccordionComponent"
import ReaderReview from "../../components/ReaderReview/ReaderReview"


const ContainerGrid = styled(Grid)({
  display: "flex",
  justifyContent: "center",
})

const ItemGrid = styled(Grid)({
  display: "block",
})



const ReaderReviewGrid = styled(Grid)({
  flex: "1",
  flexDirection: "column",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "5%",
  width: "100%",
  // border: "solid black"
})


interface Props {

}

const Product: React.FC<Props> = ({ }) => {
  const [cart, setCart] = useState(JSON.parse(localStorage.getItem("cart") || "[]"))
  const [reviews, setReviews] = useState(JSON.parse(localStorage.getItem("reviews") || "[]"))
  const [comment, setComment] = useState("")
  const [rating, setRating] = useState(0)
  const [showAlert, setShowAlert] = useState(false)
  const { isLoggedIn } = useContext(LoginContext)
  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "[]")
  const books = BooksData
  const { id }: any = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart))
    navigate(`/browse/${books[id - 1].id}`)
  }, [cart])

  const handleChangeReviewComment = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isLoggedIn) {
      setComment(e.target.value)
    } else {
      setShowAlert(true)
    }
  }



  const maxStock = books.find((el: any) => {
    return el.id === books[id - 1].id
  })?.stock

  const handleAddToCart = () => {
    let newCart = [...cart]

    let duplicateInCart = newCart.find((el: any) => {
      return el.id === books[id - 1].id
    })

    console.log(newCart, duplicateInCart)

    if (duplicateInCart && duplicateInCart.quantity === maxStock) {
      alert("out of stock")
    } else if (duplicateInCart) {
      duplicateInCart.quantity++
    } else {
      newCart.push({
        id: books[id - 1].id,
        title: books[id - 1].title,
        author: books[id - 1].author,
        image: books[id - 1].image,
        type: books[id - 1].type,
        price: books[id - 1].price,
        stock: books[id - 1].stock,
        quantity: 1
      })
    }
    setCart(newCart)

    localStorage.setItem("cart", JSON.stringify(newCart))
  }

  const handleRating = (rate: number) => {
    if (isLoggedIn) {
      setRating(rate)
    } else {
      setRating(0)
      setShowAlert(true)
    }
  }

  const handleSubmitReview = (e: React.FormEvent<HTMLFormElement>) => {
    const thisDay = new Date().getDate()
    const thisMonth = new Date().getMonth() + 1
    const thisFullYear = new Date().getFullYear()

    if (isLoggedIn) {
      let newReview = [...reviews]

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
          comments: comment,
          rating: rating / 20
        }
      })

      setReviews(newReview)

      localStorage.setItem("reviews", JSON.stringify(newReview))
    } else {
      e.preventDefault()
      setShowAlert(true)
    }
  }

  const handleCloseAlert = () => {
    setShowAlert(false)
  }

  const handleGoToLogin = () => {
    navigate("/login")
  }

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
            stock={books[id - 1].stock}
            onSubmit={handleAddToCart}
          />
          {/* <BookDetailsCard>
            <form className={classes.bookDetails} onSubmit={handleAddToCart}>
              {books[id - 1].title}
              <div className={classes.bookAuthor}>
                <span className={classes.bookAuthorBy}>
                  by&nbsp;
                </span>
                <span className={classes.bookAuthorName}>
                  {books[id - 1].author}
                </span>
              </div>
              <h4 className={classes.bookType}>
                <div className={classes.bookTypeWord}>{books[id - 1].type}</div></h4>
              <h4 className={classes.bookRating}><BookRating rating={rating} /></h4>
              <h3 className={classes.bookPrice}>${books[id - 1].price}</h3>
              <Button type="submit">Add to Cart</Button>
              {books[id - 1].stock < 4 ?
                <div className={classes.bookStock}>
                  Only {books[id - 1].stock} books left in stock
                </div> :
                <div className={classes.bookStock}>
                </div>}
            </form>
            <AccordionComponent
              accordionSummary="hello"
              accordionDetails="well"
            />
          </BookDetailsCard> */}
          <div className={classes.accordion}>
            <AccordionComponent
              accordionSummary="hello"
              accordionDetails="well"
            />
          </div>
        </ItemGrid>
      </ContainerGrid>
      <ReaderReviewGrid>
        <ReaderReview
          id={books[id - 1].id}
          rating={rating}
          comment={comment}
          open={showAlert}
          onSubmit={handleSubmitReview}
          // onRate={() => handleRating(rating)}
          onRate={handleRating}
          onChange={handleChangeReviewComment}
          onClose={handleCloseAlert}
          onLogIn={handleGoToLogin}
        />
        {/* <div className={classes.readerReviewsTitle}>Reader Reviews</div>
        <div>
          <div className={classes.avgReaderRating}>
            <AvgReaderRating rating={avgRating} />
            {avgRating ? avgRating.toFixed(1) : null}&nbsp;
            ({numOfTotalRatings} reviews)
          </div>
          <div className={classes.readerReviews}>
            {displayHardCodedReaderReviews}
            {displayReaderReviews}
          </div>
        </div>
        <form className={classes.readerReviewsForm} onSubmit={handleSubmitReview}>
          <div className={classes.submitRatingAndButton}>
            <Rating
              onClick={handleRating}
              ratingValue={rating}
              allowHalfIcon
              fillColor="#FDCC0D"
              emptyColor="#EEE"
            />
            <Button variant="outlined" type="submit">Submit</Button>
          </div>
          <ReviewTextField
            multiline
            minRows={3}
            label="Leave a review..."
            name="reviewComments"
            type="text"
            value={comment}
            // onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setReviewComments(e.target.value) }}
            onChange={handleChangeReviewComment}
            required
          />
        </form>
        <Dialog
          open={showAlert}
          onClose={handleCloseAlert}
        >
          <DialogContent>
            <DialogContentText>
              Please log in to submit your review
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleGoToLogin}>Log In</Button>
          </DialogActions>
        </Dialog> */}
      </ReaderReviewGrid>
    </div>
  )
}

export default Product
