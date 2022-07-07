import "./Post.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as faHeartBlank } from "@fortawesome/free-regular-svg-icons";
import {
  faHeart,
  faShare,
  faEllipsis,
} from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";
import axios from "axios";
import { CopyToClipboard } from "react-copy-to-clipboard";

const Post = ({ data, users, toast, getPosts, authUser }) => {
  const [dropdownVisible, setdropdownVisible] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(data.likes.length);

  const deletePost = () => {
    axios
      .delete(`${process.env.REACT_APP_API_URL}/posts/${data._id}`)
      .then(() => {
        getPosts();
        toast.success("Post deleted!");
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    if (data.likes.find((user) => user.user === authUser().user_id)) {
      setLiked(true);
    }
  }, []);

  const likePost = () => {
    axios
      .patch(`${process.env.REACT_APP_API_URL}/posts/${data._id}/like`, {
        user: authUser().user_id,
      })
      .then(() => {
        setLiked(true);
        setLikesCount(likesCount + 1);
      })
      .catch((err) => console.error(err));
  };

  const disLikePost = () => {
    axios
      .patch(`${process.env.REACT_APP_API_URL}/posts/${data._id}/dislike`, {
        user: authUser().user_id,
      })
      .then(() => {
        setLiked(false);
        setLikesCount(likesCount - 1);
      })
      .catch((err) => console.error(err));
  };

  return (
    <div className="post">
      <div className="post-header">
        <div className="post-user">
          <span className="post-user-thumbnail">
            <img
              className="post-user-image"
              src={
                users.find((user) => user._id === data.user)
                  ? users.find((user) => user._id === data.user).profile_pic
                  : ""
              }
              alt="user"
            />
          </span>
          <div className="post-user-details">
            <p className="post-user-name">
              {users.find((user) => user._id === data.user)
                ? users.find((user) => user._id === data.user).user_name
                : ""}
            </p>
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
        {data.user === authUser().user_id ? (
          <div className="post-header-settings">
            <FontAwesomeIcon
              icon={faEllipsis}
              onClick={() => setdropdownVisible(!dropdownVisible)}
            />
            <div
              className="post-header-settings-dropdown"
              style={{ display: dropdownVisible ? "flex" : "none" }}
            >
              <p className="post-header-settings-dropdown__item">Edit</p>
              <p
                className="post-header-settings-dropdown__item post-header-settings-dropdown__item--delete"
                onClick={deletePost}
              >
                Delete
              </p>
            </div>
          </div>
        ) : (
          ""
        )}
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
        <span
          className="post-content-like"
          onClick={() => (liked ? disLikePost() : likePost())}
        >
          <FontAwesomeIcon
            className="post-content-like-heart"
            icon={liked ? faHeart : faHeartBlank}
          />
          {likesCount}
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
};

export default Post;
