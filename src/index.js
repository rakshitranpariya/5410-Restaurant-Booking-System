import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import Kommunicate from '@kommunicate/kommunicate-chatbot-plugin';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

//adding google fonts.
const head = document.head || document.getElementsByTagName('head')[0];
const link = document.createElement('link');
link.rel = 'stylesheet';
link.href = 'https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;700&display=swap';
head.appendChild(link);
Kommunicate.init('2b6c021219d0e7ce14f57aba4bcc1cca6', {
  automaticChatOpenOnNavigation: true,
  popupWidget: true,
});

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
