import { CurrencySwap } from '../components/CurrencySwap/CurrencySwap';
import './SwapPage.css';

export const SwapPage = () => {
  return (
    <div className="swap-page-container">
      <div className="brand-header">
        <h1 className="title">Fancy Swap</h1>
        <p className="subtitle">Seamlessly swap your crypto assets at the best market rates with complete transparency.</p>
      </div>
      <CurrencySwap />
    </div>
  );
};
