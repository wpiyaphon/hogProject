import { Helmet } from 'react-helmet-async';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
// @mui
import { Card, Container, Stack } from '@mui/material';
// auth
import { useAuthContext } from '../../auth/useAuthContext';
// components
import { useSettingsContext } from '../../components/settings';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import LoadingScreen from '../../components/loading-screen/LoadingScreen';
// routes
import { PATH_ACCOUNT } from '../../routes/paths';
// Table
import StaffList from '../../sections/dashboard/oa-all-staff-list/StaffList';
// API
import { HOG_API } from '../../config';

// ----------------------------------------------------------------------

export default function SearchStaffPage() {
    const { themeStretch } = useSettingsContext();
    const { user } = useAuthContext();

    const dataFetchedRef = useRef(false);
    const [epStaff, setEpStaff] = useState();
    const [eaStaff, setEaStaff] = useState();
    const [allStaffs, setAllStaffs] = useState();

    // const fetchDataEP = async () => {
    //     await axios.get(`${HOG_API}/api/EP/Get`)
    //         .then(response => {
    //             console.log('ep', response)
    //             setAllStaffs([...allStaffs, ...response.data.data])
    //             setEpStaff(response.data.data)
    //         })
    //         .catch(error => {
    //             console.log(error);
    //         });
    // }

    axios.defaults.headers.common.Authorization = `Bearer ${user.accessToken}`

    const fetchData = async () => {
        await axios.get(`${HOG_API}/api/Staff/Get`)
            .then((res) => {
                setAllStaffs(res.data.data)
            })
            .catch((error) => console.error(error))
    }

    useEffect(() => {
        if (dataFetchedRef.current) return;
        dataFetchedRef.current = true;

        fetchData()
    }, []);

    if (allStaffs === undefined) {
        return <LoadingScreen />;
    }

    return (
        <>
            <Helmet>
                <title>All Staff</title>
            </Helmet>
            <Container maxWidth={themeStretch ? false : 'lg'}>
                <CustomBreadcrumbs
                    heading="All Staff"
                    links={[
                        { name: 'All Staff', href: PATH_ACCOUNT.staffManagement.searchStaff }
                    ]}
                />
                <Stack spacing={3}>
                    <Card>
                        {/* <StaffList/> */}
                        <StaffList allStaffs={allStaffs} />
                    </Card>
                </Stack>
            </Container>
        </>
    );
}
