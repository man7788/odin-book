import App from './App';
import Login from './components/auth/login/Login';
import SignUp from './components/auth/signUp/SignUp';
import Home from './components/home/Home';
import Profile from './components/profile/Profile';
import UsersPage from './components/lists/users/UsersPage';
import RequestsPage from './components/lists/requests/RequestsPage';
import ErrorPage from './ErrorPage';
import GitHubCallback from './components/auth/login/GitHubCallback';

const routes = [
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Home /> },
      { path: ':profileId', element: <Profile /> },
      { path: 'users', element: <UsersPage /> },
      { path: 'requests', element: <RequestsPage /> },
    ],
  },
  {
    path: 'login',
    element: <Login />,
    errorElement: <ErrorPage />,
  },
  {
    path: 'signup',
    element: <SignUp />,
    errorElement: <ErrorPage />,
  },
  {
    path: 'auth/github/callback',
    element: <GitHubCallback />,
    errorElement: <ErrorPage />,
  },
  {
    path: 'error',
    element: <ErrorPage />,
  },
];

export default routes;
