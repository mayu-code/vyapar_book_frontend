import { isMobile, isTablet, isDesktop } from 'react-device-detect';

export const getDeviceType = () => {
  if (isMobile || isTablet) return 'MOBILE';
  if (isDesktop) return 'WEB';
  return 'UNKNOWN';
};
