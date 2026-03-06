import { createBrowserRouter } from 'react-router-dom';
import { SwapPage } from '../pages/SwapPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <SwapPage />,
  },
]);
