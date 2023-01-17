import { Helmet } from 'react-helmet-async';
// @mui
import { Container, Typography } from '@mui/material';
// components
import { useSettingsContext } from '../../components/settings';

//Table
import { AllStudentTable} from './Table/AllStudentTable'
// ----------------------------------------------------------------------

export default function AllStudentsPage() {
    const { themeStretch } = useSettingsContext();

    return (
        <>
            <Helmet>
                <title> EP | All Students </title>
            </Helmet>

            <Container maxWidth={themeStretch ? false : 'xl'}>

            </Container>
        </>
    );
}
