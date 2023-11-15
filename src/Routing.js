import React, { Suspense, lazy } from 'react';
import { Route, useNavigate, Routes } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Layout } from 'antd';
import Loader from './shared/loader';

const Sidebar = lazy(() => import('./shared/sidebar'));
const Login = lazy(() => import('./components/Login/login'));
const Restaurant = lazy(() => import('./components/Restaurant/restaurant'));
const Register = lazy(() => import('./components/Register/register'));
const ForgotPassword = lazy(() => import('./components/ForgotPassword/forgotPassword'));
const ChangePassword = lazy(() => import('./components/changePassword/changePassword'));
const RestaurantListing = lazy(() =>
  import('./components/RestaurantListing/P_RestaurantListingPage')
);
const MenuPage = lazy(() => import('./components/MenuListing/P_MenulistingPage'));
const ReservationListing = lazy(() => import('./components/ReservationListing/reservationListing'));
const { Content } = Layout;

const Routing = () => {
  const { isAuthenticated, user } = useSelector(state => state.auth);
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
      path: '/forgot-password',
      component: <ForgotPassword />,
    },
    {
      path: '/change-password/:id/:token',
      component: <ChangePassword />,
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
  ].filter(cur => cur && cur.type === user.type);

  const PrivateRoute = ({ children }) => {
    if (!isAuthenticated) navigate('/login', { replace: true });
    return isAuthenticated ? children : <Login />;
  };

  const PublicRoute = ({ children }) => {
    if (isAuthenticated)
      user.type === '1'
        ? navigate('/restaurantListing', { replace: true })
        : navigate('/reservationListing', { replace: true });
    return isAuthenticated ? <Restaurant /> : children;
  };

  return (
    <Suspense className="loader" fallback={<Loader />}>
      <Layout style={{ minHeight: '100vh', display: 'flex' }}>
        {console.log(isAuthenticated)}
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
        </Routes>
      </Layout>
    </Suspense>
  );
};

export default Routing;
