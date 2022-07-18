import "./PageThree.scss";
import axios from "axios";
import { useAuthUser } from "react-auth-kit";
import Button from "../../../../components/Button/Button";
import { useNavigate } from "react-router-dom";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

const PageThree = ({ data, category, type }) => {
  const authUser = useAuthUser();
  const navigate = useNavigate();

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
    const amount = data.wager;

    axios
      .post(`${process.env.REACT_APP_API_URL}/payments`, {
        user: authUser().user_id,
        amount: amount,
        stripe_id: id,
        description: data.name,
        date: Date.now(),
      })
      .then(() => {
        return axios.post(`${process.env.REACT_APP_API_URL}/challenges`, {
          user: authUser().user_id,
          name: data.name,
          type: type,
          category: category,
          sub_category: data.selectedSub.value,
          measurement: data.selectedMeasurement.value,
          calculate_by: data.calculateBy.label,
          goal: data.goal,
          start_date: data.dates[0].startDate,
          end_date: data.dates[0].endDate,
          wager: data.wager,
          team: data.selectedTeam.value,
          participants: [
            {
              participant_id: authUser().user_id,
              team_id: data.selectedTeam.value,
              start_measurement: data.start_measurement,
              date_joined: new Date(),
            },
          ],
        });
      })
      .then((res) => {
        navigate(`/competition/${res.data._id}`);
      })
      .catch((err) => alert(err));
  };

  return (
    <div className="page-three">
      <div className="page-three__header">
        <div className="page-three__header-side-1">
          <h3 className="page-three__header-title">Make Payment</h3>
          <p className="page-three__header-info">One last step!</p>
        </div>
        <div className="page-three__header-side-2">
          <h2 className="page-three__header-title">Total: ${data.wager}</h2>
        </div>
      </div>
      <form className="page-three__form" onSubmit={createCompetition}>
        <CardElement />
        <Button text="Create Competition" type="primary" button_type="submit" />
      </form>
    </div>
  );
};

export default PageThree;
