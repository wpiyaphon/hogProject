import { Helmet } from 'react-helmet-async';
import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
// @mui
import axios from 'axios';
import { Container, Typography } from '@mui/material';
// components
import { useSettingsContext } from '../../components/settings';
import LoadingScreen from '../../components/loading-screen/LoadingScreen';
// sections
import TeacherCalendar from '../../sections/dashboard/teacher/TeacherCalendar'
//
import { currentTeacher } from './mockup'
// get student id
import { useAuthContext } from '../../auth/useAuthContext';

// ----------------------------------------------------------------------

export default function TeacherCalendarPage() {
    const { themeStretch } = useSettingsContext();
    const navigate = useNavigate();
    const dataFetchedRef = useRef(false);

    const { user } = useAuthContext();
    const config = { headers: { Authorization: `Bearer ${user.accessToken}` } }

    // Course ID
    const [teacherCourse, setTeacherCourse] = useState();

    const fetchClass = async () => {
        return axios.get(`${process.env.REACT_APP_HOG_API}/api/Teacher/Course/Get/Me`, config)
            .then((res) => {
                const data = res.data.data
                setTeacherCourse(data)
                // console.log('data', data)
            })
            .catch((error) => navigate('*', { replace: false }))
    }

    useEffect(() => {
        if (dataFetchedRef.current) return;
        fetchClass();
        dataFetchedRef.current = true;
    }, [])


    if (teacherCourse === undefined) {
        return <LoadingScreen />
    }
    // console.log(teacherCourse)
    const mappedStudentClasses = [];

    teacherCourse.forEach((currentCourse) => {
        const course = {
            id: currentCourse.course.id.toString(),
            course: currentCourse.course.course,
            subject: currentCourse.course.subject,
            level: currentCourse.course.level,
            type: currentCourse.request.courseType,
            section: currentCourse.course.section,
            paymentStatus: currentCourse.request.paymentStatus
        }

        const currentClasses = currentCourse.classes;
        const mappedClasses = currentClasses.map((eachClass, index) => {
            return {
                id: eachClass.id,
                course,
                classNo: (index + 1),
                students: [{ id: '1', fullName: 'Piyaphon Wu' }],
                date: eachClass.date,
                fromTime: eachClass.fromTime,
                toTime: eachClass.toTime,
                room: eachClass.room,
                section: course.section,
                teacher: { id: eachClass.teacherPrivateClass.teacherId, fullName: eachClass.teacherPrivateClass.fullName },
                paymentStatus: course.paymentStatus
                // attendance: 'Present'
            };
        });

        mappedStudentClasses.push(...mappedClasses);
    });
    // console.log(mappedStudentClasses)
    // Filter the classes based on the teacher ID
    const filteredClasses = mappedStudentClasses.filter((eachClass) => eachClass.teacher.id === user.id);

    // Log the filtered classes to the console
    // console.log(filteredClasses);

    return (
        <>
            <Helmet>
                <title> Teacher Calendar </title>
            </Helmet>

            <Container maxWidth={themeStretch ? false : 'xl'}>
                <Typography variant="h4" gutterBottom>
                    Teacher Calendar
                </Typography>
                <TeacherCalendar currentTeacher={filteredClasses} />
            </Container>
        </>
    );
}