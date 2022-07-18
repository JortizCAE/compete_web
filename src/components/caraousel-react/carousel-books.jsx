/************************************
1. If you want to add or remove items you will need to change a variable called $slide-count in the CSS *minimum 3 slides

2. if you want to change the dimensions of the slides you will need to edit the slideWidth variable here 👇 and the $slide-width variable in the CSS.
************************************/
import { useState, useEffect } from "react";
import "./caraousel-books.scss";
import SideBar from "../Side-bar-fixed/Side-bar-fixed";

const slideWidth = 30;

const _items = [
  {
    player: {
      title: "Efren Reyes",
      image: "https://i.postimg.cc/RhYnBf5m/er-slider.jpg",
    },
  },
  {
    player: {
      title: "Ronnie O'Sullivan",
      image: "https://i.postimg.cc/qBGQNc37/ro-slider.jpg",
    },
  },
  {
    player: {
      title: "Shane Van Boening",
      image: "https://i.postimg.cc/cHdMJQKG/svb-slider.jpg",
    },
  },
  {
    player: {
      title: "Mike Sigel",
      image: "https://i.postimg.cc/C12h7nZn/ms-1.jpg",
    },
  },
  {
    player: {
      title: "Willie Mosconi",
      image: "https://i.postimg.cc/NfzMDVHP/willie-mosconi-slider.jpg",
    },
  },
];

const length = _items.length;
_items.push(..._items);

const sleep = (ms = 0) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const createItem = (position, idx) => {
  const item = {
    styles: {
      transform: `translateX(${position * slideWidth}rem)`,
    },
    player: _items[idx].player,
  };

  switch (position) {
    case length - 1:
    case length + 1:
      item.styles = { ...item.styles, filter: "grayscale(1)" };
      break;
    case length:
      break;
    default:
      item.styles = { ...item.styles, opacity: 0 };
      break;
  }

  return item;
};

const CarouselSlideItem = ({ pos, idx, activeIdx }) => {
  const item = createItem(pos, idx, activeIdx);

  return (
    <li className="carousel__slide-item" style={item.styles}>
      <div className="carousel__slide-item-img-link">
        <img src={item.player.image} alt={item.player.title} />
      </div>
      <div className="carousel-slide-item__body">
        <h4>{item.player.title}</h4>
        <p>{item.player.desc}</p>
      </div>
    </li>
  );
};

const keys = Array.from(Array(_items.length).keys());

