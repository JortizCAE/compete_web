import "./Search.scss";
import { useParams, Link } from "react-router-dom";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tabs";
import axios from "axios";
import { useEffect, useState } from "react";
import Bike from "../../assets/images/types/bike.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as faHeartBlank } from "@fortawesome/free-regular-svg-icons";
import { faHeart, faShare } from "@fortawesome/free-solid-svg-icons";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Search = () => {
  const params = useParams();
  const searchQuery = params.query;
  const [result, setResults] = useState();
  const [postUsers, setPostUsers] = useState([]);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/search/${searchQuery}`)
      .then((res) => {
        setResults(res.data);
        if (res.data.posts) {
          res.data.posts.forEach((post) => {
            axios
              .get(`${process.env.REACT_APP_API_URL}/users/${post.user}`)
              .then((res) =>
                setPostUsers((prevUsers) => [...prevUsers, res.data])
              )
              .catch((err) => console.error(err));
          });
        }
      })
      .catch((err) => console.log(err));
  }, [searchQuery]);

  return (
    <section className="search-results">
      <div className="search-results__wrapper">
        <div className="search-results__intro">
          <h2 className="search-results__intro-title">
            Showing search results for{" "}
            <span className="search-results__intro-query">{searchQuery}</span>
          </h2>
        </div>
        <Tabs defaultActiveKey="competitions" className="mb-3">
          <Tab eventKey="competitions" title="Competitions">
            <div className="search-results__list">
              {result && result.challenges.length !== 0 ? (
                result.challenges.map((challenge) => {
                  return (
                    <Link to={`/competition/${challenge._id}`}>
                      <div className="competitions__competition">
                        <div className="competitions__competition-main competitions__competition-main">
                          <div className="competitions__competition-info">
                            <p className="competitions__competition-category">
                              Fitness
                            </p>
                            <p className="competitions__competition-pot">
                              ${challenge.participants.length * challenge.wager}
                            </p>
                          </div>
                          <img
                            className="competitions__competition-image"
                            src={Bike}
                            alt="bike"
                          />
                        </div>
                        <p className="competitions__competition-name">
                          {challenge.name}
                        </p>
                      </div>
                    </Link>
                  );
                })
              ) : (
                <h2>No challenge found.</h2>
              )}
            </div>
          </Tab>
          <Tab eventKey="users" title="Users">
            <div className="search-results__list">
              {result && result.users.length !== 0 ? (
                result.users.map((user) => {
                  return (
                    <div className="search-results__user">
                      <div className="search-results__user-image-container">
                        <img
                          className="search-results__user-image"
                          src={process.env.REACT_APP_API_URL + user.profile_pic}
                          alt="user"
                        />
                      </div>
                      {user.user_name}
                    </div>
                  );
                })
              ) : (
                <h2>No user found.</h2>
              )}
            </div>
          </Tab>
          <Tab eventKey="posts" title="Posts">
            <div className="search-results__list search-results__list--posts">
              {result && result.posts.length !== 0 ? (
                result.posts.map((post) => {
                  return (
                    <div className="post">
                      <div className="post-header">
                        <div className="post-user">
                          <span className="post-user-thumbnail">
                            <img
                              className="post-user-image"
                              src={
                                postUsers.find((user) => user._id === post.user)
                                  ? postUsers.find(
                                      (user) => user._id === post.user
                                    ).profile_pic
                                  : ""
                              }
                              alt="user"
                            />
                          </span>
                          <div className="post-user-details">
                            <p className="post-user-name">
                              {postUsers.find((user) => user._id === post.user)
                                ? postUsers.find(
                                    (user) => user._id === post.user
                                  ).user_name
                                : ""}
                            </p>
                            <p className="post-user-date">
                              {new Date(post.date)
                                .toISOString()
                                .replace(/T.*/, "")
                                .split("-")
                                .reverse()
                                .join("-")}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="post-content">
                        {post.image && (
                          <span className="post-content-image-container">
                            <img
                              className="post-content-image"
                              src={process.env.REACT_APP_API_URL + post.image}
                              alt="post-img"
                            />
                          </span>
                        )}
                        <p className="post-content-text">{post.text}</p>
                      </div>
                      <div className="post-content-stats">
                        <span className="post-content-like">
                          <FontAwesomeIcon
                            className="post-content-like-heart"
                            icon={
                              post.likes.length > 0 ? faHeart : faHeartBlank
                            }
                          />
                          {post.likes.length}
                        </span>
                        <CopyToClipboard
                          text={
                            process.env.REACT_APP_WEB_URL + "/post/" + post._id
                          }
                          onCopy={() =>
                            toast.success("Link copied to clipboard!")
                          }
                        >
                          <span className="post-content-share">
                            <FontAwesomeIcon icon={faShare} />
                          </span>
                        </CopyToClipboard>
                      </div>
                    </div>
                  );
                })
              ) : (
                <h2>No post found.</h2>
              )}
            </div>
          </Tab>
        </Tabs>
      </div>
      <ToastContainer />
    </section>
  );
};

export default Search;
