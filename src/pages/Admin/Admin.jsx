import "./Admin.scss";
import PageContent from "../../components/PageContent/PageContent";
import Sidebar from '../../components/Sidebar/Sidebar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect, useState } from "react";
import axios from "axios";
import { Table } from "react-bootstrap";
import Badge from "../../components/Badge/Badge";
import { Link, useNavigate } from "react-router-dom";
import { useAuthUser } from "react-auth-kit";

const Admin = ({categories, types}) => {
    const [competitions, setCompetitions] = useState(null);
    const [userCount, setUserCount] = useState(0);
    const [totalPayment, setTotalPayment] = useState(0);
    const [platformBalance, setPlatformBalance] = useState(0);
    const authUser = useAuthUser();
    const navigate = useNavigate();

    useEffect(() => {
        if(authUser().admin) {
            axios
            .get(`${process.env.REACT_APP_API_URL}/challenges`)
            .then(res => setCompetitions(res.data))
            .catch(err => console.error(err));

            axios
            .get(`${process.env.REACT_APP_API_URL}/users`)
            .then(res => setUserCount(res.data.length))
            .catch(err => console.error(err));

            let tPayment = 0;
            axios
            .get(`${process.env.REACT_APP_API_URL}/payments`)
            .then(res => {
                res.data.forEach(payment => {
                    tPayment += payment.amount;
                })
                setTotalPayment(tPayment);
            })
            .catch(err => console.error(err));

            axios
            .get(`${process.env.REACT_APP_API_URL}/users/6270306ff860c3135b35f126`)
            .then(res => setPlatformBalance(res.data.balance))
            .catch(err => console.error(err));
        } else {
            navigate("/");
        }
    }, [])

    return (
        <section className="admin-page">
            <Sidebar />
            <PageContent>
                <div className="admin-page__intro">
                    <h2 className="admin-page__intro-title">Hey!</h2>
                    <p className="admin-page__intro-welcome">Need to make some changes?</p>
                </div>
                <div className="admin-page__content">
                    <div className="admin-page__top">
                        <div className="admin-page__top-section">
                            <h3 className="admin-page__top-section-title">Total Users</h3>
                            <p className="admin-page__top-section-value">{userCount}</p>
                        </div>
                        <div className="admin-page__top-section">
                            <h3 className="admin-page__top-section-title">Total Competitions</h3>
                            <p className="admin-page__top-section-value">{competitions && competitions.length}</p>
                        </div>
                        <div className="admin-page__top-section">
                            <h3 className="admin-page__top-section-title">Total Payments</h3>
                            <p className="admin-page__top-section-value">${totalPayment}</p>
                        </div>
                        <div className="admin-page__top-section">
                            <h3 className="admin-page__top-section-title">Platform Balance</h3>
                            <p className="admin-page__top-section-value">${platformBalance}</p>
                        </div>
                    </div>
                    <div className="admin-page__competitions">
                        <Table borderless style={{ verticalAlign: "middle", marginBottom: 0 }}>
                            <thead>
                                <tr>
                                    <th className="competition-report__head">#</th>
                                    <th className="competition-report__head">Name</th>
                                    <th className="competition-report__head">Type</th>
                                    <th className="competition-report__head">Category</th>
                                    <th className="competition-report__head">Sub Category</th>
                                    <th className="competition-report__head">Win/Loss</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    competitions && competitions.map((comp, i) => {
                                        return (
                                            <tr>
                                                <td className="competition-report__value">{i + 1}</td>
                                                <td className="competition-report__value" style={{ minWidth: "120px" }}><Link to={`/competition/${comp._id}`}>{comp.name}</Link></td>
                                                <td className="competition-report__value" style={{ minWidth: "120px" }}><Badge text={types[comp.type]} bgColor="#E7F7F8" color="#3DEBF6"/></td>
                                                <td className="competition-report__value"><Badge text={categories[comp.category].name} bgColor="#FFECE8" color="#F4694C"/></td>
                                                <td className="competition-report__value"><Badge text={categories[comp.category].sub_categories[comp.sub_category].name} bgColor="#F0EFFF" color="#725095"/></td>
                                                <td className="competition-report__value"><Badge text={`${comp.winner}`} bgColor="#E7F7F8" color="#3DEBF6"/></td>
                                            </tr>
                                        );
                                    })
                                }
                            </tbody>
                        </Table>
                    </div>
                </div>
            </PageContent>
            <ToastContainer />
        </section>
    );
}

export default Admin;