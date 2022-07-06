import "./Competitions.scss";
import { useState, useEffect } from "react";
import Select from "react-select";
import Bike from "../../assets/images/types/bike.svg";
import Button from "../../components/Button/Button";
import { Link } from "react-router-dom";
import axios from "axios";
import { useAuthUser } from "react-auth-kit";
import Modal from "react-modal";
import Form from "react-bootstrap/Form";
import Input from "../../components/Input/Input";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Competitions = ({ categories, types }) => {
  const [latestCompetitions, setLatestCompetitions] = useState(null);
  const [pastCompetitions, setPastCompetitions] = useState(null);
  const [userCompetitions, setUserCompetitions] = useState(null);
  const [data, setData] = useState({
    latest: null,
    past: null,
  });
  const [userBase, setUserBase] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);

  const authUser = useAuthUser();

  const [typeOptions, setTypeOptions] = useState([
    { value: -1, label: "All Types" },
  ]);
  const [categoryOptions, setCategoryOptions] = useState([
    { value: -1, label: "All Categories" },
  ]);
  const [subCategoryOptions, setSubCategoryOptions] = useState([
    { value: -1, label: "All Sub Categories" },
  ]);

  const [selectedType, setSelectedType] = useState(typeOptions[0]);
  const [selectedCategory, setSelectedCategory] = useState(categoryOptions[0]);
  const [selectedSubCategory, setSelectedSubCategory] = useState(
    subCategoryOptions[0]
  );

  const customStylesModal = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      minWidth: "500px",
    },
  };

  useEffect(() => {
    let typeObj = [];
    typeObj.push(typeOptions[0]);
    types.forEach((type, i) => {
      typeObj.push({ value: i, label: type });
    });
    setTypeOptions(typeObj);

    let categoryObj = [];
    categoryObj.push(categoryOptions[0]);
    categories.forEach((category, i) => {
      categoryObj.push({ value: i, label: category.name });
    });
    setCategoryOptions(categoryObj);

    let subCategoryObj = [];
    subCategoryObj.push(subCategoryOptions[0]);
    categories[0].sub_categories.forEach((sub_category, i) => {
      subCategoryObj.push({ value: i, label: sub_category.name });
    });
    setSubCategoryOptions(subCategoryObj);
  }, []);

  const customStyles = {
    option: (provided, state) => ({
      ...provided,
      color: state.isSelected ? "#725095" : "#725095",
      background: state.isSelected ? "#F0EFFF" : "white",
      ":hover": {
        background: "#F0EFFF",
      },
    }),
  };

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/challenges/latest`)
      .then((res) => {
        setLatestCompetitions(res.data);
        return axios.get(`${process.env.REACT_APP_API_URL}/challenges/past`);
      })
      .then((res) => {
        setPastCompetitions(res.data);
        return axios.get(
          `${process.env.REACT_APP_API_URL}/challenges/user/${
            authUser().user_id
          }`
        );
      })
      .then((res) => {
        setUserCompetitions(res.data);
      })
      .catch((err) => console.err(err));
  }, []);

  useEffect(() => {
    if (userCompetitions && latestCompetitions && pastCompetitions) {
      if (userBase === 0) {
        setData({
          latest: userCompetitions
            .filter((comp) => comp.status === true)
            .filter((comp) =>
              selectedType.value === -1
                ? comp.status === true
                : comp.type === selectedType.value
            )
            .filter((comp) =>
              selectedCategory.value === -1
                ? comp.status === true
                : comp.category === selectedCategory.value
            )
            .filter((comp) =>
              selectedSubCategory.value === -1
                ? comp.status === true
                : comp.sub_category === selectedSubCategory.value
            ),
          past: userCompetitions
            .filter((comp) => comp.status === false)
            .filter((comp) =>
              selectedType.value === -1
                ? comp.status === false
                : comp.type === selectedType.value
            )
            .filter((comp) =>
              selectedCategory.value === -1
                ? comp.status === false
                : comp.category === selectedCategory.value
            )
            .filter((comp) =>
              selectedSubCategory.value === -1
                ? comp.status === false
                : comp.sub_category === selectedSubCategory.value
            ),
        });
      } else {
        setData({
          latest: latestCompetitions
            .filter((comp) => comp.status === true)
            .filter((comp) =>
              selectedType.value === -1
                ? comp.status === true
                : comp.type === selectedType.value
            )
            .filter((comp) =>
              selectedCategory.value === -1
                ? comp.status === true
                : comp.category === selectedCategory.value
            )
            .filter((comp) =>
              selectedSubCategory.value === -1
                ? comp.status === true
                : comp.sub_category === selectedSubCategory.value
            ),
          past: pastCompetitions
            .filter((comp) => comp.status === false)
            .filter((comp) =>
              selectedType.value === -1
                ? comp.status === false
                : comp.type === selectedType.value
            )
            .filter((comp) =>
              selectedCategory.value === -1
                ? comp.status === false
                : comp.category === selectedCategory.value
            )
            .filter((comp) =>
              selectedSubCategory.value === -1
                ? comp.status === false
                : comp.sub_category === selectedSubCategory.value
            ),
        });
      }
    }
  }, [
    userBase,
    latestCompetitions,
    pastCompetitions,
    userCompetitions,
    selectedType,
    selectedCategory,
    selectedSubCategory,
  ]);

  return (
    <section className="competitions">
      <div className="competitions__wrapper">
        <div className="competitions__header">
          <div className="competitions__switch">
            <span
              className={
                userBase === 0
                  ? "competitions__switch-value competitions__switch-value--active"
                  : "competitions__switch-value"
              }
              onClick={() => setUserBase(0)}
            >
              My Competitions
            </span>
            <span
              className={
                userBase === 1
                  ? "competitions__switch-value competitions__switch-value--active"
                  : "competitions__switch-value"
              }
              onClick={() => setUserBase(1)}
            >
              All Competitions
            </span>
          </div>
          <Link to="/new-competition">
            <Button
              className="competitions__header-button"
              text="New Competition"
              type="primary"
            />
          </Link>
        </div>
        <div className="competitions__filter">
          <Select
            options={typeOptions}
            styles={customStyles}
            placeholder="Select Type"
            value={selectedType}
            onChange={(e) => setSelectedType(e)}
          />
          <Select
            options={categoryOptions}
            styles={customStyles}
            placeholder="Select Category"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e)}
          />
          <Select
            options={subCategoryOptions}
            styles={customStyles}
            placeholder="Select Sub Category"
            value={selectedSubCategory}
            onChange={(e) => setSelectedSubCategory(e)}
          />
        </div>
        <div className="competitions__latest">
          <h2>Latest Competitions</h2>
          <div className="competitions__competitions">
            {data.latest
              ? data.latest.map((comp) => {
                  return (
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <Link to={`/competition/${comp._id}`}>
                        <div className="competitions__competition">
                          <div className="competitions__competition-main">
                            <div className="competitions__competition-info">
                              <p className="competitions__competition-category">
                                {categories[comp.category].name}
                              </p>
                              <p className="competitions__competition-pot">
                                ${comp.participants.length * comp.wager}
                              </p>
                            </div>
                            <img
                              className="competitions__competition-image"
                              src={Bike}
                              alt="bike"
                            />
                          </div>
                          <p className="competitions__competition-name">
                            {comp.name}
                          </p>
                        </div>
                      </Link>
                      <div
                        className="will_they_win"
                        onClick={() => setModalOpen(true)}
                      >
                        Will they win?
                      </div>
                    </div>
                  );
                })
              : ""}
          </div>
        </div>
        <div className="competitions__latest">
          <h2>Past Competitions</h2>
          <div className="competitions__competitions">
            {data.past
              ? data.past.map((comp) => {
                  return (
                    <Link to={`/competition/${comp._id}`}>
                      <div className="competitions__competition">
                        <div className="competitions__competition-main competitions__competition-main--inactive">
                          <div className="competitions__competition-info">
                            <p className="competitions__competition-category">
                              {categories[comp.category].name}
                            </p>
                            <p className="competitions__competition-pot">
                              ${comp.participants.length * comp.wager}
                            </p>
                          </div>
                          <img
                            className="competitions__competition-image"
                            src={Bike}
                            alt="bike"
                          />
                        </div>
                        <p className="competitions__competition-name">
                          {comp.name}
                        </p>
                      </div>
                    </Link>
                  );
                })
              : ""}
          </div>
        </div>
      </div>
      <Modal
        isOpen={modalOpen}
        onRequestClose={() => setModalOpen(false)}
        style={customStylesModal}
        contentLabel="Place Bet"
      >
        <div className="add-member__modal">
          <h2>Place A Bet</h2>
          <Form>
            <Form.Check
              type="switch"
              id="custom-switch"
              label="Will They Win?"
            />
          </Form>
          <Input placeholder="Wager ($ USD)" type="number" />
          <Button
            text="Place Bet"
            type="primary"
            fn={() => {
              setModalOpen(false);
              toast.success("Bet Placed");
            }}
          />
        </div>
      </Modal>
      <ToastContainer />
    </section>
  );
};

export default Competitions;
