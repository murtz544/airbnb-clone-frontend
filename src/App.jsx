import { useEffect, useState } from 'react'
import './App.css'
import { useDispatch } from 'react-redux';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import AllSpots from './componenets/AllSpots/AllSpots.jsx';
import Home from './componenets/Home/Home.jsx';

function Layout() {
  const dispatch = useDispatch();
  const [isUserRestored, setIsUserRestored] = useState(false);

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => {
      setIsUserRestored(true)
    });
  }, [dispatch]);

  return (
    <>
      <Home isUserRestored={isUserRestored} />
    </>
  );
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <AllSpots />
      },
      // {
      //   path: `/spots/:spotId`,
      //   element: <SpotDetails />
      // }, 
      // {
      //   path: '/spots/new',
      //   element: <NewSpot />
      // }, 
      // {
      //   path: '/spots/current',
      //   element: <ManageSpots />
      // }, 
      // {
      //   path: '/spots/:spotId/edit',
      //   element: <UpdateSpot />
      // }
    ]
  }
]);

function App() {
  return <RouterProvider router={router}></RouterProvider>;
}

export default App;
