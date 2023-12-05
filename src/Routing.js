import React, { Suspense, lazy } from 'react';
import { Route, useNavigate, Routes } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Layout } from 'antd';
import Loader from './shared/loader';

const Dashboard = lazy(() => import('./components/Dashboard/dashboard'));
const TopCustomer = lazy(() => import('./components/admin/TopCustomer'));
const Sidebar = lazy(() => import('./shared/sidebar'));
const Login = lazy(() => import('./components/Login/login'));
const Restaurant = lazy(() => import('./components/Restaurant/restaurant'));
const Register = lazy(() => import('./components/Register/register'));
const RestaurantListing = lazy(() =>
  import('./components/RestaurantListing/P_RestaurantListingPage')
);
const MenuPage = lazy(() => import('./components/MenuListing/P_MenulistingPage'));
const ReservationListing = lazy(() => import('./components/ReservationListing/reservationListing'));
const MenuItemComponent = lazy(() => import('./components/MenuListingAdmin/menuListingAdmin'));
const RestaurantTablesPage = lazy(() => import('./components/TableListingAdmin/TableListingPage'));
const NewMenuEntry = lazy(() => import('./components/addNewMenuPage/addNewMenu'));
const RestaurantTableForm = lazy(() => import('./components/addNewTablePage/addNewTable'));

const PageNotFound = lazy(() => import('./shared/404'));
const AdminLogin = lazy(() => import('./components/AdminLogin/adminLogin'));
const AdminDashboard = lazy(() => import('./components/AdminDashboard/adminDashboard'));
const OfferPage = lazy(() => import('./components/OfferListingAdmin/OfferPage'));
const NewOfferEntry = lazy(() => import('./components/addNewOfferPage/NewOfferEntry'));

const NewRestaurantListing = lazy(() =>
  import('./components/addNewRestaurantPage/addNewRestaurant')
);

const { Content } = Layout;

const Routing = () => {
  const { isAuthenticated, user } = useSelector(state => state.auth);
  // console.log("user",user)
  const navigate = useNavigate();
  const PublicRoutes = [
    {
      path: '/',
      component: <Login />,
    },
    {
      path: '/login',
      component: <Login />,
    },
    {
      path: '/register',
      component: <Register />,
    },
    {
      path: '/adminLogin',
      component: <AdminLogin />,
    },
  ].filter(cur => cur);

  const PrivateRoutes = [
    {
      path: '/restaurantListing',
      component: <RestaurantListing />,
      type: '1',
    },
    {
      path: '/menu/:restaurantId',
      component: <MenuPage />,
      type: '1',
    },
    {
      path: '/restaurants',
      component: <Restaurant />,
      type: '1',
    },
    {
      path: '/reservationListing',
      component: <ReservationListing />,
      type: '2',
    },
    {
      path: '/addRestaurantDetails',
      component: <NewRestaurantListing />,
      type: '2',
    },
    {
      path: '/dashboard',
      component: <Dashboard />,
      type: '2',
    },
    {
      path: '/adminView',
      component: <TopCustomer />,
      type: '3',
    },
    {
      path: '/addMenuDetails',
      component: <NewMenuEntry />,
      type: '2',
    },
    {
      path: '/addTableDetails',
      component: <RestaurantTableForm />,
      type: '2',
    },
    {
      path: '/menuListingADMIN',
      component: <MenuItemComponent />,
      type: '2',
    },
    {
      path: '/tableListingAdmin',
      component: <RestaurantTablesPage />,
      type: '2',
    },
    {
      path: '/offerListingAdmin',
      component: <OfferPage />,
      type: '2',
    },
    {
      path: '/addOfferDetails',
      component: <NewOfferEntry />,
      type: '2',
    },
    {
      path: '/admin/dashboard',
      component: <AdminDashboard />,
      type: '3',
    },
  ].filter(cur => cur && String(cur.type) == String(user.type));

  const PrivateRoute = ({ children }) => {
    if (!isAuthenticated) navigate('/login', { replace: true });
    return isAuthenticated ? children : <Login />;
  };

  const PublicRoute = ({ children }) => {
    if (isAuthenticated)
      user.type.toString() === '1'
        ? navigate('/restaurantListing', { replace: true })
        : navigate('/reservationListing', { replace: true });
    return isAuthenticated ? user.type.toString() === '1' ? <Restaurant /> : <ReservationListing /> : children;
  };

  return (
    <Suspense className="loader" fallback={<Loader />}>
      <Layout style={{ minHeight: '100vh', display: 'flex' }}>
        {isAuthenticated && <Sidebar style={{ backgroundColor: '#f0f0f0' }} />}
        <Routes>
          {PublicRoutes.map(route => (
            <Route
              exact={route.exact}
              key={route.path}
              path={route.path}
              element={<PublicRoute>{route.component}</PublicRoute>}
            />
          ))}
          {PrivateRoutes.map(route => (
            <Route
              exact={route.exact}
              key={route.path}
              path={route.path}
              element={<PrivateRoute>{route.component}</PrivateRoute>}
            />
          ))}
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </Layout>
    </Suspense>
  );
};

export default Routing;