const Carousel = () => {
  const [items, setItems] = useState(keys);
  const [isTicking, setIsTicking] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);
  const bigLength = items.length;

  const prevClick = (jump = 1) => {
    if (!isTicking) {
      setIsTicking(true);
      setItems((prev) => {
        return prev.map((_, i) => prev[(i + jump) % bigLength]);
      });
    }
  };

  const nextClick = (jump = 1) => {
    if (!isTicking) {
      setIsTicking(true);
      setItems((prev) => {
        return prev.map((_, i) => prev[(i - jump + bigLength) % bigLength]);
      });
    }
  };

  const handleDotClick = (idx) => {
    if (idx < activeIdx) prevClick(activeIdx - idx);
    if (idx > activeIdx) nextClick(idx - activeIdx);
  };

  useEffect(() => {
    if (isTicking) sleep(300).then(() => setIsTicking(false));
  }, [isTicking]);

  useEffect(() => {
    setActiveIdx((length - (items[0] % length)) % length) // prettier-ignore
  }, [items]);

  return (
    <div className="carousel__wrap ">
      <div style={{ transform: "translate(10px, -20px)" }}>
        <div class="flex justify-between heading-translate translate-y-24 items-center relative z-0">
          <span class="font-medium  text-1xl mb-12">Finance</span>
          <h2 class="text-11xl  font-medium text-[black] text-opacity-30 text-center flex-grow mr-14">
            Finance
          </h2>
        </div>

        <div className="carousel__inner">
          <button
            className="carousel__btn carousel__btn--prev"
            onClick={() => prevClick()}
          >
            <i className="carousel__btn-arrow carousel__btn-arrow--left" />
          </button>
          <div className="carousel__container">
            <ul className="carousel__slide-list">
              {items.map((pos, i) => (
                <CarouselSlideItem
                  key={i}
                  idx={i}
                  pos={pos}
                  activeIdx={activeIdx}
                />
              ))}
            </ul>
          </div>
          <button
            className="carousel__btn carousel__btn--next"
            onClick={() => nextClick()}
          >
            <i className="carousel__btn-arrow carousel__btn-arrow--right" />
          </button>
        </div>
      </div>

      <div style={{ transform: "translate(10px, -100px)" }}>
        <div class="flex justify-between heading-translate translate-y-24 items-center relative z-0">
          <span class="font-medium  text-1xl mb-12">Finance</span>
          <h2 class="text-11xl  font-medium text-[black] text-opacity-30 text-center flex-grow mr-14">
            Finance
          </h2>
        </div>
        <div className="carousel__inner">
          <button
            className="carousel__btn carousel__btn--prev"
            onClick={() => prevClick()}
          >
            <i className="carousel__btn-arrow carousel__btn-arrow--left" />
          </button>
          <div className="carousel__container">
            <ul className="carousel__slide-list">
              {items.map((pos, i) => (
                <CarouselSlideItem
                  key={i}
                  idx={i}
                  pos={pos}
                  activeIdx={activeIdx}
                />
              ))}
            </ul>
          </div>
          <button
            className="carousel__btn carousel__btn--next"
            onClick={() => nextClick()}
          >
            <i className="carousel__btn-arrow carousel__btn-arrow--right" />
          </button>
        </div>
      </div>

      <div style={{ transform: "translate(10px, -100px)" }}>
        <div class="flex justify-between heading-translate translate-y-24 items-center relative z-0">
          <span class="font-medium  text-1xl mb-12">Finance</span>
          <h2 class="text-11xl  font-medium text-[black] text-opacity-30 text-center flex-grow mr-14">
            Finance
          </h2>
        </div>

        <div className="carousel__inner">
          <button
            className="carousel__btn carousel__btn--prev"
            onClick={() => prevClick()}
          >
            <i className="carousel__btn-arrow carousel__btn-arrow--left" />
          </button>
          <div className="carousel__container">
            <ul className="carousel__slide-list">
              {items.map((pos, i) => (
                <CarouselSlideItem
                  key={i}
                  idx={i}
                  pos={pos}
                  activeIdx={activeIdx}
                />
              ))}
            </ul>
          </div>
          <button
            className="carousel__btn carousel__btn--next"
            onClick={() => nextClick()}
          >
            <i className="carousel__btn-arrow carousel__btn-arrow--right" />
          </button>
        </div>
      </div>

      <div style={{ transform: "translate(10px, -100px)" }}>
        <div class="flex justify-between heading-translate translate-y-24 items-center relative z-0">
          <span class="font-medium  text-1xl mb-12">Finance</span>
          <h2 class="text-11xl  font-medium text-[black] text-opacity-30 text-center flex-grow mr-14">
            Finance
          </h2>
        </div>
        <div className="carousel__inner">
          <button
            className="carousel__btn carousel__btn--prev"
            onClick={() => prevClick()}
          >
            <i className="carousel__btn-arrow carousel__btn-arrow--left" />
          </button>
          <div className="carousel__container">
            <ul className="carousel__slide-list">
              {items.map((pos, i) => (
                <CarouselSlideItem
                  key={i}
                  idx={i}
                  pos={pos}
                  activeIdx={activeIdx}
                />
              ))}
            </ul>
          </div>
          <button
            className="carousel__btn carousel__btn--next"
            onClick={() => nextClick()}
          >
            <i className="carousel__btn-arrow carousel__btn-arrow--right" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Carousel;
