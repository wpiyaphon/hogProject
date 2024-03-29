// @mui
import { Stack, Box } from '@mui/material';
// config
import { NAV } from '../../../config';
// utils
import { hideScrollbarX } from '../../../utils/cssStyles';
// components
import Logo from '../../../components/logo';
import { NavSectionMini } from '../../../components/nav-section';
// auth
import { useAuthContext } from '../../../auth/useAuthContext';
//
import {EPNavConfig, EANavConfig, OANavConfig} from './config';

// ----------------------------------------------------------------------

export default function NavMini() {
  const { user } = useAuthContext();

  function getNavConfig(err) {
    if (user.role === "Education Planner") {
      return EPNavConfig
    }

    if (user.role === "Education Admin") {
      return EANavConfig
    } 
    
    if (user.role === "Office Admin") {
      return OANavConfig
    }

    return err;
  }

  const navConfig = getNavConfig();
  
  return (
    <Box
      component="nav"
      sx={{
        flexShrink: { lg: 0 },
        width: { lg: NAV.W_DASHBOARD_MINI },
      }}
    >
      <Stack
        sx={{
          pb: 2,
          height: 1,
          position: 'fixed',
          width: NAV.W_DASHBOARD_MINI,
          borderRight: (theme) => `dashed 1px ${theme.palette.divider}`,
          ...hideScrollbarX,
        }}
      >
        <Logo sx={{ mx: 'auto', my: 2 }} />

        <NavSectionMini data={navConfig} />
      </Stack>
    </Box>
  );
}
