import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import _ from 'lodash';
// form
import { useForm, Controller } from 'react-hook-form';
// @mui
import { DatePicker } from '@mui/x-date-pickers';
import { LoadingButton } from '@mui/lab';
import {
    TextField,
    Grid,
    Stack,
    Card,
    Box,
    Dialog,
    Paper,
    Typography,
    Button,
    IconButton,
    MenuItem,
    Table,
    TableBody,
    TableContainer,
    TableHead,
    TableRow,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions
} from '@mui/material';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import InfoIcon from '@mui/icons-material/Info';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
// utils
import { fDate } from '../../../utils/formatTime'
// components
import { useSnackbar } from '../../../components/snackbar';
import Scrollbar from '../../../components/scrollbar/Scrollbar';
import FormProvider, { RHFSelect } from '../../../components/hook-form';
import { HOG_API } from '../../../config';

ScheduleRegistrationRequest.propTypes = {
    currentRequest: PropTypes.object,
}

export default function ScheduleRegistrationRequest({ currentRequest }) {

    const { enqueueSnackbar } = useSnackbar();

    // Prevent user to submit the form unless all schedules are generated
    const [createdCourses, setCreatedCourses] = useState([]);

    const [submitDialogOpen, setSubmitDialogOpen] = useState(false);
    const [rejectDialogOpen, setRejectDialogOpen] = useState(false);

    const [rejectedReasonMessage, setRejectedReasonMessage] = useState('');

    if (!currentRequest) {
        return null;
    }

    const {
        request,
        information,
        students,
    } = currentRequest;

    const courseType = 'Private';

    const handleCreateCourse = (createdCourse) => {
        setCreatedCourses([...createdCourses, createdCourse]);
    }

    // submit
    const handleClickSubmitOpen = (event) => {
        event.preventDefault()
        setSubmitDialogOpen(true);
    };

    const handleSubmitClose = () => {
        setSubmitDialogOpen(false);
    };

    const addCourseToDatabase = () => {
        createdCourses.forEach((eachCourse) => {
            const formattedSchedule = {
                reqId: request.id,
                course: eachCourse.course,
                subject: eachCourse.subject,
                level: eachCourse.level,
                method: eachCourse.method,
                totalHour: eachCourse.totalHour,
                hourPerClass: eachCourse.hourPerClass,
                fromDate: fDate(new Date(eachCourse.fromDate), 'dd-MMMM-yyyy'),
                toDate: fDate(new Date(eachCourse.toDate), 'dd-MMMM-yyyy'),
                privateClasses: eachCourse.schedules.map((eachClass) => (
                    {
                        room: '',
                        method: eachClass.method,
                        date: eachClass.date,
                        fromTime: eachClass.fromTime,
                        toTime: eachClass.toTime,
                        studentPrivateClasses: students.map((eachStudent) => (
                            {
                                studentId: eachStudent.id,
                                attendance: 'None'
                            }
                        )),
                        teacherPrivateClass: {
                            teacherId: 1,
                            status: 'Incomplete'
                        }
                    }
                ))
            }

            return axios.post(`${HOG_API}/api/PrivateRegistrationRequest/Schedule/Post`, formattedSchedule)
        })
    }

    const onSubmit = async () => {
        try {
            await addCourseToDatabase();
            await axios.put(`${HOG_API}/api/PrivateRegistrationRequest/Request/Put`, {
                request: {
                    id: request.id,
                    status: "PendingEP",
                    eaStatus: "Complete",
                    paymentStatus: "Pending",
                    epRemark1: request.epRemark1,
                    epRemark2: request.epRemark2,
                    eaRemark: request.eaRemark,
                    oaRemark: request.oaRemark,
                    takenByEPId: request.takenByEPId,
                    takenByEAId: 1,
                    takenByOAId: 0
                }
            })
                .then((res) => enqueueSnackbar('Schedules are submitted successfully', { variant: 'success' }))
                .catch((error) => console.error(error))

        } catch (error) {
            enqueueSnackbar(error.message, { variant: 'error' });
        }
    };
    const onReject = async () => {
        try {
            if (rejectedReasonMessage === '') {
                enqueueSnackbar('Please enter a reason for rejection!', { variant: 'error' });
            } else {
                console.log(createdCourses);
            }
        } catch (error) {
            enqueueSnackbar(error.message, { variant: 'error' });
        }
    };

    const handleClickRejectOpen = () => {
        setRejectDialogOpen(true);
    }

    const handleRejectClose = () => {
        setRejectDialogOpen(false);
        setRejectedReasonMessage('');
    };

    return (
        <Grid container spacing={3}>
            <Grid item xs={12} md={12}>
                <StudentSection students={students} />
            </Grid>
            <Grid item xs={12} md={12}>
                <CourseSection courseType={courseType} courses={information} onCreate={handleCreateCourse} />
            </Grid>

            <Grid item xs={12} md={12}>
                <AdditionalCommentSection message={request.epRemark1} />
            </Grid>

            <Grid item xs={12} md={12}>
                <Stack direction="row" justifyContent="flex-end" alignItems="center" spacing={2}>
                    <Button variant="contained" color="error" sx={{ height: '3em' }} onClick={handleClickRejectOpen}>
                        Reject
                    </Button>
                    <Button variant="contained" disabled={information.length !== createdCourses.length} color="primary" sx={{ height: '3em' }} onClick={handleClickSubmitOpen}>
                        Submit
                    </Button>
                </Stack>
            </Grid>

            <Dialog
                open={submitDialogOpen}
                onClose={handleSubmitClose}
                maxWidth="sm"
            >
                <DialogTitle>
                    <Stack direction="row" alignItems="center" justifyContent="flex-start">
                        <CheckCircleOutlineIcon fontSize="large" sx={{ mr: 1 }} />
                        <Typography variant="h5">{"Submit the request?"}</Typography>
                    </Stack>
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Your response will be updated to the system and sent to the student and the teacher.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button color="inherit" variant="outlined" onClick={handleSubmitClose}>Cancel</Button>
                    <Button variant="contained" onClick={onSubmit} color="primary">
                        Submit
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={rejectDialogOpen}
                onClose={handleRejectClose}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>
                    <Stack direction="row" alignItems="center" justifyContent="flex-start">
                        <CheckCircleOutlineIcon fontSize="large" sx={{ mr: 1 }} />
                        <Typography variant="h5">Reject the request?</Typography>
                    </Stack>
                </DialogTitle>
                <DialogContent>
                    <TextField fullWidth name="rejectedReason" label="Reason" multiline rows={3} sx={{ my: 1 }} onChange={(event) => setRejectedReasonMessage(event.target.value)} required />
                </DialogContent>
                <DialogActions>
                    <Button color="inherit" variant="outlined" onClick={handleRejectClose}>Cancel</Button>
                    <Button variant="contained" onClick={onReject} color="error">
                        Reject
                    </Button>
                </DialogActions>
            </Dialog>
        </Grid>
    )
}

