import "./PageOne.scss";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { Virtual } from 'swiper';
import 'swiper/css/virtual';
import FitnessImage from "../../../../assets/images/types/bike.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLightbulb } from "@fortawesome/free-solid-svg-icons";

const PageOne = ({types, categories, selectedType, setSelectedType, setSelectedCategory}) => {
    const categorySlides = categories.map(
        (category) => category.name
    );

    return (
        <div className="page-one">
            <div className="page-one__type">
                <h3 className="page-one__select-title">Select Types</h3>
                <div className="page-one__type-selection">
                    <div className={selectedType === 0 ? "page-one__type-selection-type page-one__type-selection-type--active" : "page-one__type-selection-type"} onClick={() => setSelectedType(0)}>
                        <div className="page-one__type-selection-type-image-container">
                            <img className="page-one__type-selection-type-image" src={FitnessImage} alt={types[0]} />
                        </div>
                        <span className="page-one__type-selection-type-title">{types[0]}</span>
                    </div>
                    <div className={selectedType === 1 ? "page-one__type-selection-type page-one__type-selection-type--active" : "page-one__type-selection-type"} onClick={() => setSelectedType(1)}>
                        <div className="page-one__type-selection-type-image-container">
                            <img className="page-one__type-selection-type-image" src={FitnessImage} alt={types[0]} />
                        </div>
                        <span className="page-one__type-selection-type-title">{types[1]}</span>
                    </div>
                    <div className={selectedType === 2 ? "page-one__type-selection-type page-one__type-selection-type--active" : "page-one__type-selection-type"} onClick={() => setSelectedType(2)}>
                        <div className="page-one__type-selection-type-image-container">
                            <img className="page-one__type-selection-type-image" src={FitnessImage} alt={types[0]} />
                        </div>
                        <span className="page-one__type-selection-type-title">{types[2]}</span>
                    </div>
                    <div className={selectedType === 3 ? "page-one__type-selection-type page-one__type-selection-type--active" : "page-one__type-selection-type"} onClick={() => setSelectedType(3)}>
                        <div className="page-one__type-selection-type-image-container">
                            <img className="page-one__type-selection-type-image" src={FitnessImage} alt={types[0]} />
                        </div>
                        <span className="page-one__type-selection-type-title">{types[3]}</span>
                    </div>
                </div>
                {/* <Swiper
                    spaceBetween={50}
                    slidesPerView={1}
                    className="page-one__swiper"
                    onSlideChange={(e) => setSelectedType(e.activeIndex)}
                    modules={[Virtual]}
                    virtual
                    >
                    {types.map((type, index) => (
                        <SwiperSlide className="page-one__swiper-slide" key={index} virtualIndex={index}>
                            <div className="page-one__swiper-slide-info">
                                <p className="page-one__swiper-slide-title">{type}</p>
                                <p className="page-one__swiper-slide-description">Some Lorem Ipsum</p>
                            </div>
                        </SwiperSlide>
                    ))}
                    ...
                </Swiper> */}
            </div>
            <div className="page-one__category">
                <h3 className="page-one__select-title">Select Category</h3>
                <Swiper
                    spaceBetween={50}
                    slidesPerView={1}
                    className="page-one__swiper"
                    onSlideChange={(e) => setSelectedCategory(e.activeIndex)}
                    modules={[Virtual]}
                    virtual
                    >
                    {categorySlides.map((slideContent, index) => (
                        <SwiperSlide className="page-one__swiper-slide" key={slideContent} virtualIndex={index}>
                            <div className="page-one__swiper-slide-info">
                                <p className="page-one__swiper-slide-title">{slideContent}</p>
                                <p className="page-one__swiper-slide-description">Some Lorem Ipsum</p>
                            </div>
                            <img className="page-one__swiper-slide-image" src={FitnessImage} alt="type-img" />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
            <span className="page-one__helper"><FontAwesomeIcon icon={faLightbulb} /> Swipe to select!</span>
        </div>
    );
}

export default PageOne;