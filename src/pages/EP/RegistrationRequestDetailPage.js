import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
// @mui
import { Container } from '@mui/material';
import { PATH_REGISTRATION } from '../../routes/paths';
// components
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import { useSettingsContext } from '../../components/settings';
import LoadingScreen from '../../components/loading-screen';
// sections
import RegistrationRequestDetail from '../../sections/dashboard/ep-registration-request-form/RegistrationRequestDetail'
//
import { HOG_API } from '../../config';
import { useAuthContext } from '../../auth/useAuthContext';

// ----------------------------------------------------------------------

export default function RegistrationRequestDetailPage() {
    const { themeStretch } = useSettingsContext();
    const { id } = useParams();
    const { user } = useAuthContext();

    const [currentRequest, setCurrentRequest] = useState();
    const [currentSchedule, setCurrentSchedule] = useState();
    const dataFetchedRef = useRef(false);

    axios.defaults.headers.common.Authorization = `Bearer ${user.accessToken}`

    const fetchRequest = () => {
        axios.get(`${HOG_API}/api/PrivateRegistrationRequest/Get/${id}`)
            .then((res) => setCurrentRequest(res.data.data))
            .catch((error) => console.error(error))
    };

    useEffect(() => {
        if (dataFetchedRef.current) return;
        dataFetchedRef.current = true;

        fetchRequest();
    }, [])

    if (currentRequest === undefined) {
        return <LoadingScreen />
    }

    return (
        <>
            <Helmet>
                <title> EP | Request Detail </title>
            </Helmet>

            <Container maxWidth={themeStretch ? false : 'xl'}>
                <CustomBreadcrumbs
                    heading="Course Registration"
                    links={[
                        { name: 'All Requests', href: PATH_REGISTRATION.epRequestStatus },
                        { name: 'Request Detail' }
                    ]}
                />

                <RegistrationRequestDetail currentRequest={currentRequest} educationPlannerId={user.id} />
            </Container>
        </>
    );
}