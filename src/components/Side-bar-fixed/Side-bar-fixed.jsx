import "./Side-bar-fixed.css";
import NA from "../../assets/images/Ellipse 4.png";
import { FaChartBar } from "react-icons/fa";
import frame from "../../assets/images/Frame.png";
import fill370 from "../../assets/images/Fill370.png";
import shopping from "../../assets/images/Shopping.png";
import fill416 from "../../assets/images/Fill416.png";
import stats from "../../assets/images/stats.png";

import React from "react";
import { Link, useLocation } from "react-router-dom";
import { navlinks } from "../../helper/helpdata";
let activeFound = false;

export default function SideBar({ toggleDrawer, drawer }) {
  const location = useLocation();
  const navLinks = [
    {
      id: 3948398,
      icon: frame,
      url: "/progress",
    },
    {
      id: 5355644,
      icon: fill370,
      url: "/progress",
    },
    {
      id: 57567567,
      icon: shopping,
    },
    {
      id: 879677,
      icon: stats,
      url: "/progress",
    },
    {
      id: 56566555,
      icon: fill416,
    },
    {
      id: 67876742,
      icon: "Settings.png",
    },
  ];

  // return (
  //   <aside
  //     style={{ marginTop: "6%" }}
  //     class=" marginBottom bg-primary-300 fixed top-0 left-0 w-100px flex-col justify-between h-screen z-50 flex"
  //   >
  //     <div className="px-22px py-7 mb-8">
  //       <div class="border-primary-600 bg-primary-600 rounded-full border-4 inline-block">
  //         <a href="/">
  //           <img class="w-48px h-48px  rounded-full block" src={NA} alt="" />
  //         </a>
  //       </div>
  //     </div>
  //     <div class="mb-8">
  //       <ul class="list-none flex flex-col">
  //         <li>
  //           <a
  //             class="pl-8 pr-9 py-7 text-center block relative bg-black"
  //             href="/"
  //           >
  //             <img
  //               class="h-7 inline-block invert bg-white "
  //               src={frame}
  //               alt=""
  //             />
  //             <span class="bg-black h-full w-2.5 absolute -right-2.5 rounded-r-md top-0 bottom-0"></span>
  //           </a>
  //         </li>
  //         <li>
  //           <a
  //             class="pl-8 pr-9 py-7 text-center block relative "
  //             href="/side-bar"
  //           >
  //             <img class="h-7 inline-block bg-dark " src={fill370} alt="" />
  //           </a>
  //         </li>
  //         <li class="w-6 h-1.2px bg-white mx-auto"></li>
  //         <li>
  //           <a
  //             class="pl-8 pr-9 py-7 text-center block relative "
  //             href="/side-bar"
  //           >
  //             <img class="h-7 inline-block  " src={shopping} alt="" />
  //           </a>
  //         </li>
  //         <li class="w-6 h-1.2px bg-white mx-auto"></li>
  //         <li>
  //           <a
  //             class="pl-8 pr-9 py-7 text-center block relative "
  //             href="/side-bar"
  //           >
  //             <img class="h-7 inline-block  " src={fill416} alt="" />
  //           </a>
  //         </li>
  //         <li class="w-6 h-1.2px bg-white mx-auto"></li>
  //         <li>
  //           <a
  //             class="pl-8 pr-9 py-7 text-center block relative "
  //             href="/side-bar"
  //           >
  //             <img
  //               class="h-7 inline-block  "
  //               src="/images/Fill 416.svg"
  //               alt=""
  //             />
  //           </a>
  //         </li>
  //         <li class="w-6 h-1.2px bg-white mx-auto"></li>
  //         <li>
  //           <a
  //             class="pl-8 pr-9 py-7 text-center block relative "
  //             href="/side-bar"
  //           >
  //             <img class="h-7 inline-block  " src={stats} alt="" />
  //           </a>
  //         </li>
  //       </ul>
  //     </div>
  //   </aside>
  // );

  return (
    <aside className="bg-primary-300 fixed top-0 left-0 w-[100px] flex-col justify-between h-screen z-50 flex">
      <div className="px-[22px] py-7 mb-8" style={{ marginTop: "130px" }}>
        <div className="border-primary-600 bg-primary-600 rounded-full border-4 inline-block">
          <Link to="/">
            <img
              className="w-[48px] h-[48px]  rounded-full block"
              src={NA}
              alt=""
            />
          </Link>
        </div>
      </div>
      <div className="mb-8">
        <ul className="list-none flex flex-col">
          {navLinks.map(({ id, icon, url }, i) => {
            const active = location.pathname === url;
            if (active) {
              activeFound = i;
            }
            return (
              <React.Fragment key={id}>
                {i !== 0 && !active && activeFound !== --i && (
                  <li className="w-6 h-[1.2px] bg-[white] mx-auto" />
                )}
                <li
                  key={id}
                  onClick={() => {
                    if (!drawer && toggleDrawer) {
                      toggleDrawer();
                    }
                  }}
                >
                  <Link
                    to={url ? url : "/"}
                    className={`pl-8 pr-9 py-7 text-center block relative ${
                      active ? "bg-[black]" : ""
                    }`}
                  >
                    <img
                      className={`h-7 inline-block ${active ? "invert" : ""} `}
                      src={icon}
                      alt=""
                    />
                    {active && (
                      <span className="bg-[black] h-full w-2.5 absolute -right-2.5 rounded-r-md top-0 bottom-0" />
                    )}
                  </Link>
                </li>
              </React.Fragment>
            );
          })}
        </ul>
      </div>
      <div />
    </aside>
  );
}
