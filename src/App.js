import { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import Routing from './Routing';
import store from './redux/store';
import { loadUser } from './redux/actions/authActions';
import Loader from './shared/loader';
import KommunicateChat from './shared/chat'
import Kommunicate from '@kommunicate/kommunicate-chatbot-plugin';

const App = () => {
  const [isLoaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      Kommunicate.init('2b6c021219d0e7ce14f57aba4bcc1cca6', {
        automaticChatOpenOnNavigation: true,
        popupWidget: true,
      });
      console.log('yoo');
      await store.dispatch(loadUser());
      setLoaded(true);
    })();
  }, []);

  if (!isLoaded) return <Loader />;

  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routing />
        
      </BrowserRouter>
      <KommunicateChat/>
    </Provider>
  );
};

export default App;
