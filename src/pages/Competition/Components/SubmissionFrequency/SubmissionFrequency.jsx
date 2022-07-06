import "./SubmissionFrequency.scss";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from "recharts";

const data = [
    {
        name: "Week 1",
        Passed: 20,
        Failed: 34,
    },
    {
        name: "Week 2",
        Passed: 40,
        Failed: 14,
    },
    {
        name: "Week 3",
        Passed: 50,
        Failed: 3,
    },
];

const SubmissionFrequency = () => {
    return (
        <div className="submission-frequency">
            <h3>Submission Frequency</h3>
            <div className="submission-frequency__chart-container">
                <ResponsiveContainer width="100%" height={200}>
                    <BarChart
                        data={data}
                        margin={{
                            top: 32,
                            right: 16,
                            left: -16,
                            bottom: 16
                        }}
                        >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="Passed" fill="#78e378" />
                        <Bar dataKey="Failed" fill="#ff5959" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

export default SubmissionFrequency;