import Header from "./components/Header/Header";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Profile from "./pages/Profile/Profile";
import Register from "./pages/Register/Register";
import Login from "./pages/Login/Login";
import { RequireAuth, AuthProvider } from "react-auth-kit";
import ConfirmEmail from "./pages/ConfirmEmail/ConfirmEmail";
import Home from "./pages/Home/Home";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
import NewChallenge from "./pages/NewChallenge/NewChallenge";
import Competition from "./pages/Competition/Competition";
import NotFound from "./pages/NotFound/NotFound";
import Settings from "./pages/Settings/Settings";
import AcceptCompetition from "./pages/AcceptCompetition/AcceptCompetition";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import Competitions from "./pages/Competitions/Competitions";
import Teams from "./pages/Teams/Teams";
import Search from "./pages/Search/Search";
import Admin from "./pages/Admin/Admin";
import MyProgress from "./pages/Progress/Progress";

function App() {
  const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

  const categories = [
    {
      name: "Fitness",
      sub_categories: [
        {
          name: "Excercise",
          measurements: [
            {
              m_id: 0,
              name: "Burn Calories",
              calculate_by: ["Sum"],
              visible_to: 1,
              percentage_input_field: "",
              submission_field_text: "calories burned",
              measurement_direction: "up",
              apis_endpoints: {
                fitbit: "",
                apple_fitness: "",
              },
              number_validation: 4,
            },
            {
              m_id: 1,
              name: "Excercise More",
              calculate_by: ["Sum"],
              visible_to: 1,
              percentage_input_field: "",
              submission_field_text: "hours exercised",
              measurement_direction: "up",
              apis_endpoints: {
                fitbit: "",
                apple_fitness: "",
              },
              number_validation: 4,
            },
          ],
        },
        {
          name: "Weight",
          measurements: [
            {
              m_id: 0,
              name: "Lose Weight",
              calculate_by: ["Last Number", "Percentage"],
              visible_to: 1,
              percentage_input_field: "current weight",
              submission_field_text: "current weight",
              measurement_direction: "down",
              apis_endpoints: {
                fitbit: "/body/log/weight/date/2022-05-05.json",
                apple_fitness: "",
              },
              number_validation: 3,
            },
            {
              m_id: 1,
              name: "Gain Weight",
              calculate_by: ["Last Number", "Percentage"],
              visible_to: 1,
              percentage_input_field: "current weight",
              submission_field_text: "current weight",
              measurement_direction: "up",
              apis_endpoints: {
                fitbit: "/body/log/weight/date/2022-05-05.json",
                apple_fitness: "",
              },
              number_validation: 3,
            },
            {
              m_id: 2,
              name: "Lose Body Fat %",
              calculate_by: ["Last Number", "Percentage"],
              visible_to: 1,
              percentage_input_field: "current body fat %",
              submission_field_text: "current body fat %",
              measurement_direction: "down",
              apis_endpoints: {
                fitbit: "/body/log/weight/date/2022-05-05.json",
                apple_fitness: "",
              },
              number_validation: 2,
            },
            {
              m_id: 3,
              name: "Gain Body Fat %",
              calculate_by: ["Last Number", "Percentage"],
              visible_to: 1,
              percentage_input_field: "current body fat %",
              submission_field_text: "current body fat %",
              measurement_direction: "up",
              apis_endpoints: {
                fitbit: "/body/log/weight/date/2022-05-05.json",
                apple_fitness: "",
              },
              number_validation: 2,
            },
          ],
        },
        {
          name: "Mental",
          measurements: [
            {
              m_id: 0,
              name: "Sleep More",
              calculate_by: ["Average"],
              visible_to: 1,
              percentage_input_field: "",
              submission_field_text: "hours slept",
              measurement_direction: "up",
              apis_endpoints: {
                fitbit: "",
                apple_fitness: "",
              },
              number_validation: 2,
            },
            {
              m_id: 1,
              name: "Meditate",
              calculate_by: ["Average"],
              visible_to: 1,
              percentage_input_field: "",
              submission_field_text: "minutes meditated",
              measurement_direction: "up",
              apis_endpoints: {
                fitbit: "",
                apple_fitness: "",
              },
              number_validation: 3,
            },
          ],
        },
        {
          name: "Physique",
          measurements: [
            {
              m_id: 0,
              name: "Increase Biceps Size",
              calculate_by: ["Last Number"],
              visible_to: 0,
              percentage_input_field: "",
              submission_field_text: "biceps size",
              measurement_direction: "up",
              apis_endpoints: {
                fitbit: "",
                apple_fitness: "",
              },
              number_validation: 2,
            },
            {
              m_id: 1,
              name: "Gain Chest Size",
              calculate_by: ["Last Number"],
              visible_to: 0,
              percentage_input_field: "",
              submission_field_text: "chest size",
              measurement_direction: "up",
              apis_endpoints: {
                fitbit: "",
                apple_fitness: "",
              },
              number_validation: 2,
            },
            {
              m_id: 2,
              name: "Reduce Chest Size",
              calculate_by: ["Last Number"],
              visible_to: 0,
              percentage_input_field: "",
              submission_field_text: "chest size",
              measurement_direction: "down",
              apis_endpoints: {
                fitbit: "",
                apple_fitness: "",
              },
              number_validation: 2,
            },
            {
              m_id: 3,
              name: "Increase Weist Size",
              calculate_by: ["Last Number"],
              visible_to: 0,
              percentage_input_field: "",
              submission_field_text: "weist size",
              measurement_direction: "up",
              apis_endpoints: {
                fitbit: "",
                apple_fitness: "",
              },
              number_validation: 2,
            },
            {
              m_id: 3,
              name: "Reduce Weist Size",
              calculate_by: ["Last Number"],
              visible_to: 0,
              percentage_input_field: "",
              submission_field_text: "weist size",
              measurement_direction: "down",
              apis_endpoints: {
                fitbit: "",
                apple_fitness: "",
              },
              number_validation: 2,
            },
          ],
        },
      ],
    },
    {
      name: "Finance",
      sub_categories: [
        {
          name: "Financial Habits",
          measurements: [
            {
              m_id: 0,
              name: "Save Money",
              calculate_by: ["Last Number", "Percentage"],
              visible_to: 1,
              percentage_input_field: "your income",
              submission_field_text: "current savings balance",
              measurement_direction: "up",
              apis_endpoints: {
                fitbit: "",
                apple_fitness: "",
              },
              number_validation: 7,
            },
            {
              m_id: 1,
              name: "Reduce Amount Spent",
              calculate_by: ["Percentage"],
              visible_to: 0,
              percentage_input_field: "your income",
              submission_field_text: "amount spent today",
              measurement_direction: "down",
              apis_endpoints: {
                fitbit: "",
                apple_fitness: "",
              },
              number_validation: 7,
            },
          ],
        },
        {
          name: "Debt",
          measurements: [
            {
              m_id: 0,
              name: "Reduce Debt",
              calculate_by: ["Last Number", "Percentage"],
              visible_to: 1,
              percentage_input_field: "current debt",
              submission_field_text: "current debt",
              measurement_direction: "down",
              apis_endpoints: {
                fitbit: "",
                apple_fitness: "",
              },
              number_validation: 7,
            },
          ],
        },
        {
          name: "Charity",
          measurements: [
            {
              m_id: 0,
              name: "Make Donation",
              calculate_by: ["Sum", "Percentage"],
              visible_to: 1,
              percentage_input_field: "your income",
              submission_field_text: "amount donated",
              measurement_direction: "up",
              apis_endpoints: {
                fitbit: "",
                apple_fitness: "",
              },
              number_validation: 7,
            },
          ],
        },
        {
          name: "Stocks",
          measurements: [
            {
              m_id: 0,
              name: "Increase Stocks Profit",
              calculate_by: ["Sum", "Percentage"],
              visible_to: 1,
              percentage_input_field: "current value",
              submission_field_text: "profit",
              measurement_direction: "up",
              apis_endpoints: {
                fitbit: "",
                apple_fitness: "",
              },
              number_validation: 7,
            },
            {
              m_id: 1,
              name: "Increase Number of Shares",
              calculate_by: ["Last Number"],
              visible_to: 1,
              percentage_input_field: "",
              submission_field_text: "number of shares",
              measurement_direction: "up",
              apis_endpoints: {
                fitbit: "",
                apple_fitness: "",
              },
              number_validation: 5,
            },
          ],
        },
      ],
    },
    {
      name: "Habits",
      sub_categories: [
        {
          name: "Reduce Bad Habits",
          measurements: [
            {
              m_id: 0,
              name: "Reduce Smoking",
              calculate_by: ["Sum", "Average"],
              visible_to: 1,
              percentage_input_field: "",
              submission_field_text: "quantity smoked",
              measurement_direction: "down",
              apis_endpoints: {
                fitbit: "",
                apple_fitness: "",
              },
              number_validation: 3,
            },
            {
              m_id: 1,
              name: "Reduce Alcohol Consumption",
              calculate_by: ["Sum"],
              visible_to: 0,
              percentage_input_field: "",
              submission_field_text: "Alcoholic Drinks Consumed",
              measurement_direction: "down",
              apis_endpoints: {
                fitbit: "",
                apple_fitness: "",
              },
              number_validation: 3,
            },
            {
              m_id: 2,
              name: "Reduce Coffee Intake",
              calculate_by: ["Sum", "Average"],
              visible_to: 0,
              percentage_input_field: "",
              submission_field_text: "coffee drinks consumed",
              measurement_direction: "down",
              apis_endpoints: {
                fitbit: "",
                apple_fitness: "",
              },
              number_validation: 3,
            },
            {
              m_id: 3,
              name: "Reduce Phone Use",
              calculate_by: ["Sum", "Average"],
              visible_to: 0,
              percentage_input_field: "",
              submission_field_text: "hours used",
              measurement_direction: "down",
              apis_endpoints: {
                fitbit: "",
                apple_fitness: "",
              },
              number_validation: 4,
            },
          ],
        },
        {
          name: "Create Good Habits",
          measurements: [
            {
              m_id: 0,
              name: "Read More",
              calculate_by: ["Sum", "Average"],
              visible_to: 1,
              percentage_input_field: "",
              submission_field_text: "number of books read",
              measurement_direction: "up",
              apis_endpoints: {
                fitbit: "",
                apple_fitness: "",
              },
              number_validation: 3,
            },
          ],
        },
      ],
    },
    {
      name: "Learning/Education",
      sub_categories: [
        {
          name: "Books",
          measurements: [
            {
              m_id: 0,
              name: "Read More",
              calculate_by: ["Sum", "Average"],
              visible_to: 1,
              percentage_input_field: "",
              submission_field_text: "hours read",
              measurement_direction: "up",
              apis_endpoints: {
                fitbit: "",
                apple_fitness: "",
              },
              number_validation: 4,
            },
          ],
        },
      ],
    },
  ];

  const types = ["You vs You", "Me vs You", "Us vs Them", "All 4 One"];

  return (
    <div className="App">
      <AuthProvider authType={"localstorage"} authName={"_auth"}>
        <BrowserRouter>
          <Header />
          <Routes>
            <Route path="*" element={<NotFound />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/confirm" element={<ConfirmEmail />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route
              path="/join/:code"
              element={
                <Elements stripe={stripePromise}>
                  <AcceptCompetition />
                </Elements>
              }
            ></Route>
            <Route
              path="/competitions"
              element={<Competitions categories={categories} types={types} />}
            />
            <Route path="/search/:query" element={<Search />} />
            <Route path="/progress" element={<MyProgress />} />
            <Route
              path="/profile"
              element={
                <RequireAuth loginPath={"/login"}>
                  <Profile categories={categories} types={types} />
                </RequireAuth>
              }
            ></Route>
            <Route
              path="/settings"
              element={
                <RequireAuth loginPath={"/login"}>
                  <Settings />
                </RequireAuth>
              }
            ></Route>
            <Route
              path="/new-competition"
              element={
                <RequireAuth loginPath={"/login"}>
                  <NewChallenge categories={categories} types={types} />
                </RequireAuth>
              }
            ></Route>
            <Route
              path="/competition/:compId"
              element={
                <RequireAuth loginPath={"/login"}>
                  <Competition categories={categories} types={types} />
                </RequireAuth>
              }
            ></Route>
            <Route
              path="/teams"
              element={
                <RequireAuth loginPath={"/login"}>
                  <Teams />
                </RequireAuth>
              }
            ></Route>
            <Route
              path="/admin"
              element={
                <RequireAuth loginPath={"/login"}>
                  <Admin categories={categories} types={types} />
                </RequireAuth>
              }
            ></Route>
            <Route
              path="/"
              element={
                <RequireAuth loginPath={"/login"}>
                  <Home />
                </RequireAuth>
              }
            ></Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
}

export default App;
