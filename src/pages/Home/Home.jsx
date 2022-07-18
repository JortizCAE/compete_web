import "./Home.scss";
import PageContent from "../../components/PageContent/PageContent";
import Sidebar from "../../components/Sidebar/Sidebar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus, faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import Button from "../../components/Button/Button";
import axios from "axios";
import { useEffect, useState } from "react";
import { useAuthUser } from "react-auth-kit";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Post from "./Post/Post";
import ImageUploading from "react-images-uploading";
import { v4 as uuidv4 } from "uuid";

const Home = () => {
  const [posts, setPosts] = useState(null);
  const [users, setUsers] = useState([]);
  const [newPostText, setNewPostText] = useState("");
  const authUser = useAuthUser();
  const [postImage, setPostImage] = useState([]);

  useEffect(() => {
    getPosts();
  }, []);

  useEffect(() => {
    if (posts) {
      posts.forEach((post) => {
        axios
          .get(`${process.env.REACT_APP_API_URL}/users/${post.user}`)
          .then((res) => setUsers((prevUsers) => [...prevUsers, res.data]))
          .catch((err) => console.error(err));
      });
    }
  }, [posts]);

  const getPosts = () => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/posts`)
      .then((res) => setPosts(res.data))
      .catch((err) => console.log(err));
  };

  const makePost = () => {
    if (newPostText !== "") {
      if (postImage.length > 0) {
        let formData = new FormData();
        formData.append("image", postImage[0].file);

        axios
          .post(`${process.env.REACT_APP_API_URL}/upload`, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
          .then((res) => {
            return axios.post(`${process.env.REACT_APP_API_URL}/posts`, {
              user: authUser().user_id,
              text: newPostText,
              image: res.data.url,
            });
          })
          .then(() => {
            getPosts();
            setNewPostText("");
            setPostImage([]);
            toast.success("New post! Make sure to share with your friends.");
          })
          .catch((err) => console.log(err));
      } else {
        axios
          .post(`${process.env.REACT_APP_API_URL}/posts`, {
            user: authUser().user_id,
            text: newPostText,
          })
          .then(() => {
            getPosts();
            setNewPostText("");
            toast.success("New post! Make sure to share with your friends.");
          })
          .catch((err) => console.log(err));
      }
    } else {
      toast.warn("Post can't be empty!");
    }
  };

  return (
    <section className="home">
      <Sidebar />
      <PageContent>
        <div className="home__content">
          <div className="home__content-main">
            <div className="home__new-post">
              <textarea
                className="home__new-post-content"
                placeholder="What you have in your mind?"
                value={newPostText}
                onChange={(e) => setNewPostText(e.target.value)}
              />
              {postImage[0] && (
                <div className="home__new-post-image-container">
                  <img
                    className="home__new-post-image"
                    src={postImage[0] && postImage[0].data_url}
                    alt="post-img"
                  />
                  <span
                    className="home__new-post-image-remove"
                    onClick={() => setPostImage([])}
                  >
                    <FontAwesomeIcon icon={faCircleXmark} />
                  </span>
                </div>
              )}
              <div className="home__new-post-footer">
                <ImageUploading
                  multiple={false}
                  value={postImage}
                  onChange={(e) => setPostImage(e)}
                  maxNumber={23432}
                  dataURLKey="data_url"
                >
                  {({ onImageUpload, dragProps }) => (
                    <div
                      className="home__new-post-upload"
                      onClick={onImageUpload}
                      {...dragProps}
                    >
                      <FontAwesomeIcon icon={faCirclePlus} />
                      Add Image
                    </div>
                  )}
                </ImageUploading>
                <Button text="Post" type="primary" fn={makePost} />
              </div>
            </div>
            <div className="home__to-follow home__to-follow--mobile">
              <h3 className="home__to-follow-title">Who to follow</h3>
              <div className="home__to-follow-users">
                <div className="home__to-follow-user">
                  <div className="home__to-follow-user-detail">
                    <span className="home__to-follow-user-thumbnail">
                      <img
                        className="home__to-follow-user-image"
                        src="https://static.scientificamerican.com/sciam/cache/file/7A715AD8-449D-4B5A-ABA2C5D92D9B5A21_source.png"
                        alt="user"
                      />
                    </span>
                    <p className="home__to-follow-user-name">Sifat Dipta</p>
                  </div>
                  <Button
                    text="Follow"
                    type="primary"
                    style={{
                      backgroundColor: "white",
                      paddingLeft: "16px",
                      paddingRight: "16px",
                      color: "#725095",
                    }}
                  />
                </div>
                <div className="home__to-follow-user">
                  <div className="home__to-follow-user-detail">
                    <span className="home__to-follow-user-thumbnail">
                      <img
                        className="home__to-follow-user-image"
                        src="https://static.scientificamerican.com/sciam/cache/file/7A715AD8-449D-4B5A-ABA2C5D92D9B5A21_source.png"
                        alt="user"
                      />
                    </span>
                    <p className="home__to-follow-user-name">Sifat Dipta</p>
                  </div>
                  <Button
                    text="Follow"
                    type="primary"
                    style={{
                      backgroundColor: "white",
                      paddingLeft: "16px",
                      paddingRight: "16px",
                      color: "#725095",
                    }}
                  />
                </div>
                <div className="home__to-follow-user">
                  <div className="home__to-follow-user-detail">
                    <span className="home__to-follow-user-thumbnail">
                      <img
                        className="home__to-follow-user-image"
                        src="https://static.scientificamerican.com/sciam/cache/file/7A715AD8-449D-4B5A-ABA2C5D92D9B5A21_source.png"
                        alt="user"
                      />
                    </span>
                    <p className="home__to-follow-user-name">Sifat Dipta</p>
                  </div>
                  <Button
                    text="Follow"
                    type="primary"
                    style={{
                      backgroundColor: "white",
                      paddingLeft: "16px",
                      paddingRight: "16px",
                      color: "#725095",
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="home__posts">
              {posts
                ? posts.map((post) => {
                    return (
                      <Post
                        data={post}
                        users={users}
                        toast={toast}
                        getPosts={getPosts}
                        authUser={authUser}
                        key={uuidv4()}
                      />
                    );
                  })
                : ""}
            </div>
          </div>
          <div className="home__to-follow">
            <h3 className="home__to-follow-title">Who to follow</h3>
            <div className="home__to-follow-users">
              <div className="home__to-follow-user">
                <div className="home__to-follow-user-detail">
                  <span className="home__to-follow-user-thumbnail">
                    <img
                      className="home__to-follow-user-image"
                      src="https://static.scientificamerican.com/sciam/cache/file/7A715AD8-449D-4B5A-ABA2C5D92D9B5A21_source.png"
                      alt="user"
                    />
                  </span>
                  <p className="home__to-follow-user-name">Sifat Dipta</p>
                </div>
                <Button
                  text="Follow"
                  type="primary"
                  style={{
                    backgroundColor: "white",
                    paddingLeft: "16px",
                    paddingRight: "16px",
                    color: "#725095",
                  }}
                />
              </div>
              <div className="home__to-follow-user">
                <div className="home__to-follow-user-detail">
                  <span className="home__to-follow-user-thumbnail">
                    <img
                      className="home__to-follow-user-image"
                      src="https://static.scientificamerican.com/sciam/cache/file/7A715AD8-449D-4B5A-ABA2C5D92D9B5A21_source.png"
                      alt="user"
                    />
                  </span>
                  <p className="home__to-follow-user-name">Sifat Dipta</p>
                </div>
                <Button
                  text="Follow"
                  type="primary"
                  style={{
                    backgroundColor: "white",
                    paddingLeft: "16px",
                    paddingRight: "16px",
                    color: "#725095",
                  }}
                />
              </div>
              <div className="home__to-follow-user">
                <div className="home__to-follow-user-detail">
                  <span className="home__to-follow-user-thumbnail">
                    <img
                      className="home__to-follow-user-image"
                      src="https://static.scientificamerican.com/sciam/cache/file/7A715AD8-449D-4B5A-ABA2C5D92D9B5A21_source.png"
                      alt="user"
                    />
                  </span>
                  <p className="home__to-follow-user-name">Sifat Dipta</p>
                </div>
                <Button
                  text="Follow"
                  type="primary"
                  style={{
                    backgroundColor: "white",
                    paddingLeft: "16px",
                    paddingRight: "16px",
                    color: "#725095",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </PageContent>
      <ToastContainer />
    </section>
  );
};

export default Home;
