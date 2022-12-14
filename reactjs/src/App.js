// routes
import Router from './routes';
// theme
import ThemeConfig from './theme';
import GlobalStyles from './theme/globalStyles';
// components
import ScrollToTop from './components/ScrollToTop';
import NotistackProvider from './components/NotistackProvider';
import MotionLazyContainer from './components/animate/MotionLazyContainer';
import { BaseOptionChartStyle } from './components/charts/BaseOptionChart';

// ----------------------------------------------------------------------

export default function App() {
  return (
    <ThemeConfig>
      <NotistackProvider>
        <MotionLazyContainer>
          <ScrollToTop />
          <GlobalStyles />
          <BaseOptionChartStyle />
          <Router />
        </MotionLazyContainer>
      </NotistackProvider>
    </ThemeConfig>
  );
}
