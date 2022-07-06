import "./Teams.scss";
import PageContent from "../../components/PageContent/PageContent";
import Sidebar from '../../components/Sidebar/Sidebar';
import Input from "../../components/Input/Input";
import Team from "./Components/Team/Team";
import Button from "../../components/Button/Button";
import { useAuthUser } from "react-auth-kit";
import { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Modal from 'react-modal';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import 'react-phone-number-input/style.css';
import PhoneInput from 'react-phone-number-input';
import Select from 'react-select';
import { useSearchParams } from "react-router-dom";

const Teams = () => {
    const authUser = useAuthUser();
    const [searchParams] = useSearchParams();
    const code = searchParams.get('code');
    const [modalOpen, setModalOpen] = useState(false);
    const [modal2Open, setModal2Open] = useState(false);
    const [modal3Open, setModal3Open] = useState(false);
    const [teams, setTeams] = useState([]);
    const [invitePhone, setInvitePhone] = useState("");
    const [inviteBy, setInviteBy] = useState({ value: "email", label: "Invite by email" });
    const [invitedAt, setInvitedAt] = useState();
    const [inviteCode, setInviteCode] = useState("");
    const [emailTemplate, setEmailTemplate] = useState("");

    useEffect(() => {
        if(code) {
            setInviteCode(code);
            setModal2Open(true);
        }

        fetch(`${process.env.REACT_APP_API_URL}/email_templates/index.html`)
        .then((response) => {
            return response.text();
        })
        .then((text) => {
            setEmailTemplate(text);
        });
    }, []);

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

    useEffect(() => {
        fetchTeams();
    }, [])

    const fetchTeams = () => {
        axios
        .get(`${process.env.REACT_APP_API_URL}/teams/user/${authUser().user_id}`)
        .then(res => setTeams(res.data))
        .catch(err => console.error(err));
    }

    const addTeam = (e) => {
        e.preventDefault();

        if(e.target.teamName.value !== "") {
            axios
            .post(`${process.env.REACT_APP_API_URL}/teams`, {
                user: authUser().user_id,
                team_name: e.target.teamName.value,
                members: [
                    {
                        member_id: authUser().user_id,
                        date_joined: Date.now()
                    }
                ]
            })
            .then(res => {
                toast.success("Your new team created!");
                e.target.teamName.value = "";
                setModalOpen(false);
                fetchTeams();
            })
            .catch(err => console.error(err));
        } else {
            toast.error("Team name can't be empty");
        }
    }

    const joinTeam = (e) => {
        e.preventDefault();

        if(e.target.teamPassword.value !== "") {
            axios
            .patch(`${process.env.REACT_APP_API_URL}/teams/join/${e.target.teamPassword.value}`, {
                member_id: authUser().user_id
            })
            .then(() => { toast.success("Joined team!"); fetchTeams(); setModal2Open(false); e.target.teamPassword.value = ""; })
            .catch(err => {
                if(err.response.status == 405) {
                    toast.error("You are already part of this team!")
                }
                if(err.response.status == 403) {
                    toast.error("No team found!")
                }
            });
        }
    }

    const inviteMemeber = (e) => {
        e.preventDefault();

        if(inviteBy.value === "email") {
            let eTemplate = emailTemplate;
            eTemplate = eTemplate.replace("{ hi }", "Hello!");
            eTemplate = eTemplate.replace("{ header }", "Join Your Friends!");
            eTemplate = eTemplate.replace("{ sub-title }", `Your friend ${authUser().username} invited you!`);
            eTemplate = eTemplate.replace("{ text }", `<p>You were invited to join their team at Competeae. To enter the team please enter this password: ${invitedAt}! Open <a href="${process.env.REACT_APP_WEB_URL}/teams/?code=${invitedAt}">${process.env.REACT_APP_WEB_URL}/teams/code?=${invitedAt}</a> to see more details!. Join different challenges with your friends to earn prizes!<p>`)
            eTemplate = eTemplate.replace("{ call-to-action }", `Join Team`);
            eTemplate = eTemplate.replace("{ call-link }", `${process.env.REACT_APP_WEB_URL}/teams/?code=${invitedAt}`);

            axios
            .post(`${process.env.REACT_APP_API_URL}/notify/email`, {
                email: e.target.inviteEmail.value,
                subject: "Your friend invited you to join their team!",
                text: `Your friend ${authUser().username} invited you to join their team at Competacae! Password to enter: ${invitedAt}! Open ${process.env.REACT_APP_WEB_URL}/teams/?code=${invitedAt} for more details!`,
                html: eTemplate
            })
            .then(() => {toast.success(`Invite Sent to ${e.target.inviteEmail.value}`); setModal3Open(false); e.target.inviteEmail.value = "";})
            .catch(err => console.error(err));
        }

        if(inviteBy.value === "phone") {
            axios
            .post(`${process.env.REACT_APP_API_URL}/notify/sms`, {
                to: invitePhone,
                body: `Your friend ${authUser().username} invited you to join their team at Competacae! Password to enter: ${invitedAt}! Open ${process.env.REACT_APP_WEB_URL}/teams/?code=${invitedAt} to join the team.`,
            })
            .then(() => {toast.success(`Invite Sent to ${invitePhone}`); setModal3Open(false); setInvitePhone("")})
            .catch(err => console.error(err));
        }
    }

    return (
        <section className="teams">
            <Sidebar />
            <PageContent>
                <div className="teams__intro">
                    <h2 className="teams__intro-title">Your Teams</h2>
                    <div className="teams__intro-buttons">
                        <Button text="New Team" type="primary" fn={() => setModalOpen(true)}/>
                        <Button text="Join Team" type="primary" fn={() => setModal2Open(true)}/>
                    </div>
                </div>
                <div className="teams__content">
                    {
                        teams && teams.map(team => {
                            return (
                                <Team data={team} toast={toast} fetchTeams={fetchTeams} authUser={authUser} setModal3Open={setModal3Open} setInvitedAt={setInvitedAt} />
                            );
                        })
                    }
                    {
                        teams.length < 1 ? <h2>No teams found, <span style={{ color: "#725095", cursor: "pointer" }} onClick={() => setModalOpen(true)}>Create One</span> now!</h2> : ""
                    }
                </div>
            </PageContent>
            <Modal
                isOpen={modalOpen}
                onRequestClose={() => setModalOpen(false)}
                style={customStyles}
                contentLabel="Add New Team"
            >
                <div className="add-team__modal">
                    <div className="add-team__modal-intro">
                        <h2>Add New Team</h2>
                        <span onClick={() => setModalOpen(false)} style={{ cursor: "pointer" }}><FontAwesomeIcon icon={faClose} /></span>
                    </div>
                    <form className="add-team__modal-content" onSubmit={addTeam}>
                        <Input placeholder="Enter Team Name" id="teamName" maxlength={20} />
                        <Button text="Create Team" type="primary" />
                    </form>
                </div>
            </Modal>
            <Modal
                isOpen={modal2Open}
                onRequestClose={() => setModal2Open(false)}
                style={customStyles}
                contentLabel="Join Team"
            >
                <div className="add-team__modal">
                    <div className="add-team__modal-intro">
                        <h2>Join Team</h2>
                        <span onClick={() => setModal2Open(false)} style={{ cursor: "pointer" }}><FontAwesomeIcon icon={faClose} /></span>
                    </div>
                    <form className="add-team__modal-content" onSubmit={joinTeam}>
                        <Input placeholder="Enter Join Password" id="teamPassword" value={inviteCode} onChange={(e) => setInviteCode(e.target.value)} />
                        <Button text="Join" type="primary" />
                    </form>
                </div>
            </Modal>
            <Modal
                isOpen={modal3Open}
                onRequestClose={() => setModal3Open(false)}
                style={customStyles}
                contentLabel="Join Team"
            >
                <div className="add-team__modal">
                    <div className="add-team__modal-intro">
                        <h2>Invite Team Member</h2>
                        <span onClick={() => setModal3Open(false)} style={{ cursor: "pointer" }}><FontAwesomeIcon icon={faClose} /></span>
                    </div>
                    <form className="add-team__modal-content" onSubmit={inviteMemeber}>
                        <Select options={inviteOptions} styles={reactSelectStyles} placeholder="Select Sub Category" value={inviteBy} onChange={(e) => setInviteBy(e)}/>
                        { inviteBy.value === "email" ? <Input placeholder="Enter email" id="inviteEmail" /> :
                        <PhoneInput
                            placeholder="Enter phone number"
                            value={invitePhone}
                            id="invitePhone"
                            onChange={setInvitePhone}/>
                        }
                        <Button text="Send Invite" type="primary" button_type="submit" />
                    </form>
                </div>
            </Modal>
            <ToastContainer />
        </section>
    );
}

export default Teams;