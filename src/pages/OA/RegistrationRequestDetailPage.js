import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
// @mui
import { Container } from '@mui/material';
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import { useSettingsContext } from '../../components/settings';
// sections
import RegistrationRequestDetail from '../../sections/dashboard/oa-registration-request-form/RegistrationRequestDetail'

// ----------------------------------------------------------------------

const MOCKUP_GROUP_REQUEST = {
    regRequestId: '1',
    courseType: 'Group',
    students: [{ id: '1', fName: 'Piyaphon', lName: 'Wu', nickname: 'Hong' }],
    courses: [
        {
            course: 'SAT',
            section: 'CY/123',
            subjects: ['Math', 'English'],
            level: 'INTENSIVE',
            method: 'Onsite',
            startDate: '1-Jan-2023',
            endDate: '14-Jan-2023'
        },
        {
            course: 'GED',
            section: 'CY/123',
            subjects: ['Math'],
            level: 'REGULAR',
            method: 'Onsite',
            startDate: '15-Jan-2023',
            endDate: '31-Jan-2023'
        }
    ],
    attachedPayment: [],
    paymentType: 'Installments Payment',
    additionalComment: '✌ Greeting from Education Planner.',
    rejectedReason: '',
    status: 'Pending OA'
}

const MOCKUP_PRIVATE_REQUEST = {
    regRequestId: '2',
    courseType: 'Private',
    students: [{ id: '1', fName: 'Piyaphon', lName: 'Wu', nickname: 'Hong' }],
    courses: [
        {
            course: 'SAT',
            section: '',
            subjects: 'MATH',
            level: 'INTENSIVE',
            totalHours: '20',
            method: 'Onsite',
            hoursPerClass: '2',
            startDate: '1-Jan-2023',
            endDate: '14-Jan-2023',
            availableDays: [
                { day: 'Monday', from: '15:00', to: '18:00' },
                { day: 'Tuesday', from: '15:00', to: '18:00' },
                { day: 'Wednesday', from: '15:00', to: '18:00' },
                { day: 'Thursday', from: '15:00', to: '18:00' },
                { day: 'Friday', from: '15:00', to: '18:00' }
            ]
        },
        {
            course: 'SAT',
            section: '',
            subjects: 'ENGLISH',
            level: 'REGULAR',
            totalHours: '20',
            method: 'Online',
            hoursPerClass: '2',
            startDate: '15-Jan-2023',
            endDate: '31-Jan-2023',
            availableDays: [{ day: 'Monday', from: '9:00', to: '18:00' }, { day: 'Wednesday', from: '9:00', to: '18:00' }]
        }
    ],
    attachedPayment: [],
    additionalComment: '✌ Greeting from Education Planner.',
    paymentType: 'Complete Payment',
    rejectedReason: 'There is no available time slot 🤪',
    status: 'Pending OA'
}

// ----------------------------------------------------------------------

export default function RegistrationRequestDetailPage() {
    const { themeStretch } = useSettingsContext();

    const { id } = useParams();

    const currentRequest = (id === '1')? MOCKUP_GROUP_REQUEST : MOCKUP_PRIVATE_REQUEST;

    return (
        <>
            <Helmet>
                <title> OA | Registration Request </title>
            </Helmet>

            <Container maxWidth={themeStretch ? false : 'xl'}>
                <CustomBreadcrumbs
                    heading="Course Registration Request"
                    links={[
                        { name: 'All Requests', href: PATH_DASHBOARD.registrationRequestOA },
                        { name: 'Request Detail' }
                    ]}
                />

                <RegistrationRequestDetail request={currentRequest} />
            </Container>
        </>
    );
}
