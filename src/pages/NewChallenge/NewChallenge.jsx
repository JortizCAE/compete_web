import "./NewChallenge.scss";
import Sidebar from '../../components/Sidebar/Sidebar';
import PageContent from "../../components/PageContent/PageContent";
import { useState, useEffect } from "react";
import PageOne from "./Components/PageOne/PageOne";
import PageTwo from "./Components/PageTwo/PageTwo";
import PageThree from "./Components/PageThree/PageThree";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons"
import { ToastContainer, toast } from 'react-toastify';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const NewChallenge = ({categories, types}) => {

    const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

    const [selectedCategory, setSelectedCategory] = useState(0);
    const [selectedType, setSelectedType] = useState(0);

    useEffect(() => {
        setPageTwoStates({...pageTwoStates, goal: selectedType === 0 ? null : 0});
    }, [selectedType])
    
    const date = new Date();

    const [pageTwoStates, setPageTwoStates] = useState({
        name: null,
        wager: null,
        selectedSub: null,
        selectedMeasurement: null,
        selectedTeam: { value: null, label: "0" },
        calculateBy: { value: 0, label: "sum" },
        goal: selectedType === 0 ? null : 0,
        start_measurement: 0,
        dates: [
            {
                startDate: date,
                endDate: date,
                key: 'selection'
            }
        ]
    });

    const steps = [
        {
            state: [],
            component: <PageOne types={types}
            categories={categories}
            setSelectedCategory={setSelectedCategory}
            selectedType={selectedType}
            setSelectedType={setSelectedType} />
        },
        {
            state: pageTwoStates,
            component: <PageTwo
            categories={categories}
            selectedCategory={selectedCategory}
            types={types}
            type={selectedType}
            pageTwoStates={pageTwoStates}
            setPageTwoStates={setPageTwoStates}
            />,
        },
        {
            state: [],
            component: <Elements stripe={stripePromise}><PageThree data={pageTwoStates} category={selectedCategory} type={selectedType} /></Elements>
        }
    ]

    const [index, setIndex] = useState(0);

    const goNext = () => {
        const isEmpty = Object.values(steps[index].state).some(x => x === null || x === "" || x === undefined);

        if(!isEmpty) {
            if(index === 1) {
                if(pageTwoStates.dates[0].startDate === pageTwoStates.dates[0].endDate) {
                    return toast.warn("End date can't be set to starting date, please go back and fix it");
                } else if(pageTwoStates.dates[0].startDate < Date.now()) {
                    return toast.warn("Starting date can't be set in the past");
                }
                setIndex(index + 1);
                window.scrollTo(0, 0);
            } else {
                setIndex(index + 1);
                window.scrollTo(0, 0);
            }
        } else {
            toast.warn("Please fill in all the fields before moving forward");
        }
    }

    return (
        <>
            <section className="new-challenge">
                <Sidebar />
                <PageContent>
                    <div className="new-challenge__intro">
                        <h2 className="new-challenge__intro-title">Create Competition</h2>
                        <p className="new-challenge__intro-welcome">Ready to challenge your friends?</p>
                    </div>
                    <div className="new-challenge__content">
                        {
                            steps.map((step, i) => {
                                return (<div style={{ display: index === i ? "block" : "none" }}>{step.component}</div>);
                            })
                        }

                        <div className="new-challenge__controller">
                            <span className="new-challenge__controller-button" style={{ visibility: (index === 0) ? "hidden" : "visible" }} onClick={() => {setIndex(index - 1); window.scrollTo(0, 0)}}>
                                <FontAwesomeIcon icon={faArrowLeft} />
                                Previous
                            </span>
                            <span className="new-challenge__controller-button" style={{ visibility: (index === steps.length - 1) ? "hidden" : "visible" }} onClick={() => goNext()}>
                                Next
                                <FontAwesomeIcon icon={faArrowRight} />
                            </span>
                        </div>
                    </div>
                </PageContent>
            </section>
            <ToastContainer />
        </>
    )
}

export default NewChallenge;