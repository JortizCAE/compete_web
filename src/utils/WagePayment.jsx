import "./WagePayment.scss";
import axios from "axios";
import { useAuthUser } from "react-auth-kit";
import Button from "../components/Button/Button";
import { useNavigate } from "react-router-dom";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

const WagePayment = ({ handleSubmit }) => {
  const CARD_ELEMENT_OPTIONS = {
    style: {
      base: {
        color: "#32325d",
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSmoothing: "antialiased",
        fontSize: "16px",
        "::placeholder": {
          color: "#aab7c4",
        },
      },
      invalid: {
        color: "#fa755a",
        iconColor: "#fa755a",
      },
    },
  };

  // Stripe
  const stripe = useStripe();
  const elements = useElements();

  const createCompetition = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const cardElement = elements.getElement(CardElement);

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement,
    });

    if (error) {
      return alert(error.message);
    }

    const { id } = paymentMethod;

    handleSubmit(id);
  };

  return (
    <div className="page-three">
      <form className="page-three__form" onSubmit={createCompetition}>
        <CardElement options={CARD_ELEMENT_OPTIONS} />
        <Button text="Place Bet" type="primary" button_type="submit" />
      </form>
    </div>
  );
};

export default WagePayment;
