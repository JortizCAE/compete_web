import "./CompetitionReport.scss";
import { Table } from "react-bootstrap";
import Badge from "../../../../components/Badge/Badge";
import { Link } from "react-router-dom";

const CompetitionReport = ({categories, competitions, user_id, types}) => {
    return (
        <div className="competition-report">
            <h2 className="competition-report__title">Competitions Report</h2>
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
                        competitions.map((comp, i) => {
                            return (
                                <tr>
                                    <td className="competition-report__value">{i + 1}</td>
                                    <td className="competition-report__value" style={{ minWidth: "120px" }}><Link to={`/competition/${comp._id}`}>{comp.name}</Link></td>
                                    <td className="competition-report__value" style={{ minWidth: "120px" }}><Badge text={types[comp.type]} bgColor="#E7F7F8" color="#3DEBF6"/></td>
                                    <td className="competition-report__value"><Badge text={categories[comp.category].name} bgColor="#FFECE8" color="#F4694C"/></td>
                                    <td className="competition-report__value"><Badge text={categories[comp.category].sub_categories[comp.sub_category].name} bgColor="#F0EFFF" color="#725095"/></td>
                                    <td className="competition-report__value">{comp.winner === user_id && comp.status === 0 ? <Badge text="Won" bgColor="#E7F7F8" color="#3DEBF6"/> : comp.winner !== user_id && comp.status === 0 ? <Badge text="Lost" bgColor="#FFECE8" color="#F4694C"/> : <Badge text="Pending" bgColor="#FFECE8" color="#F4694C"/>}</td>
                                </tr>
                            );
                        })
                    }
                </tbody>
            </Table>
        </div>
    );
}

export default CompetitionReport;