import { Helmet } from 'react-helmet-async';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
// @mui
import { Card, Container, Stack } from '@mui/material';
// components
import { useSettingsContext } from '../components/settings';
import CustomBreadcrumbs from '../components/custom-breadcrumbs';
import LoadingScreen from '../components/loading-screen/LoadingScreen';
// auth
import { useAuthContext } from '../auth/useAuthContext';
// routes
import { PATH_ACCOUNT } from '../routes/paths';
// Table
import { StudentList } from '../sections/dashboard/all-students-list';
// API
import { HOG_API } from '../config';

// ----------------------------------------------------------------------

export default function SearchStudentPage() {
    const { userAccessToken, user } = useAuthContext()
    // console.log(userAccessToken, user.role)
    const { themeStretch } = useSettingsContext();
    // console.log(HOG_API)

    const dataFetchedRef = useRef(false);
    const [studentTableData, setStudentTableData] = useState();

    const fetchData = async () => {
        return axios.get(
            `${HOG_API}/api/Student/Get`,
            {
                headers:
                {
                    Authorization: `Bearer ${userAccessToken}`,
                    Role: `${user.role}`
                }
            }
        )
            .then(response => {
                // console.log(response.data.data)
                setStudentTableData(response.data.data);
                // console.log("API table" ,response.data.data);
            })
            .catch(error => {
                console.log(error);
            });
    }




    useEffect(() => {
        if (dataFetchedRef.current) return;
        dataFetchedRef.current = true;

        fetchData();

    }, [])

    if (studentTableData === undefined) {
        return <LoadingScreen />;
    }

    return (
        <>
            <Helmet>
                <title>All Students</title>
            </Helmet>
            <Container maxWidth={themeStretch ? false : 'lg'}>
                <CustomBreadcrumbs
                    heading="All Students List"
                    links={[
                        {
                            name: 'All Students',
                            href: PATH_ACCOUNT.studentManagement.searchStudent,
                        },
                        
                    ]}
                />
                <Stack spacing={3}>
                    <Card>
                        {/* <StudentList/> */}
                        <StudentList studentTableData={studentTableData} />
                    </Card>
                </Stack>
            </Container>
        </>
    );
}
