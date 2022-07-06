import "./Summery.scss";
import Circle from 'react-circle';

const Summery = ({totalCompetitions, wonCompetitions}) => {
    return (
        <div className="summery">
            <h2 className="summery__title">Summery</h2>
            <div className="summery__container">
                <div className="summery__sub">
                    <p className="summery__sub-title">Total Competitions</p>
                    <div className="summery__sub-data">{totalCompetitions}</div>
                </div>
                <div className="summery__sub">
                    <p className="summery__sub-title">Win Rate</p>
                    <div className="summery__sub-data">
                        <Circle
                            progress={((wonCompetitions / totalCompetitions) * 100).toFixed(2)}
                            animate={true}
                            lineWidth="15"
                            progressColor="#725095"
                            bgColor=""
                            textColor="#725095"
                            roundedStroke={true}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Summery;