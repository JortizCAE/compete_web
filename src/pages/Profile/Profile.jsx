import CompetitionReport from "./Components/CompetitionReport/CompetitionReport";
import PageContent from "../../components/PageContent/PageContent";
import Sidebar from '../../components/Sidebar/Sidebar';
import Summery from './Components/Summery/Summery';
import RecentlyPlayed from './Components/RecentlyPlayed/RecentlyPlayed';
import './Profile.scss';
import RecentPosts from './Components/RecentPosts/RecentPosts';
import { useState, useEffect } from "react";
import axios from "axios";
import { useAuthUser } from "react-auth-kit";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Profile = ({categories, types}) => {
    const authUser = useAuthUser();
    const [competitions, setCompetitions] = useState(null);
    const [posts, setPosts] = useState(null);

    useEffect(() => {
        axios
        .get(`${process.env.REACT_APP_API_URL}/challenges/user/${authUser().user_id}`)
        .then(res => setCompetitions(res.data))
        .catch(err => console.error(err));

        axios
        .get(`${process.env.REACT_APP_API_URL}/posts/user/${authUser().user_id}`)
        .then(res => setPosts(res.data))
        .catch(err => console.error(err));
    }, [])

    return (
        <section className="profile">
            <Sidebar />
            <PageContent>
                { competitions && posts ? 
                <>
                    <div className="profile__intro">
                        <h2 className="profile__intro-title">Hey, {authUser().username}!</h2>
                        <p className="profile__intro-welcome">Welcome back, nice to see you again!</p>
                    </div>
                    <div className="profile__content">
                        <Summery totalCompetitions={competitions.length} wonCompetitions={competitions.filter(challenge => challenge.winner === authUser().user_id).length} />
                        <RecentlyPlayed competitions={competitions} toast={toast} />
                        <CompetitionReport categories={categories} competitions={competitions} types={types} user_id={authUser().user_id} />
                        <RecentPosts posts={posts} authUser={authUser} />
                    </div>
                </> : "" }
            </PageContent>
            <ToastContainer />
        </section>
    );
}

export default Profile;