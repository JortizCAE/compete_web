import { Link, useParams } from "react-router-dom";
import Sidebar from "../../components/Sidebar/Sidebar";
import PageContent from "../../components/PageContent/PageContent";
import "./Competition.scss";
import AddMeasurements from "./Components/AddMeasurements/AddMeasurements";
import GroupData from "./Components/GroupData/GroupData";
import Submissions from "./Components/Submissions/Submissions";
import Progress from "./Components/Progress/Progress";
import SubmissionFrequency from "./Components/SubmissionFrequency/SubmissionFrequency";
import { useEffect, useState } from "react";
import axios from "axios";
import Button from "../../components/Button/Button";
import Modal from 'react-modal';
import Input from "../../components/Input/Input";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuthUser } from "react-auth-kit";
import Select from 'react-select';
import 'react-phone-number-input/style.css';
import PhoneInput from 'react-phone-number-input';
import { Form } from "react-bootstrap";

const Competition = ({ categories, types }) => {
    const params = useParams();
    const [challengeData, setChallengeData] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [inviteBy, setInviteBy] = useState({ value: "email", label: "Invite by email" });
    const userData = useAuthUser();
    const [invitePhone, setInvitePhone] = useState("");
    const [isTeamGame, setIsTeamGame] = useState(false);
    const [teams, setTeams] = useState([]);
    const [teamsData, setTeamsData] = useState([]);
    const [emailTemplate, setEmailTemplate] = useState("");
    const [userInfo, setUserInfo] = useState(null);

    const [useFitbit, setUseFitbit] = useState(false);

    const customStyles = {
        content: {
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          marginRight: '-50%',
          transform: 'translate(-50%, -50%)',
          minWidth: "500px"
        },
    };

    const reactSelectStyles = {
        option: (provided, state) => ({
            ...provided,
            color: state.isSelected ? '#725095' : '#725095',
            background: state.isSelected ? '#F0EFFF' : 'white',
            ':hover': {
              background: "#F0EFFF"
            }
          })
    }

    const inviteOptions = [
        { value: "email", label: "Invite by email" },
        { value: "phone", label: "Invite by phone" }
    ];

    const [users, setUsers] = useState([]);

    const [submissions, setSbumissions] = useState(null);

    useEffect(() => {
        axios
        .get(`${process.env.REACT_APP_API_URL}/challenges/${params.compId}`)
        .then(res => setChallengeData(res.data))
        .catch(err => console.error(err));

        axios
        .get(`${process.env.REACT_APP_API_URL}/users/${userData().user_id}`)
        .then(res => setUserInfo(res.data))
        .catch(err => console.error(err));

        getSubmissions();

        fetch(`${process.env.REACT_APP_API_URL}/email_templates/index.html`)
        .then((response) => {
            return response.text();
        })
        .then((text) => {
            setEmailTemplate(text);
        });


    }, [])

    useEffect(() => {
        if(challengeData) {
            challengeData.participants.forEach((participant) => {
                axios
                .get(`${process.env.REACT_APP_API_URL}/users/${participant.participant_id}`)
                .then(res => setUsers(prevUsers => [...prevUsers, res.data]))
                .catch(err => console.error(err))
            });

            if(challengeData.team !== null) {
                setIsTeamGame(true);
            }
        }

        setUseFitbit(challengeData && challengeData.participants.find(user => user.participant_id === userData().user_id).use_api);
    }, [challengeData])

    useEffect(() => {
        if(isTeamGame) {
            challengeData.participants.forEach((participant) => {
                setTeams(prevTeams => [...prevTeams, participant.team_id])
            });
        }
    }, [isTeamGame]);

    useEffect(() => {
        const uniqueTeams = [...new Set(teams)];
        uniqueTeams.forEach((team_id) => {
            axios
            .get(`${process.env.REACT_APP_API_URL}/teams/${team_id}`)
            .then(res => setTeamsData(prevTeams => [...prevTeams, res.data]))
            .catch(err => console.error(err))
        });
    }, [teams]);

    useEffect(() => {
        toggleFitbitAutoCapture(useFitbit);
    }, [useFitbit]);

    const getSubmissions = () => {
        axios
        .get(`${process.env.REACT_APP_API_URL}/submissions/challenge/${params.compId}`)
        .then(res => setSbumissions(res.data))
        .catch(err => console.error(err));
    }

    const sendInvite = (e) => {
        e.preventDefault();

        if(inviteBy.value === "email") {
            axios
            .post(`${process.env.REACT_APP_API_URL}/invites/`, {
                sent_by: userData().user_id,
                sent_to: e.target.inviteEmail.value,
                challenge_id: params.compId
            })
            .then(res => {
                let eTemplate = emailTemplate;
                eTemplate = eTemplate.replace("{ hi }", "Hello!");
                eTemplate = eTemplate.replace("{ header }", "Ready to compete?");
                eTemplate = eTemplate.replace("{ sub-title }", `Your friend ${userData().username} invited you!`);
                eTemplate = eTemplate.replace("{ text }", `<p>You were invited by your friend to a Competeae competition! Are you ready to accept the challenge? Click accept to learn more about the competition.`)
                eTemplate = eTemplate.replace("{ call-to-action }", `Accept Challenge!`);
                eTemplate = eTemplate.replace("{ call-link }", `${process.env.REACT_APP_WEB_URL}/join/${res.data.code}`);

                return axios
                .post(`${process.env.REACT_APP_API_URL}/notify/email`, {
                    email: res.data.sent_to,
                    text: `You were invited by your friend to a Competeae competition! Are you ready to accept the challenge? Click accept to learn more about the competition. Open ${process.env.REACT_APP_WEB_URL}/join/${res.data.code} to learn more!`,
                    subject: "Your friend challenged you to a competition!",
                    html: eTemplate
                })
            })
            .then(() => {
                setModalOpen(false);
                toast.success("Invite sent to " + e.target.inviteEmail.value);
                e.target.inviteEmail.value = "";
            })
            .catch(err => console.error(err));
        }

        if(inviteBy.value === "phone") {
            axios
            .post(`${process.env.REACT_APP_API_URL}/invites/`, {
                sent_by: userData().user_id,
                sent_to: invitePhone,
                challenge_id: params.compId
            })
            .then(res => {
                return axios.post(`${process.env.REACT_APP_API_URL}/notify/sms`, {
                    to: invitePhone,
                    body: `You were invited by ${userData().username} to a Competeae competition! Click accept to learn more about the competition. Open ${process.env.REACT_APP_WEB_URL}/join/${res.data.code} to learn more!`,
                })
            })
            .then(() => {toast.success(`Invite sent to ${invitePhone}`); setModalOpen(false); setInvitePhone("")})
            .catch(err => console.error(err));
        }
    }

    const toggleFitbitAutoCapture = (e) => {
        axios
        .patch(`${process.env.REACT_APP_API_URL}/challenges/${params.compId}/api-toggle`, {
            participant_id: userData().user_id,
            use_api: e,
            api_provider: "fitbit"
        })
        .catch(err => console.error(err));
    }

    const testCalculation = () => {
        axios
        .get(`${process.env.REACT_APP_API_URL}/compute/${params.compId}`)
        .then(res => {
            console.log(res.data);
        })
        .catch(err => console.error(err));
    }

    if(challengeData) {
        return (
            <section className="competition">
                <Sidebar />
                <PageContent>
                    <div className="competition__intro">
                        <div>
                            <h2 className="competition__intro-title">{challengeData.name}</h2>
                            <p className="competition__intro-welcome">{new Date(challengeData.start_date).toISOString().replace(/T.*/,'').split('-').reverse().join('-')} to {new Date(challengeData.end_date).toISOString().replace(/T.*/,'').split('-').reverse().join('-')}</p>
                            <div className="competition__intro-info">
                                <span><b>Type</b>: {types[challengeData.type]}</span>
                                <span><b>Category</b>: { categories[challengeData.category].name }</span>
                                <span><b>Sub Category</b>: { categories[challengeData.category].sub_categories[challengeData.sub_category].name }</span>
                                <span><b>Measurement</b>: { categories[challengeData.category].sub_categories[challengeData.sub_category].measurements[challengeData.measurement].name }</span>
                                <span><b>Measure By</b>: { challengeData.calculate_by }</span>
                                {
                                    challengeData.type === 0 ?
                                    <span><b>Goal</b>: {challengeData.goal}</span> : ""
                                }
                                {
                                    categories[challengeData.category].sub_categories[challengeData.sub_category].measurements[challengeData.measurement].apis_endpoints.fitbit !== "" && userInfo && userInfo.fitbit_code === null ?
                                    <p>This game allows you to automatically capture data by having your Fitbit account connected! To enable this feature, connect Fitbit on the <Link to="/settings">settings</Link> page.</p> :
                                    <Form.Check 
                                        type="switch"
                                        id="custom-switch"
                                        label="Enable Fitbit Auto Capture"
                                        checked={useFitbit}
                                        onChange={(e) => setUseFitbit(e.target.checked)}
                                    />
                                }
                            </div>
                        </div>
                        <div>
                            <Button text="Invite" type="primary" fn={() => setModalOpen(true)} />
                            {/* <Button text="Test Calculation" type="primary" fn={() => testCalculation()} /> */}
                        </div>
                    </div>
                    <div className="competition__content">
                        <div className="competition__main">
                            <AddMeasurements challengeId={params.compId} getSubmissions={getSubmissions} placeholder_text={categories[challengeData.category].sub_categories[challengeData.sub_category].measurements[challengeData.measurement].submission_field_text} />
                            { challengeData.type !== 0 ? <GroupData groupData={challengeData} users={users} isTeamGame={isTeamGame} teamsData={teamsData} userData={userData} compId={params.compId} type={challengeData.type} toast={toast} /> : "" }
                            <Submissions submissions={submissions} users={users} getSubmissions={getSubmissions} toast={toast} />
                        </div>
                        <div className="competition__side-bar">
                            <Progress start_date={challengeData.start_date} end_date={challengeData.end_date} />
                            <SubmissionFrequency />
                        </div>
                    </div>
                </PageContent>
                <Modal
                    isOpen={modalOpen}
                    onRequestClose={() => setModalOpen(false)}
                    style={customStyles}
                    contentLabel="Add Member"
                >
                    <div className="add-member__modal">
                        <div className="add-member__modal-intro">
                            <h2>Invite Members</h2>
                            <span onClick={() => setModalOpen(false)} style={{ cursor: "pointer" }}><FontAwesomeIcon icon={faClose} /></span>
                        </div>
                        <form className="add-member__modal-content" onSubmit={sendInvite}>
                            <p>They will be notified even if they don't have an account!</p>
                            <Select options={inviteOptions} styles={reactSelectStyles} placeholder="Select Sub Category" value={inviteBy} onChange={(e) => setInviteBy(e)}/>
                            { inviteBy.value === "email" ? <Input placeholder="Enter email" id="inviteEmail" /> :
                            <PhoneInput
                                placeholder="Enter phone number"
                                value={invitePhone}
                                id="invitePhone"
                                onChange={setInvitePhone}/>
                            }
                            <Button text="Invite" type="primary" />
                        </form>
                    </div>
                </Modal>
                <ToastContainer />
            </section>
        );
    } else {
        return (
            <section className="competition">
                <Sidebar />
                <PageContent>
                    <h2>No competition found!</h2>
                </PageContent>
            </section>
        );
    }
}

export default Competition;