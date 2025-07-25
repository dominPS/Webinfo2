import { useTheme, useMediaQuery } from '@mui/material';

export const useBreakpoint = () => {
    const theme = useTheme();
    
    const isMobile = useMediaQuery('(max-width: 768px)');
    const isTablet = useMediaQuery('(min-width: 769px) and (max-width: 1550px)');
    const isDesktop = useMediaQuery('(min-width: 1551px) and (max-width: 2049px)');
    const isLargeDesktop = useMediaQuery('(min-width: 2050px) and (max-width: 2499px)');
    const isExtraLarge = useMediaQuery('(min-width: 2500px)');
    
    return {
        isMobile,
        isTablet,
        isDesktop,
        isLargeDesktop,
        isExtraLarge,
        currentBreakpoint: isMobile ? 'mobile' : 
                          isTablet ? 'tablet' :
                          isDesktop ? 'desktop' :
                          isLargeDesktop ? 'large' : 'extraLarge'
    };
};