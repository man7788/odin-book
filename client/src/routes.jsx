import App from './App';
import Login from './components/Login';
import Home from './components/home/home';
import Profile from './components/profile/Profile';

import ErrorPage from './ErrorPage';

const routes = [
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Home /> },
      { path: ':profileId', element: <Profile /> },
    ],
  },
  {
    path: 'login',
    element: <Login />,
    errorElement: <ErrorPage />,
  },
];

export default routes;
