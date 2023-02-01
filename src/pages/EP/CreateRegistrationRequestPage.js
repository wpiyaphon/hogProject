import { Helmet } from 'react-helmet-async';
// @mui
import { Container } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import { useSettingsContext } from '../../components/settings';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
// sections
import NewViewRegistrationRequest from '../../sections/dashboard/ep-registration-request-form/NewViewRegistrationRequest';

// ----------------------------------------------------------------------

const COURSE_TYPE_OPTIONS = [
    { id: 1, name: 'Group' },
    { id: 2, name: 'Private' },
    { id: 3, name: 'Semi Private' }
]

// ----------------------------------------------------------------------

export default function CreateRegistrationRequestPage() {
    const { themeStretch } = useSettingsContext();

    return (
        <>
            <Helmet>
                <title> EP | Create Registration Request </title>
            </Helmet>
            

            <Container maxWidth={themeStretch ? false : 'lg'}>
                <CustomBreadcrumbs
                    heading="Create registration request"
                    links={[
                        {
                            name: 'Create Request',
                            href: PATH_DASHBOARD.CreateRegistrationRequestPage,
                        },
                    ]}
                />

                <NewViewRegistrationRequest />
            </Container>
        </>
    );
}