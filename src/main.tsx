import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import { TestnetPreview } from './components/TestnetPreview.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TestnetPreview />
  </StrictMode>,
);
