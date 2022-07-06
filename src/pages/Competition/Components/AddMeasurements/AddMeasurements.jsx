import "./AddMeasurements.scss";
import Input from "../../../../components/Input/Input";
import Button from "../../../../components/Button/Button";
import axios from "axios";
import { useAuthUser } from "react-auth-kit";
import { useState } from "react";

const AddMeasurements = ({ challengeId, getSubmissions, placeholder_text }) => {
    const userData = useAuthUser();
    const [value, setValue] = useState("");

    const makeSubmissions = () => {
        axios
        .post(`${process.env.REACT_APP_API_URL}/submissions/`, {
            user: userData().user_id,
            challenge_id: challengeId,
            date: Date.now(),
            value: value
        })
        .then(res => {
            setValue("");
            getSubmissions();
        })
        .catch(err => console.error(err));
    }

    return (
        <div className="add-measurements">
            <h3 className="add-measurements__title">Update Journal</h3>
            <div className="add-measurements__form">
                <Input placeholder={`Enter ${placeholder_text}...`} type="number" value={value} onChange={(e) => setValue(e.target.value)} />
                <Button type="primary" text="Add" fn={() => makeSubmissions()} />
            </div>
        </div>
    );
}

export default AddMeasurements;