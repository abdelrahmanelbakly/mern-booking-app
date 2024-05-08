import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Layout from "./layouts/Layout";
import Register from "./pages/Register";
import SignIn from "./pages/SignIn";
import AddHotel from "./pages/AddHotel";
import UseAppContext from "./contexts/AppContext";
import MyHotels from "./pages/MyHotels";
const App = () => {
  const { isLoggedIn } = UseAppContext();

  return (
    <Router>
      <Routes>
        <Route
          path='/'
          element={
            <Layout>
              <p>Home Page</p>
            </Layout>
          }
        />
        <Route
          path='/search'
          element={
            <Layout>
              <p>Search Page</p>
            </Layout>
          }
        />
        <Route
          path='Register'
          element={
            <Layout>
              <Register />
            </Layout>
          }
        />
        <Route
          path='sign-in'
          element={
            <Layout>
              <SignIn />
            </Layout>
          }
        />
        {isLoggedIn && (
          <>
            <Route
              path='/add-hotel'
              element={
                <Layout>
                  <AddHotel />
                </Layout>
              }
            />
            <Route
              path='/My-hotels'
              element={
                <Layout>
                  <MyHotels />
                </Layout>
              }
            />
          </>
        )}
        <Route path='*' element={<Navigate to='/' />} />
      </Routes>
    </Router>
  );
};

export default App;
