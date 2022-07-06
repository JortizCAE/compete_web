import "./Progress.scss";
import { ProgressBar } from "react-bootstrap";
import { useEffect, useState } from "react";

const Progress = ({ start_date, end_date }) => {
    const [progress, setProgress] = useState(0);
    const [daysLeft, setDaysLeft] = useState(0);

    useEffect(() => {
        const daysTotal = getNumberOfDays(start_date, end_date);
        const dayToNow = getNumberOfDays(start_date, Date.now());
        setProgress((dayToNow / daysTotal) * 100);
        setDaysLeft(daysTotal - dayToNow);
    }, [])
    

    return (
        <div className="progress-made">
            <h3>Progress</h3>
            <p className="progress-made__days">{daysLeft} days left</p>
            <ProgressBar className="progress-made__bar" now={progress} />
        </div>
    );
}

function getNumberOfDays(start, end) {
    const date1 = new Date(start);
    const date2 = new Date(end);
    const oneDay = 1000 * 60 * 60 * 24;
    const diffInTime = date2.getTime() - date1.getTime();
    const diffInDays = Math.round(diffInTime / oneDay);

    return diffInDays;
}

export default Progress;