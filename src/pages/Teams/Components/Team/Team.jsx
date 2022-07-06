import { faCirclePlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./Team.scss";
import { useState, useEffect } from "react";
import axios from "axios";
import {CopyToClipboard} from 'react-copy-to-clipboard';

const Team = ({data, toast, fetchTeams, authUser, setModal3Open, setInvitedAt}) => {
    const [users, setUsers] = useState([]);

    const getUsers = () => {
        data.members.forEach((member) => {
            axios
            .get(`${process.env.REACT_APP_API_URL}/users/${member.member_id}`)
            .then(res => setUsers(prevUsers => [...prevUsers, res.data]))
            .catch(err => console.error(err));
        });
    }

    useEffect(() => {
        getUsers();
    }, []);

    const deleteTeam = () => {
        if (window.confirm('Are you sure you want to delete this team?')) {
            axios
            .delete(`${process.env.REACT_APP_API_URL}/teams/${data._id}`)
            .then(() => {toast.success("Team deleted!"); fetchTeams();})
            .catch(err => console.error(err));
        }
    }

    const leaveTeam = () => {
        axios
        .patch(`${process.env.REACT_APP_API_URL}/teams/${data._id}/remove`, {
            member_id: authUser().user_id
        })
        .then(() => { toast.success("You left the team!"); fetchTeams(); })
        .catch(err => console.error(err));
    }

    return (
        <div className="team">
            <div className="team__header">
                <div className="team__info">
                    <p className="team__name">{data.team_name}</p>
                    <p className="team__owner">Owner: <b>{users && users.find(user => (user._id === data.user)) ? users.find(user => (user._id === data.user)).user_name : ""}</b></p>
                    <p className="team__win">Total Wins: <b>23</b> (<span className="team__win-cash">$3433</span>)</p>
                </div>
                <div className="team__settings">
                    {
                        data.user === authUser().user_id ?
                        <div className="team__settings-owner">
                            <span className="team__settings-delete" title="Delete Team" onClick={deleteTeam}>Delete Team</span>
                            <CopyToClipboard text={data.join_key} onCopy={() => toast.success("Team password copied to clipboard.")}>
                                <span className="team__settings-code" title="Copy Password">Password: {data.join_key}</span>
                            </CopyToClipboard>
                        </div> :
                        <span className="team__settings-delete" title="Delete Team" onClick={leaveTeam}>Leave Team</span>
                    }
                </div>
            </div>
            <div className="team__members">
                {
                    data.members.map(member => {
                        return (
                            <span className="team__member">
                                <div className="team__member-image-container">
                                    <img className="team__member-image" src={users && users.find(user => (user._id === member.member_id)) ? process.env.REACT_APP_API_URL + users.find(user => (user._id === member.member_id)).profile_pic : ""} alt="team-member" />
                                </div>
                                {users && users.find(user => (user._id === member.member_id)) ? users.find(user => (user._id === member.member_id)).user_name : ""}
                            </span>
                        );
                    })
                }
                <span className="team__add">
                    <FontAwesomeIcon icon={faCirclePlus} onClick={() => {setInvitedAt(data.join_key); setModal3Open(true)}} />
                </span>
            </div>
        </div>
    );
}

export default Team;