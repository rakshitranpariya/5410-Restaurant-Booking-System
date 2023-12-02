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
  const accessToken = localStorage.getItem('accessToken');
  const userType = localStorage.getItem('userType');
  useEffect(() => {
    (async () => {
        if(userType == 1) {
          Kommunicate.init('2b5873eace4273972e5d3ddbf604693f5', {
            automaticChatOpenOnNavigation: true,
            popupWidget: true,
          });
      } else if(userType == 2){
        Kommunicate.init('1c1da9623227878fe3f8ef384f2199ac6', {
          automaticChatOpenOnNavigation: true,
          popupWidget: true,
        });
      }
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
