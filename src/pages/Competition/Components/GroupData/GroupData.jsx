import "./GroupData.scss";
import { PieChart, Pie, Sector, ResponsiveContainer } from "recharts";
import { useCallback, useState } from "react";
import Badge from "../../../../components/Badge/Badge";
import Button from "../../../../components/Button/Button";
import axios from "axios";

const renderActiveShape = (props) => {
    const RADIAN = Math.PI / 180;
    const {
      cx,
      cy,
      midAngle,
      innerRadius,
      outerRadius,
      startAngle,
      endAngle,
      fill,
      payload,
      percent,
      value
    } = props;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 30) * cos;
    const my = cy + (outerRadius + 30) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
    const textAnchor = cos >= 0 ? "start" : "end";
  
    return (
      <g>
        <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
          {payload.name}
        </text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 6}
          outerRadius={outerRadius + 10}
          fill={fill}
        />
        <path
          d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
          stroke={fill}
          fill="none"
        />
        <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
        <text
          x={ex + (cos >= 0 ? 1 : -1) * 15}
          y={ey}
          textAnchor={textAnchor}
          fill="#333"
        >{value}</text>
        <text
          x={ex + (cos >= 0 ? 1 : -1) * 12}
          y={ey + 5}
          dy={18}
          textAnchor={textAnchor}
          fill="#999"
        >
          {`(${(percent * 100).toFixed(2)}%)`}
        </text>
      </g>
    );
};

const GroupData = ({ groupData, users, teamsData, isTeamGame, userData, compId, toast, type }) => {

    const data = [
      { name: "Group A", value: 400 },
      { name: "Group B", value: 300 },
      { name: "Group C", value: 300 },
      { name: "Group D", value: 200 },
      { name: "Group E", value: 200 }
    ];

    const [activeIndex, setActiveIndex] = useState(0);
    const onPieEnter = useCallback(
        (_, index) => {
        setActiveIndex(index);
        },
        [setActiveIndex]
    );

    const inviteTeamMemebers = () => {
      const userTeam = groupData.participants.find(member => member.participant_id === userData().user_id).team_id;
      const userTeamData = teamsData.find(team => team._id === userTeam);

      userTeamData.members.forEach(member => {
        const alreadyIn = groupData.participants.find(participant => participant.participant_id === member.member_id);
        if(alreadyIn === undefined) {
          let memeberName;
          axios
            .get(`${process.env.REACT_APP_API_URL}/users/${member.member_id}`)
            .then(res => {
              memeberName = res.data.user_name;
              return axios.post(`${process.env.REACT_APP_API_URL}/invites/`, {
                sent_by: userData().user_id,
                sent_to: res.data.email,
                team_id: userTeam,
                challenge_id: compId
              })
            })
            .then(res => {
                return axios
                .post(`${process.env.REACT_APP_API_URL}/notify/email`, {
                    email: res.data.sent_to,
                    text: "You got invited to join!",
                    subject: "You got invited to join this comp by your team!" +  res.data.code,
                    html: `You got invited to join! ${res.data.code}`
                })
            })
            .then(() => {
                toast.success("Invite sent to " + memeberName);
            })
            .catch(err => console.error(err)); 
        }
      })
    }

    return (
        <div className="group-data">
            <div className="group-data__chart-container">
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie
                            activeIndex={activeIndex}
                            activeShape={renderActiveShape}
                            data={data}
                            innerRadius={60}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            onMouseEnter={onPieEnter}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>
            <div className="group-data__members">
                <div className="group-data__members-header">
                  <h3>Participants</h3>
                  { type === 2 ? <Button text="Invite My Team Members" type="primary" style={{ padding: "2px 14px" }} fn={() => inviteTeamMemebers()}/> : "" }
                </div>
                <div className="group-data__members-list">
                    { groupData.participants.map(member => {
                        return (
                            <div className="group-data__member">
                                <div className="group-data__member-left">
                                    <div className="group-data__member-thumbnail-container">
                                        <img className="group-data__member-thumbnail" src={users.find(user => (user._id === member.participant_id)) ? process.env.REACT_APP_API_URL + users.find(user => (user._id === member.participant_id)).profile_pic : ""} alt="thumbnail" />
                                    </div>
                                    <p className="group-data__member-name">{users.find(user => (user._id === member.participant_id)) ? users.find(user => (user._id === member.participant_id)).user_name : ""}</p>
                                </div>
                                <div className="group-data__member-right">
                                    {isTeamGame ? <Badge text={teamsData.find(team => (team._id === member.team_id)) ? teamsData.find(team => (team._id === member.team_id)).team_name : ""} bgColor="#FFECE8" color="#F4694C"/> : "" }
                                    <Badge text={`Starting Point: ${member.start_measurement} M`} bgColor="#E7F7F8" color="#3DEBF6"/>
                                    <p className="group-data__member-date">{ new Date(member.date_joined).toISOString().replace(/T.*/,'').split('-').reverse().join('-') }</p>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    );
}

export default GroupData;