import { faHeart as faHeartBlank } from "@fortawesome/free-regular-svg-icons";
import { faHeart, faShare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./RecentPosts.scss";
import { CopyToClipboard } from "react-copy-to-clipboard";

const RecentPosts = ({ posts, authUser, toast }) => {
  if (posts.length > 0) {
    return (
      <div className="recent-posts">
        <h2 className="recent-posts__title">Recent Posts</h2>
        <div className="recent-posts__container">
          {posts.map((data) => {
            return (
              <div className="post" style={{ width: "100%" }}>
                <div className="post-header">
                  <div className="post-user">
                    <span className="post-user-thumbnail">
                      <img
                        className="post-user-image"
                        src={authUser().user_image}
                        alt="user"
                      />
                    </span>
                    <div className="post-user-details">
                      <p className="post-user-name">{authUser().username}</p>
                      <p className="post-user-date">
                        {new Date(data.date)
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
                  {data.image && (
                    <span className="post-content-image-container">
                      <img
                        className="post-content-image"
                        src={data.image}
                        alt="post-img"
                      />
                    </span>
                  )}
                  <p className="post-content-text">{data.text}</p>
                </div>
                <div className="post-content-stats">
                  <span className="post-content-like">
                    <FontAwesomeIcon
                      className="post-content-like-heart"
                      icon={data.likes.length > 0 ? faHeart : faHeartBlank}
                    />
                    {data.likes.length}
                  </span>
                  <CopyToClipboard
                    text={process.env.REACT_APP_WEB_URL + "/post/" + data._id}
                    onCopy={() => toast.success("Link copied to clipboard!")}
                  >
                    <span className="post-content-share">
                      <FontAwesomeIcon icon={faShare} />
                    </span>
                  </CopyToClipboard>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  } else {
    return (
      <div className="recent-posts">
        <h2 className="recent-posts__title">Recent Posts</h2>
        <div className="recent-posts__container">
          <h2 className="recent-posts__data">Nothing To Show Here!</h2>
        </div>
      </div>
    );
  }
};

export default RecentPosts;