// ----------------------------------------------------------------------

StudentSection.propTypes = {
    courseType: PropTypes.string,
    students: PropTypes.array,
}

export function StudentSection({ courseType, students }) {

    const studentLimit = (courseType === 'Semi Private') ? 15 : 1;

    return (
        <Card sx={{ p: 3 }}>
            <Grid
                container
                direction="row"
                alignItems="center">
                <Grid item xs={6} md={6}>
                    <Typography variant="h6">{`Student(s) ${students.length} / ${studentLimit.toString()}`}</Typography>
                </Grid>
            </Grid>

            <Grid container direction="row" spacing={1} sx={{ mt: 1 }}>
                {students.map((student, index) => (
                    <Grid item xs={12} md={4} key={student.id}>
                        <TextField
                            disabled
                            variant="standard"
                            sx={{ width: 320 }}
                            value={`${student.fullName} (${student.nickname})`}
                        />
                    </Grid>
                ))}
            </Grid>

        </Card>
    )
}

// ----------------------------------------------------------------------

CourseSection.propTypes = {
    courseType: PropTypes.string,
    courses: PropTypes.array,
    onCreate: PropTypes.func,
}

export function CourseSection({ courseType, courses, onCreate }) {

    // Schedule Dialog
    const [open, setOpen] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState({});
    const [completeCourses, setCompleteCourses] = useState([]);

    const handleOpenDialog = (course) => {
        setSelectedCourse(course);
        setOpen(true);
    };

    const handleCloseDialog = () => {
        setSelectedCourse({})
        setOpen(false);
    }

    const handleCreate = (schedules) => {
        const createdCourse = { ...selectedCourse, schedules };
        setCompleteCourses([...completeCourses, createdCourse]);
        onCreate(createdCourse);
    };

    const checkAlreadyCreated = (completeCourses, course) =>
        completeCourses.some((eachCourse) => (eachCourse.course === course.course && eachCourse.subject === course.subject && eachCourse.level === course.level));

    return (
        <>
            <Card sx={{ p: 3 }}>
                <Grid container
                    direction="row"
                    alignItems="center">
                    <Grid item xs={6} md={6}>
                        <Typography variant="h6">{`New Course(s)`}</Typography>
                    </Grid>
                </Grid>
                {courses.map((eachCourse, index) => (
                    <Paper key={index} elevation={2} sx={{ mt: 2, p: 3 }}>

                        <Grid container direction="row" spacing={2} sx={{ mt: 1, mb: 2 }}>
                            <Grid item xs={6} md={4}>
                                <TextField fullWidth disabled variant="standard" label="Course" value={`${eachCourse.course} ${eachCourse.subject} ${eachCourse.level}`} />
                            </Grid>
                            <Grid item xs={6} md={4}>
                                <TextField fullWidth disabled variant="standard" label="Start Date" value={fDate(eachCourse.fromDate, 'dd-MMM-yyyy')} />
                            </Grid>
                            <Grid item xs={6} md={4}>
                                <TextField fullWidth disabled variant="standard" label="End Date" value={fDate(eachCourse.toDate, 'dd-MMM-yyyy')} />
                            </Grid>
                        </Grid>

                        <Grid container direction="row" sx={{ mt: 2 }} justifyContent="flex-end">
                            {checkAlreadyCreated(completeCourses, eachCourse) ? (
                                <Button variant="contained" color="inherit" sx={{ height: '3em' }} onClick={() => {
                                    handleOpenDialog(eachCourse)
                                }}>
                                    <EditIcon sx={{ mr: 0.5 }} /> Edit schedule
                                </Button>
                            ) : (
                                <Button variant="contained" disabled={checkAlreadyCreated(completeCourses, eachCourse)} color="primary" sx={{ height: '3em' }} onClick={() => handleOpenDialog(eachCourse)}>
                                    Create Class
                                </Button>
                            )}
                        </Grid>

                    </Paper>
                ))
                }

            </Card>
            {
                !!Object.keys(selectedCourse).length && (
                    <CreateScheduleDialog
                        open={open}
                        close={handleCloseDialog}
                        courseType={courseType}
                        hourPerClass={selectedCourse.hourPerClass}
                        selectedCourse={selectedCourse}
                        onCreate={handleCreate}
                        completeCourses={completeCourses}
                    />
                )
            }
        </>
    )
}

