import { Helmet } from 'react-helmet-async';
// @mui
import { Box, Card, Container, CardHeader, Stack } from '@mui/material';
// routes
// components

// sections

import SortingSelecting from '../../../sections/_examples/mui/table/sorting-selecting';


// ----------------------------------------------------------------------

export default function AllStudentTable() {
  return (
    <>
      <Helmet>
        <title> MUI Components: Table | Minimal UI</title>
      </Helmet>

      <Box
        sx={{
          pt: 6,
          pb: 1,
          bgcolor: (theme) => (theme.palette.mode === 'light' ? 'grey.200' : 'grey.800'),
        }}
      >
      </Box>

      <Container sx={{ my: 10 }}>
        <Stack spacing={3}>

          <Card>
            <SortingSelecting />
          </Card>

        </Stack>
      </Container>
    </>
  );
}
