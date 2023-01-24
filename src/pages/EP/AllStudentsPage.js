import { Helmet } from 'react-helmet-async';
// @mui
import { Typography,Box, Card, Container, CardHeader, Stack } from '@mui/material';
// components
import { useSettingsContext } from '../../components/settings';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';    
// Table
import SortingSelecting from './TableAllStudents';

export default function AllStudentsPage() {
    const { themeStretch } = useSettingsContext();

    return (
        <>
        <Helmet>
            <title> All Student Table</title>
        </Helmet>
        <Container maxWidth={themeStretch ? false : 'lg'}>
                <CustomBreadcrumbs
                    heading="All Student Table"
                    links={[
                        {
                            name: 'Student management',
                            href: PATH_DASHBOARD.firstPage,
                        },
                        { name: 'All Student TableList' },
                    ]}
                />
                <Stack spacing={3}>
                    <Card>
                        <SortingSelecting />
                    </Card>
                </Stack>
            </Container>



      </>
    );
}
