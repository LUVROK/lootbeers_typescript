import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import WalletProviderComponent from './provider/walletProvider';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  // <React.StrictMode>
  <WalletProviderComponent>
    {/* <BrowserRouter> */}
    <App />
    {/* </BrowserRouter> */}
  </WalletProviderComponent>
  // </React.StrictMode>
);

reportWebVitals();