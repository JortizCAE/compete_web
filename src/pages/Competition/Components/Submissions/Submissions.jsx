import "./Submissions.scss";
import { Table } from "react-bootstrap";
import Badge from "../../../../components/Badge/Badge";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage, faCheckCircle, faCircleXmark } from "@fortawesome/free-solid-svg-icons"
import axios from "axios";

const Submissions = ({ submissions, users, getSubmissions, toast }) => {

    const toggleVerify = (id) => {
        axios
        .put(`${process.env.REACT_APP_API_URL}/submissions/${id}`, {
            verified: !submissions.find(sub => sub._id === id).verified
        })
        .then(() => {
            getSubmissions();
            toast.success("Changed submission status!");
        })
        .catch(err => console.error(err));
    }

    if(submissions) {
        return (
            <div className="submissions">
                <Table borderless style={{ verticalAlign: "middle", marginBottom: 0 }}>
                    <thead>
                        <tr>
                            <th className="competition-report__head">Name</th>
                            <th className="competition-report__head">Date</th>
                            <th className="competition-report__head">Measurement</th>
                            <th className="competition-report__head">Image</th>
                            <th className="competition-report__head">Verified</th>
                        </tr>
                    </thead>
                    <tbody>
                        { submissions.sort((a, b) => {return new Date(b.date) - new Date(a.date)}).map(sub => {
                            return (
                                <tr>
                                    <td className="competition-report__value">{users.find(user => (user._id === sub.user)) ? users.find(user => (user._id === sub.user)).user_name : ""}</td>
                                    <td className="competition-report__value">{ new Date(sub.date).toISOString().replace(/T.*/,'').split('-').reverse().join('-') }</td>
                                    <td className="competition-report__value"><Badge text={ `${sub.value} M` } bgColor="#F0EFFF" color="#A7A3FF"/></td>
                                    <td className="competition-report__value" style={{ cursor: "pointer" }}><span className="submissions__open-image" onClick={() => window.open(sub.image)}>Open <FontAwesomeIcon icon={faImage} /></span></td>
                                    <td className="competition-report__value"><Badge text={sub.verified ? "Yes" : "No"} bgColor={sub.verified ? "#defff0" : "#FFECE8"} color={sub.verified ? "#47ffac" : "#F4694C"}/></td>
                                    <td className="competition-report__value" style={{ textAlign: "right" }}><span className="submissions__verify" title={sub.verified ? "Unverify" : "Verify"} onClick={() => toggleVerify(sub._id)}><FontAwesomeIcon icon={sub.verified ? faCircleXmark : faCheckCircle} /></span></td>
                                </tr>
                            )
                        })}
                    </tbody>
                </Table>
            </div>
        );
    } else {
        return <></>;
    }
}

export default Submissions;