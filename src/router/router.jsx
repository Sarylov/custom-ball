import { createBrowserRouter } from 'react-router-dom';
import { Whiteball } from '../pages/white-ball';
import { Success } from '../pages/success';

import { Root } from './root';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      {
        index: true,
        element: <Whiteball />,
      },
      {
        path: 'whiteball',
        element: <Whiteball />,
      },
      {
        path: 'success',
        element: <Success />,
      },
    ],
  },
]);
