import { RouterProvider } from 'react-router-dom';
import router from './routes';
import VideoContextProvider from './hooks/useVideoContext';

const App = () => {
  return (
    <VideoContextProvider>
      <RouterProvider router={router} />
    </VideoContextProvider>
  );
};

export default App;
