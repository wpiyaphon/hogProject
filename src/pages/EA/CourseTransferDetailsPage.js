import { Helmet } from 'react-helmet-async';
// @mui
import { Container, Typography } from '@mui/material';
import { PATH_COURSE_TRANSFER } from '../../routes/paths';
// components
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import { useSettingsContext } from '../../components/settings';
// import RegistrationRequestStatusList from '../../sections/dashboard/ea-request-management-list/RegistrationRequestStatusList'

// ----------------------------------------------------------------------

export default function CourseTransferRequestPage() {
    const { themeStretch } = useSettingsContext();

    return (
        <>
            <Helmet>
                <title> EA | Course Transfer Request Details</title>
            </Helmet>
            <CustomBreadcrumbs
                heading="Course Registration Request Status"
                links={[
                    {
                        name: 'Course Transfer Details',
                        href: PATH_COURSE_TRANSFER.epCourseTransferRequest,
                    },
                    { name: 'Request status' },
                ]}
            />
            <Container maxWidth={themeStretch ? false : 'xl'}>
                {/* <RegistrationRequestStatusList /> */}
                <Typography >Course Transfer Details</Typography>
            </Container>
        </>
    );
}