// ----------------------------------------------------------------------

CreateScheduleDialog.propTypes = {
    courseType: PropTypes.string,
    open: PropTypes.bool,
    close: PropTypes.func,
    selectedCourse: PropTypes.object,
    hourPerClass: PropTypes.number,
    onCreate: PropTypes.func,
    completeCourses: PropTypes.array,
}

export function CreateScheduleDialog({ open, close, courseType, selectedCourse, hourPerClass, onCreate, completeCourses }) {
    const { enqueueSnackbar } = useSnackbar();

    const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    // Generate Schedules -------------------------------------------------------------------
    const [schedules, setSchedules] = useState([])

    // Fetch generated schedules
    const getGeneratedSchedules = async () => {
        try {
            await axios.get('https://api.sampleapis.com/wines/reds')
                .then((res) => console.log(res.data)) // Response received
        } catch (error) {
            console.error(error);
        }
    };

    const handleGenerate = () => {
        // async/await fetching data
        getGeneratedSchedules()
    }

    // Check if course is already in created Courses --------------------------------------------------
    const checkAlreadyCreated = (completeCourses, course) => (
        completeCourses.some((eachCourse) => (eachCourse.course === course.course && eachCourse.subject === course.subject && eachCourse.level === course.level))
    )

    // If already created, then show the generated schedule
    useEffect(() => {
        if (!!Object.keys(selectedCourse).length && checkAlreadyCreated(completeCourses, selectedCourse)) {
            const targetCourse = completeCourses.find((eachCourse) => (eachCourse.course === selectedCourse.course && eachCourse.subject === selectedCourse.subject && eachCourse.level === selectedCourse.level));
            setSchedules(targetCourse.schedules);
        }
    }, [selectedCourse])

    // Edit Schedule ---------------------------------------------------------------------------------
    const [selectedSchedule, setSelectedSchedule] = useState({})
    const [openEditClass, setOpenEditClass] = useState(false);

    const handleOpenEditDialog = (row) => {
        setSelectedSchedule(row);
        setOpenEditClass(true);
    }

    const handleCloseEditDialog = () => {
        setSelectedSchedule({});
        setOpenEditClass(false);
    }

    const handleEditClass = (newClass) => {
        const filteredSchedules = schedules.filter((eachSchedule) => eachSchedule !== selectedSchedule)
        const updatedSchedules = [...filteredSchedules, newClass]
        //  shallow copy the array
        setSchedules(updatedSchedules.sort((class1, class2) => class1.date - class2.date));
    }

    const handleDeleteClass = (deletedClass) => {
        const filteredSchedules = schedules.filter((eachSchedule) => eachSchedule !== deletedClass)
        //  shallow copy the array
        setSchedules(filteredSchedules.sort((class1, class2) => class1.date - class2.date));
    }

    let displayAccumulatedHours = 0;

    function accumulatedHours() {
        let HoursCount = 0;
        schedules.forEach((eachSchedule) => {
            HoursCount += parseInt(eachSchedule.hourPerClass, 10)
        })
        return HoursCount;
    }

    const [openAddClassDialog, setOpenAddClassDialog] = useState(false);

    const handleAddClass = (newClass) => {
        const updatedSchedules = [...schedules, newClass]
        setSchedules(updatedSchedules.sort((class1, class2) => class1.date - class2.date));
    }

    const handleCreate = () => {
        if (parseInt(selectedCourse.totalHour, 10) !== accumulatedHours()) {
            enqueueSnackbar('Total hours are not match!', { variant: 'error' })
        } else {
            onCreate(schedules);
            setSchedules([]);
            close();
        }
    }

    const customTextFieldStyle = {
        fontSize: '0.9rem'
    }

    console.log(schedules)

    // Tables ---------------------------------------------------------------------------------
    const StyledTableCell = styled(TableCell)(({ theme }) => ({
        [`&.${tableCellClasses.head}`]: {
            backgroundColor: theme.palette.divider,
            color: theme.palette.common.black,
            fontSize: '0.7rem',
            border: `1px solid ${theme.palette.divider}`,
        },
        [`&.${tableCellClasses.body}`]: {
            fontSize: '0.7rem',
            padding: 5,
            border: `1px solid ${theme.palette.divider}`,

        },
    }));

    const StyledTableRow = styled(TableRow)(({ theme }) => ({
        '&:last-child td, &:last-child th': {
            backgroundColor: theme.palette.divider,
            padding: 16,
            fontWeight: 600,
            border: `1px solid ${theme.palette.divider}`,
        },
    }));

    return (
        <Dialog fullWidth maxWidth="xl" open={open} onClose={close}>

            <Grid container direction="row" sx={{ p: 3, pb: 1 }} spacing={2} >
                <Grid container item xs={12} md={12} justifyContent="space-between" alignItems="center">
                    <Typography variant="h6"> Create Class </Typography>
                    <IconButton variant="h6" onClick={close}> <CloseIcon /> </IconButton>
                </Grid>
            </Grid>

            <Grid container direction="row" sx={{ px: 3 }} spacing={2}>

                <Grid item xs={12} md={5}>
                    <Grid item xs={12} md={12} sx={{ pb: 2 }}>
                        <Typography variant="h6"> Course Information </Typography>
                    </Grid>

                    <Stack direction="row" sx={{ pb: 2 }}>
                        <Grid container direction="row" spacing={2}>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    value={selectedCourse.course.concat(' ', selectedCourse.subject, ' ', selectedCourse.level)}
                                    label="Course"
                                    disabled
                                    InputProps={{
                                        style: customTextFieldStyle
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    value={courseType.toUpperCase()}
                                    label="Course Type"
                                    disabled
                                    InputProps={{
                                        style: customTextFieldStyle
                                    }}
                                />
                            </Grid>
                        </Grid>
                    </Stack>

                    <Stack direction="row" sx={{ pb: 2 }}>
                        <Grid container direction="row" spacing={2}>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    value={selectedCourse.method}
                                    label="Learning Method"
                                    disabled
                                    inputProps={{
                                        style: { textTransform: "capitalize", fontSize: "0.9rem" }
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    value={selectedCourse.totalHour}
                                    label="Total Hours"
                                    disabled
                                    InputProps={{
                                        style: customTextFieldStyle
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    value={selectedCourse.hourPerClass}
                                    label="Hours/Class"
                                    disabled
                                    InputProps={{
                                        style: customTextFieldStyle
                                    }}
                                />
                            </Grid>
                        </Grid>
                    </Stack>

                    <Stack direction="row" sx={{ pb: 2 }} spacing={2}>
                        <Grid container direction="row" spacing={2}>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    value={fDate(selectedCourse.fromDate, 'dd-MMM-yyyy')}
                                    label="Start Date"
                                    disabled
                                    InputProps={{
                                        style: customTextFieldStyle
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    value={fDate(selectedCourse.toDate, 'dd-MMM-yyyy')}
                                    label="End Date"
                                    disabled
                                    InputProps={{
                                        style: customTextFieldStyle
                                    }}
                                />
                            </Grid>
                        </Grid>
                    </Stack>

                    <Grid item xs={12} md={12} sx={{ mb: 1 }}>
                        <Typography variant="inherit" sx={{ color: 'text.disabled' }}>
                            Preferred Days
                        </Typography>
                    </Grid>

                    <Stack direction="row" sx={{ pb: 3 }}>
                        <Grid container direction="row" spacing={2}>
                            {selectedCourse.preferredDays.map((eachDay, index) => (
                                <Grid item xs={6} md={3} key={index}>
                                    <TextField
                                        fullWidth
                                        label={eachDay.day}
                                        value={`${eachDay.fromTime} - ${eachDay.toTime}`}
                                        InputProps={{
                                            style: { fontSize: '0.8rem' }
                                        }}
                                        disabled />
                                </Grid>
                            ))}
                        </Grid>
                    </Stack>
                </Grid>

                <Grid item xs={12} md={7}>
                    <Scrollbar sx={{ maxHeight: '28.1rem', pr: 1.5 }}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                            <Typography variant="h6">
                                Classes & Schedules
                            </Typography>

                            <Button variant="text" color="primary" onClick={() => setOpenAddClassDialog(true)}>
                                <AddIcon sx={{ mr: 0.5 }} /> Add Class
                            </Button>

                        </Stack>
                        {!!schedules.length && (
                            <TableContainer component={Paper} >
                                <Table sx={{ width: '100%' }}>
                                    <TableHead>
                                        <TableRow>
                                            <StyledTableCell align="center">No.</StyledTableCell>
                                            <StyledTableCell align="center">Day</StyledTableCell>
                                            <StyledTableCell align="center">Date</StyledTableCell>
                                            <StyledTableCell colSpan={2} align="center">Time</StyledTableCell>
                                            <StyledTableCell align="center">Method</StyledTableCell>
                                            <StyledTableCell align="center">Teacher</StyledTableCell>
                                            <StyledTableCell align="center">Hours</StyledTableCell>
                                            <StyledTableCell align="center" />
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {schedules.map((eachClass, index) => {
                                            displayAccumulatedHours += parseInt(eachClass.hourPerClass, 10);
                                            return (
                                                <StyledTableRow key={index}>
                                                    <StyledTableCell component="th" scope="row" align="center">
                                                        {(index + 1).toString()}
                                                    </StyledTableCell>
                                                    <StyledTableCell align="center"> {eachClass.day.slice(0, 3)} </StyledTableCell>
                                                    <StyledTableCell align="center">{fDate(eachClass.date)}</StyledTableCell>
                                                    <StyledTableCell align="center">{eachClass.fromTime} - {eachClass.toTime}</StyledTableCell>
                                                    <StyledTableCell sx={{ width: '8%' }} align="center">{eachClass.hourPerClass}</StyledTableCell>
                                                    <StyledTableCell align="center">{eachClass.method}</StyledTableCell>
                                                    <StyledTableCell sx={{ width: '15%' }} align="center">{`${eachClass.teacher.toUpperCase()}`}</StyledTableCell>
                                                    <StyledTableCell align="center">{displayAccumulatedHours.toString()}</StyledTableCell>
                                                    <StyledTableCell align="center" > {
                                                        <IconButton onClick={() => handleOpenEditDialog(eachClass)}>
                                                            <EditIcon fontSize="small" />
                                                        </IconButton>
                                                    }
                                                    </StyledTableCell>
                                                </StyledTableRow>
                                            )
                                        })}
                                        <StyledTableRow>
                                            <StyledTableCell colSpan={7} align="center">TOTAL</StyledTableCell>
                                            <StyledTableCell align="center">{accumulatedHours()}</StyledTableCell>
                                            <StyledTableCell />
                                        </StyledTableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        )}
                    </Scrollbar>
                </Grid>
            </Grid>
            {Object.keys(selectedSchedule).length > 0 &&
                <EditClassDialog
                    open={openEditClass}
                    close={handleCloseEditDialog}
                    schedule={selectedSchedule}
                    onEdit={handleEditClass}
                    onDelete={handleDeleteClass}
                    hourPerClass={selectedCourse.hourPerClass}
                />
            }

            <AddClassDialog
                open={openAddClassDialog}
                onClose={() => setOpenAddClassDialog(false)}
                onAdd={handleAddClass}
                hourPerClass={selectedCourse.hourPerClass}
            />

            <Grid container justifyContent="flex-end" sx={{ p: 3, pt: 0 }}>
                <Button variant="contained" size="large" disabled={accumulatedHours() !== selectedCourse.totalHour} onClick={handleCreate}>
                    Create
                </Button>
            </Grid>
        </Dialog>
    )
}

// ----------------------------------------------------------------------

EditClassDialog.propTypes = {
    open: PropTypes.bool,
    close: PropTypes.func,
    schedule: PropTypes.object,
    onEdit: PropTypes.func,
    onDelete: PropTypes.func,
    hourPerClass: PropTypes.number
}

export function EditClassDialog({ open, close, schedule, onEdit, onDelete, hourPerClass }) {

    // fetch all teachers
    const TEACHER_OPTIONS = [
        { fullName: 'John Smith', nickname: 'Tar' },
        { fullName: 'John Smite', nickname: 'Keen' },
        { fullName: 'Jane Smoke', nickname: 'Kwan' }
    ];

    // fetch available time of specific teacher
    const TIME_OPTIONS = [
        '10:00-12:00', '13:00-15:00', '16:00-18:00'
    ];

    // don't fetch
    const LEARNING_METHOD_OPTIONS = [
        'Onsite', 'Online'
    ];

    const {
        date,
        fromTime,
        toTime,
        teacher,
        method,
    } = schedule;

    const defaultValues = {
        scheduleDate: date,
        scheduleTime: fromTime.concat('-', toTime),
        scheduleTeacher: _.capitalize(teacher),
        scheduleMethod: method
    };

    const methods = useForm({
        defaultValues
    });

    const {
        watch,
        control,
        setValue,
        reset,
    } = methods;

    const values = watch();
    const { scheduleDate, scheduleTeacher, scheduleFromTime, scheduleToTime, scheduleMethod } = values;

    useEffect(() => {
        if (Object.keys(schedule).length) {
            setValue('scheduleDate', date);
            setValue('scheduleTeacher', teacher.id);
            setValue('scheduleFromTime', fromTime);
            setValue('scheduleToTime', fromTime);
            setValue('scheduleMethod', method);
        }
    }, [schedule])

    const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    const handleSaveChange = () => {
        const newSchedule = {
            day: weekday[new Date(scheduleDate).getDay()].slice(0, 3),
            date: scheduleDate,
            hourPerClass,
            teacher: TEACHER_OPTIONS.find((eachTeacher) => eachTeacher.id === scheduleTeacher),
            fromTime: scheduleFromTime.slice(0, 5),
            toTime: scheduleToTime.slice(6, 11),
            method: scheduleMethod
        };
        onEdit(newSchedule);
        handleClose();
    }

    const handleDelete = () => {
        onDelete(schedule);
        handleClose();
    }

    const handleClose = () => {
        close();
        setTimeout(() => {
            reset();
        }, 200);
    }

    return (
        <Dialog fullWidth maxWidth="lg" open={open} onClose={close}>
            <FormProvider methods={methods}>
                <Grid container spacing={1} sx={{ p: 3 }}>
                    <Grid item xs={12} md={12} sx={{ pb: 2 }}>
                        <Stack direction="row">
                            <Typography variant="h6"> Edit Schedule </Typography>
                        </Stack>
                    </Grid>

                    <Grid item xs={12} md={3}>
                        <Controller
                            name="scheduleDate"
                            control={control}
                            render={({ field, fieldState: { error } }) => (
                                <DatePicker
                                    label="Date"
                                    value={field.value}
                                    onChange={(newValue) => {
                                        field.onChange(newValue);
                                    }}
                                    renderInput={(params) => (
                                        <TextField {...params} fullWidth error={!!error} helperText={error?.message} required />
                                    )}
                                    disableMaskedInput
                                    inputFormat="dd-MMM-yyyy"
                                />
                            )}
                        />
                    </Grid>

                    <Grid item xs={12} md={3}>
                        <RHFSelect
                            fullWidth
                            name="scheduleTime"
                            label="Time"
                            SelectProps={{ native: false, sx: { textTransform: 'capitalize' } }}
                            required>
                            {TIME_OPTIONS.map((eachTime, index) => (
                                <MenuItem
                                    key={index}
                                    value={eachTime}
                                    sx={{
                                        mx: 1,
                                        my: 0.5,
                                        borderRadius: 0.75,
                                        typography: 'body2',
                                        textTransform: 'capitalize',
                                        '&:first-of-type': { mt: 0 },
                                        '&:last-of-type': { mb: 0 },
                                    }}
                                >
                                    {eachTime}
                                </MenuItem>
                            ))}
                        </RHFSelect>
                    </Grid>

                    <Grid item xs={12} md={3}>
                        <RHFSelect
                            fullWidth
                            name="scheduleTeacher"
                            label="Teacher"
                            SelectProps={{ native: false, sx: { textTransform: 'capitalize' } }}
                            required>
                            {TEACHER_OPTIONS.map((eachTeacher, index) => (
                                <MenuItem
                                    key={index}
                                    value={eachTeacher.nickname}
                                    sx={{
                                        mx: 1,
                                        my: 0.5,
                                        borderRadius: 0.75,
                                        typography: 'body2',
                                        textTransform: 'capitalize',
                                        '&:first-of-type': { mt: 0 },
                                        '&:last-of-type': { mb: 0 },
                                    }}
                                >
                                    {`${eachTeacher.nickname.toUpperCase()} (${eachTeacher.fullName})`}
                                </MenuItem>
                            ))}
                        </RHFSelect>
                    </Grid>

                    <Grid item xs={12} md={3}>
                        <RHFSelect
                            fullWidth
                            name="scheduleMethod"
                            label="Learning Method"
                            SelectProps={{ native: false, sx: { textTransform: 'capitalize' } }}
                            required>
                            {LEARNING_METHOD_OPTIONS.map((eachMethod, index) => (
                                <MenuItem
                                    key={index}
                                    value={eachMethod}
                                    sx={{
                                        mx: 1,
                                        my: 0.5,
                                        borderRadius: 0.75,
                                        typography: 'body2',
                                        textTransform: 'capitalize',
                                        '&:first-of-type': { mt: 0 },
                                        '&:last-of-type': { mb: 0 },
                                    }}
                                >
                                    {eachMethod}
                                </MenuItem>
                            ))}
                        </RHFSelect>
                    </Grid>
                </Grid>

                <Grid container justifyContent="space-between" alignItems="center" sx={{ px: 3, pb: 3 }} spacing={1.5}>
                    <Stack direction="row" sx={{ ml: 1.5 }}>
                        <Grid item>
                            <Button variant="contained" size="medium" color="error" onClick={handleDelete}>
                                Delete
                            </Button>
                        </Grid>
                    </Stack>
                    <Stack direction="row" spacing={1}>
                        <Grid item>
                            <Button variant="outlined" size="medium" color="inherit" onClick={handleClose}>
                                Close
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button variant="contained" size="medium" onClick={handleSaveChange}>
                                Save Change
                            </Button>
                        </Grid>
                    </Stack>
                </Grid>
            </FormProvider>
        </Dialog>
    )
}

// ----------------------------------------------------------------

AddClassDialog.propTypes = {
    open: PropTypes.bool,
    onClose: PropTypes.func,
    onAdd: PropTypes.func,
    hourPerClass: PropTypes.number,
}

export function AddClassDialog({ open, onClose, onAdd, hourPerClass }) {

    // fetch all teachers
    const TEACHER_OPTIONS = [
        { fullName: 'John Smith', nickname: 'Tar' },
        { fullName: 'John Smite', nickname: 'Keen' },
        { fullName: 'Jane Smoke', nickname: 'Kwan' }
    ];

    // fetch available time of specific teacher
    const TIME_OPTIONS = [
        '10:00-12:00', '13:00-15:00', '16:00-18:00'
    ];

    // don't fetch
    const METHOD_OPTIONS = [
        'Onsite', 'Online'
    ];

    const defaultValues = {
        classDate: '',
        classTime: '',
        classTeacher: '',
        classMethod: 'Onsite'
    };

    const methods = useForm({
        defaultValues
    });

    const {
        control,
        reset,
        handleSubmit
    } = methods;

    const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    const onSubmit = (data) => {
        const newClass = {
            day: weekday[new Date(data.classDate).getDay()].slice(0, 3),
            date: fDate(data.classDate),
            hourPerClass,
            fromTime: data.classTime.slice(0, 5),
            toTime: data.classTime.slice(6, 11),
            method: data.classMethod,
            teacher: data.classTeacher.toUpperCase()
        };

        onAdd(newClass);
        onClose();
        setTimeout(() => {
            reset(defaultValues);
        }, 200)
    }

    return (
        <Dialog fullWidth maxWidth="md" open={open} onClose={onClose}>
            <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
                <DialogTitle sx={{ pb: 0 }}>Add Class</DialogTitle>
                <DialogContent>
                    <Grid container direction="row" sx={{ mt: 1, mb: 2 }} spacing={2}>

                        <Grid item xs={12} md={3}>
                            <Controller
                                name="classDate"
                                control={control}
                                render={({ field, fieldState: { error } }) => (
                                    <DatePicker
                                        label="Date"
                                        value={field.value}
                                        onChange={(newValue) => {
                                            field.onChange(newValue);
                                        }}
                                        renderInput={(params) => (
                                            <TextField {...params} fullWidth error={!!error} helperText={error?.message} required />
                                        )}
                                        disableMaskedInput
                                        inputFormat="dd-MMM-yyyy"
                                    />
                                )}
                            />
                        </Grid>

                        <Grid item xs={12} md={3}>
                            <RHFSelect
                                fullWidth
                                name="classTime"
                                label="Time"
                                SelectProps={{ native: false, sx: { textTransform: 'capitalize' } }}
                                required>
                                {TIME_OPTIONS.map((eachTime, index) => (
                                    <MenuItem
                                        key={index}
                                        value={eachTime}
                                        sx={{
                                            mx: 1,
                                            my: 0.5,
                                            borderRadius: 0.75,
                                            typography: 'body2',
                                            textTransform: 'capitalize',
                                            '&:first-of-type': { mt: 0 },
                                            '&:last-of-type': { mb: 0 },
                                        }}
                                    >
                                        {eachTime}
                                    </MenuItem>
                                ))}
                            </RHFSelect>
                        </Grid>

                        <Grid item xs={12} md={3}>
                            <RHFSelect
                                fullWidth
                                name="classTeacher"
                                label="Teacher"
                                SelectProps={{ native: false, sx: { textTransform: 'capitalize' } }}
                                required>
                                {TEACHER_OPTIONS.map((eachTeacher, index) => (
                                    <MenuItem
                                        key={index}
                                        value={eachTeacher.nickname}
                                        sx={{
                                            mx: 1,
                                            my: 0.5,
                                            borderRadius: 0.75,
                                            typography: 'body2',
                                            textTransform: 'capitalize',
                                            '&:first-of-type': { mt: 0 },
                                            '&:last-of-type': { mb: 0 },
                                        }}
                                    >
                                        {`${eachTeacher.nickname.toUpperCase()} (${eachTeacher.fullName})`}
                                    </MenuItem>
                                ))}
                            </RHFSelect>
                        </Grid>

                        <Grid item xs={12} md={3}>
                            <RHFSelect
                                fullWidth
                                name="classMethod"
                                label="Learning Method"
                                SelectProps={{ native: false, sx: { textTransform: 'capitalize' } }}
                                required>
                                {METHOD_OPTIONS.map((eachMethod, index) => (
                                    <MenuItem
                                        key={index}
                                        value={eachMethod}
                                        sx={{
                                            mx: 1,
                                            my: 0.5,
                                            borderRadius: 0.75,
                                            typography: 'body2',
                                            textTransform: 'capitalize',
                                            '&:first-of-type': { mt: 0 },
                                            '&:last-of-type': { mb: 0 },
                                        }}
                                    >
                                        {eachMethod}
                                    </MenuItem>
                                ))}
                            </RHFSelect>
                        </Grid>

                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button variant="outlined" color="inherit" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button type="submit" variant="contained" color="primary">
                        Add
                    </Button>
                </DialogActions>
            </FormProvider>
        </Dialog>
    )
}

// ----------------------------------------------------------------------

AdditionalCommentSection.propTypes = {
    message: PropTypes.string,
    status: PropTypes.string
}

export function AdditionalCommentSection({ message, status }) {
    return (
        <Card sx={{ p: 3 }}>
            <Typography variant="h5"
                sx={{
                    mb: 2,
                    display: 'block',
                }}>{status !== 'Rejected' ? 'Additional Comment' : 'Rejected Reason'}</Typography>
            <Box
                rowGap={3}
                columnGap={2}
                display="grid"
                gridTemplateColumns={{
                    xs: 'repeat(1, 1fr)',
                    sm: 'repeat(1, 1fr)',
                }}
            >
                <TextField disabled value={message} />
            </Box>
        </Card>
    )
}