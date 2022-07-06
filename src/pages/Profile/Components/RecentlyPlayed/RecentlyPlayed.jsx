import "./RecentlyPlayed.scss";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import "swiper/css/effect-cards";
import { EffectCards } from "swiper";
import Bike from "../../../../assets/images/types/bike.svg";
import { Link } from "react-router-dom";

const RecentlyPlayed = ({competitions}) => {
    return (
        <div className="recently-played">
            <h2 className="recently-played__title">Recently Played</h2>
            <div className="recently-played__data">
                {
                    competitions.slice(0).slice(-3).map((comp) => {
                        return (
                            <Link className="recently-played__data-link" to={`/competition/${comp._id}`}>
                                <div className="recently-played__card">
                                    <div className="recently-played__card-header">
                                        <img className="recently-played__card-header-image" src={Bike} alt="name" />
                                    </div>
                                    <div className="recently-played__card-data">
                                        <p className="recently-played__card-title">{comp.name}</p>
                                        <p className="recently-played__card-description">{new Date(comp.start_date).toISOString().replace(/T.*/,'').split('-').reverse().join('-')}</p>
                                    </div>
                                </div>
                            </Link>
                        );
                    })
                }
            </div>
            <Swiper
                effect={"cards"}
                grabCursor={true}
                modules={[EffectCards]}
                className="recently-played__swiper"
            >
                {
                    competitions.slice(1).slice(-3).map((comp) => {
                        return (
                            <SwiperSlide className="recently-played__swiper-slide">
                                <Link className="recently-played__swiper-slide-link" to={`/competition/${comp._id}`}>
                                    <div className="recently-played__card-header">
                                        <img className="recently-played__card-header-image" src={Bike} alt="name" />
                                    </div>
                                    <div className="recently-played__card-data">
                                        <p className="recently-played__card-title">{comp.name}</p>
                                        <p className="recently-played__card-description">{new Date(comp.start_date).toISOString().replace(/T.*/,'').split('-').reverse().join('-')}</p>
                                    </div>
                                </Link>
                            </SwiperSlide>
                        );
                    })
                }
            </Swiper>
        </div>
    );
}

export default RecentlyPlayed;