import "./AcceptCompetition.scss";
import { useParams, Link, useNavigate } from "react-router-dom";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";
import SplashImage from "../../assets/images/accept_invite.svg";
import { useEffect, useState } from "react";
import axios from "axios";
import { useIsAuthenticated, useAuthUser } from 'react-auth-kit';
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import SadImage from "../../assets/images/sad.svg";
import Select from 'react-select'

const AcceptCompetition = () => {
    const params = useParams();
    const [invitedBy, setInvitedBy] = useState(null);
    const [challengeData, setChallengeData] = useState(null);
    const [inviteData, setInviteData] = useState(null);
    const [isTeamGame, setIsTeamGame] = useState(false);
    const [teams, setTeams] = useState([]);
    const [teamsOption, setTeamsOption] = useState([]);
    const [selectedTeam, setSelectedTeam] = useState({value: null, label: "0"});
    const [canSelectTeam, setCanSelectTeam] = useState(true);

    const [alreadyIn, setAlreadyIn] = useState(false);

    const customStyles = {
        option: (provided, state) => ({
          ...provided,
          color: state.isSelected ? '#725095' : '#725095',
          background: state.isSelected ? '#F0EFFF' : 'white',
          ':hover': {
            background: "#F0EFFF"
          }
        })
    }

    const isAuthenticated = useIsAuthenticated();
    const authUser = useAuthUser();
    const navigate = useNavigate();
    
    // Stripe
    const stripe = useStripe();
    const elements = useElements();

    const [startMeasurement, setStartMeasurement] = useState("");

    useEffect(() => {
        axios
        .get(`${process.env.REACT_APP_API_URL}/invites/${params.code}`)
        .then(res => {
            setInviteData(res.data);
        })
        .catch(err => console.log(err))
    }, [])

    useEffect(() => {
        if(inviteData) {
            axios
            .get(`${process.env.REACT_APP_API_URL}/users/${inviteData.sent_by}`)
            .then((res) => {
                setInvitedBy(res.data.user_name);
                return axios
                .get(`${process.env.REACT_APP_API_URL}/challenges/${inviteData.challenge_id}`)
            })
            .then(res => setChallengeData(res.data))
        }
    }, [inviteData]);

    useEffect(() => {
        if(challengeData && authUser()) {
            if(challengeData.participants.find(participant => participant.participant_id === authUser().user_id)) {
                setAlreadyIn(true);
            }
        }

        if(challengeData && authUser()) {
            if(challengeData.team !== null) {
                setIsTeamGame(true);
                axios
                .get(`${process.env.REACT_APP_API_URL}/teams/user/${authUser().user_id}`)
                .then(res => setTeams(res.data))
                .catch(err => console.error(err));
            }
        }
    }, [challengeData]);

    useEffect(() => {
        const teamsObj = [];
        teams.forEach(team => {
            teamsObj.push({ value: team._id, label: team.team_name});
        });
        setTeamsOption(teamsObj);
    }, [teams]);

    useEffect(() => {
        if(inviteData && inviteData.team_id) {
            setCanSelectTeam(false);
            setSelectedTeam(teamsOption.find(team => team.value === inviteData.team_id));
        } else {
            setSelectedTeam(teamsOption[0]);
        }
    }, [teamsOption]);

    const acceptChallenge = async (e) => {
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
        const amount = challengeData.wager;

        axios
        .post(`${process.env.REACT_APP_API_URL}/payments`, {
            user: authUser().user_id,
            amount: amount,
            stripe_id: id,
            description: challengeData.name,
            date: Date.now()
        })
        .then(() => {
            return axios
            .patch(`${process.env.REACT_APP_API_URL}/challenges/${challengeData._id}/add`, {
                participant_id: authUser().user_id,
                team_id: selectedTeam.value,
                start_measurement: startMeasurement
            })
        })
        .then(() => {
            return axios
            .delete(`${process.env.REACT_APP_API_URL}/invites/${params.code}`)
        })
        .then(res => {
            navigate(`/competition/${challengeData._id}`);
        })
        .catch(err => alert("Something went wrong"));
    }
    
    if (alreadyIn) {
        return (
            <section className="accept-competition">
                <div className="accept-competition__wrapper">
                    <div className="accept-competition__image-container">
                        <img className="accept-competition__image" src={SplashImage} alt="accept-invite" />
                    </div>
                    <div className="accept-competition__error">
                        <h2>Looks like you are already part of this competition!</h2>
                        <Link to={`/competition/${challengeData._id}`}><Button style={{ width: "100%" }} text="Visit Competition Page" type="primary" /></Link>
                    </div>
                </div>
            </section>
        )
    } else if(challengeData) {
        return (
            <section className="accept-competition">
                <div className="accept-competition__wrapper">
                    <div className="accept-competition__image-container">
                        <img className="accept-competition__image" src={SplashImage} alt="accept-invite" />
                    </div>
                    <div className="accept-competition__form-container">
                        <h2 className="accept-competition__title">You were invited to join {challengeData.name}</h2>
                        <p>Your friend {invitedBy} invited you to join this challenge!<br />Are you up for it?</p>
                        {
                            isAuthenticated() ? 
                            <>
                                <form className="accept-competition__form" onSubmit={acceptChallenge}>
                                    { isTeamGame ?
                                    <>
                                        <b><p>Wager: ${challengeData.wager}</p></b>
                                        <Select options={teamsOption && teamsOption} styles={customStyles} placeholder="Select Team" value={selectedTeam} onChange={(e) => setSelectedTeam(e)} isDisabled={!canSelectTeam}/> 
                                        <Input id="code" type="number" placeholder="Enter Your Current Measurement" value={startMeasurement} onChange={(e) => setStartMeasurement(e.target.value)} required/>
                                        <p>Payment Details</p>
                                        <CardElement />
                                        <Button text="Confirm & Make Payment" type="primary" button_type="submit" />
                                    </>
                                    : 
                                    <>
                                        <Input id="code" type="number" placeholder="Enter Your Current Measurement" value={startMeasurement} onChange={(e) => setStartMeasurement(e.target.value)} required/>
                                        <p>Payment Details</p>
                                        <CardElement />
                                        <Button text="Confirm & Make Payment" type="primary" button_type="submit" />
                                    </>
                                    } 
                                </form>
                            </> : 
                            <>
                                <p className="accept-competition__login-error">You must login before you continue!</p>
                                <Link to="/login"><Button style={{ width: "100%" }} text="Login →" type="primary" /></Link>
                                <p className="accept-competition__info">Please revisit this page once you are logged in!</p>
                                <p className="login__description">If you don't have an account, <br /> please <Link to="/register">Register Here!</Link></p>
                            </>
                        }
                    </div>
                </div>
            </section>
        );
    } else {
        return (
            <section className="accept-competition">
                <div className="accept-competition__wrapper">
                    <div className="accept-competition__image-container">
                        <img className="accept-competition__image" src={SadImage} alt="accept-invite" />
                    </div>
                    <div className="accept-competition__error">
                        <h2>No invite found / Code already used!</h2>
                    </div>
                </div>
            </section>
        )
    }
}

export default AcceptCompetition;