import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import axios from 'axios';
import _ from 'lodash';
import { useNavigate } from 'react-router';
import Moment from 'moment';
import { extendMoment } from 'moment-range';
// @mui
import { LoadingButton } from '@mui/lab';
import {
  TextField,
  Grid,
  Stack,
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
  DialogActions,
  InputAdornment,
  Container,
  Divider,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
// auth
import { useAuthContext } from '../../auth/useAuthContext';
// utils
import { fDate } from '../../utils/formatTime';
import { useSnackbar } from '../../components/snackbar';
import Scrollbar from '../../components/scrollbar/Scrollbar';
//
import { AddClassSection } from './AddClassSection';
import { EditClassDialog } from './EditClassDialog';
import { HOG_API } from '../../config';

// ----------------------------------------------------------------

ViewEditScheduleDialog.propTypes = {
  selectedCourse: PropTypes.object,
  selectedSchedules: PropTypes.array,
  selectedRequest: PropTypes.object,
  open: PropTypes.bool,
  onClose: PropTypes.func,
  role: PropTypes.string,
  students: PropTypes.array,
  section: PropTypes.string,
};

export function ViewEditScheduleDialog({
  selectedCourse,
  selectedSchedules,
  selectedRequest,
  open,
  onClose,
  role,
  students,
  section,
}) {
  const { user } = useAuthContext();

  const { enqueueSnackbar } = useSnackbar();
  const moment = extendMoment(Moment);
  const navigate = useNavigate();

  axios.defaults.headers.common.Authorization = `Bearer ${user.accessToken}`;

  const { courseType } = selectedRequest;

  const [localSchedule, setLocalSchedule] = useState([]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [schedules, setSchedules] = useState([]);
  const [selectedClass, setSelectedClass] = useState({});
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [openEditClassDialog, setOpenEditClassDialog] = useState(false);

  const [deletedClass, setDeletedClass] = useState({});
  const [openDeleteClassDialog, setOpenDeleteClassDialog] = useState(false);

  // Delete class list
  const [deletedClassList, setDeletedClassList] = useState([]);
  // Edit class list
  const [edittedClassList, setEdittedClassList] = useState([]);
  // Confirm save changes
  const [openSaveChangesDialog, setOpenSaveChangesDialog] = useState(false);

  useEffect(() => {
    setSchedules(selectedSchedules);
    setLocalSchedule(
      selectedSchedules.sort(
        (class1, class2) =>
          new Date(`${fDate(class1.date, 'MMMM dd, yyyy')} ${class1.fromTime}:00`) -
          new Date(`${fDate(class2.date, 'MMMM dd, yyyy')} ${class2.fromTime}:00`)
      )
    );
    setSelectedStudents(students);
  }, [selectedSchedules]);

  const handleAddClass = async (addedClass) => {
    try {
      let hasConflict = false;

      const formattedData = {
        id: '',
        room: '',
        method: addedClass.method,
        date: fDate(addedClass.date, 'dd-MMM-yyyy'),
        fromTime: addedClass.fromTime,
        toTime: addedClass.toTime,
        studentPrivateClasses: selectedStudents.map((student) => ({
          studentId: student.studentId,
          attendance: 'None',
        })),
        teacherPrivateClass: {
          id: '',
          teacherId: addedClass.teacher.id,
          workType: addedClass.teacher.workType,
          nickname: addedClass.teacher.nickname,
          status: 'Incomplete',
        },
        classStatus: 'new',
      };

      await localSchedule.forEach((eachClass) => {
        const timeAStart = moment([eachClass.fromTime.slice(0, 2), eachClass.fromTime.slice(3, 5)], 'HH:mm');
        const timeAEnd = moment([eachClass.toTime.slice(0, 2), eachClass.toTime.slice(3, 5)], 'HH:mm');

        const timeBStart = moment([addedClass.fromTime.slice(0, 2), addedClass.fromTime.slice(3, 5)], 'HH:mm');
        const timeBEnd = moment([addedClass.toTime.slice(0, 2), addedClass.toTime.slice(3, 5)], 'HH:mm');

        const range1 = moment.range(timeAStart, timeAEnd);
        const range2 = moment.range(timeBStart, timeBEnd);

        if (new Date(eachClass.date).getTime() === addedClass.date.getTime() && range1.overlaps(range2)) {
          hasConflict = true;
        }
      });

      if (!hasConflict) {
        const updatedSchedules = [...localSchedule, formattedData];
        setLocalSchedule(
          updatedSchedules.sort(
            (class1, class2) =>
              new Date(`${fDate(class1.date, 'MMMM dd, yyyy')} ${class1.fromTime}:00`) -
              new Date(`${fDate(class2.date, 'MMMM dd, yyyy')} ${class2.fromTime}:00`)
          )
        );
        return 'success';
      }

      enqueueSnackbar('Selected time overlaps with existing schedules', { variant: 'error' });
      return 'error';
    } catch (error) {
      console.error(error);
      enqueueSnackbar(error.message, { variant: 'error' });
      return 'error';
    }
  };

  const handleOpenEditDialog = (row) => {
    const formattedRow = {
      date: new Date(row.date),
      hourPerClass: Math.abs(parseInt(row.fromTime.slice(0, 2), 10) - parseInt(row.toTime.slice(0, 2), 10)).toString(),
      fromTime: row.fromTime,
      toTime: row.toTime,
      teacher: { id: row.teacherPrivateClass?.teacherId || '' },
      method: _.capitalize(row.method),
      id: row?.id || '',
    };

    setSelectedStudents(row.studentPrivateClasses);
    setSelectedClass(formattedRow);
    setOpenEditClassDialog(true);
  };

  const handleCloseEditClassDialog = () => {
    setSelectedClass({});
    setOpenEditClassDialog(false);
  };

  const handleEditClass = async (newClass) => {
    let hasConflict = false;

    let previousData = {};
    if (newClass.id !== '') {
      previousData = localSchedule.find((eachClass) => eachClass?.id === selectedClass?.id);
    } else {
      previousData = localSchedule.find(
        (eachClass) =>
          new Date(eachClass.date).getTime() === new Date(selectedClass.date).getTime() &&
          eachClass.fromTime === selectedClass.fromTime &&
          eachClass.toTime === selectedClass.toTime
      );
    }
    const filteredSchedules = localSchedule.filter((eachSchedule) => {
      return eachSchedule !== previousData;
    });

    await filteredSchedules.forEach((eachClass) => {
      const timeAStart = moment([eachClass.fromTime.slice(0, 2), eachClass.fromTime.slice(3, 5)], 'HH:mm');
      const timeAEnd = moment([eachClass.toTime.slice(0, 2), eachClass.toTime.slice(3, 5)], 'HH:mm');

      const timeBStart = moment([newClass.fromTime.slice(0, 2), newClass.fromTime.slice(3, 5)], 'HH:mm');
      const timeBEnd = moment([newClass.toTime.slice(0, 2), newClass.toTime.slice(3, 5)], 'HH:mm');

      const range1 = moment.range(timeAStart, timeAEnd);
      const range2 = moment.range(timeBStart, timeBEnd);

      if (new Date(eachClass.date).getTime() === newClass.date.getTime() && range1.overlaps(range2)) {
        hasConflict = true;
      }
    });

    if (!hasConflict) {
      // If old class then ...
      const formattedData = {
        id: newClass?.id || '',
        room: previousData.room,
        method: newClass.method,
        date: fDate(newClass.date, 'dd-MMM-yyyy'),
        fromTime: newClass.fromTime,
        toTime: newClass.toTime,
        studentPrivateClasses: previousData.studentPrivateClasses.map((student) => ({
          id: student.id,
          studentId: student.studentId,
          attendance: student.attendance,
        })),
        teacherPrivateClass: {
          id: previousData.teacherPrivateClass.id,
          teacherId: newClass.teacher.id,
          workType: newClass.teacher.workType,
          nickname: newClass.teacher.nickname,
          status: previousData.teacherPrivateClass.status,
        },
        classStatus: typeof newClass.id === 'number' ? 'edit' : 'new',
      };

      if (newClass?.id !== '') {
        setEdittedClassList([...edittedClassList, formattedData]);
      }
      const updatedSchedules = [...filteredSchedules, formattedData];
      setLocalSchedule(
        updatedSchedules.sort(
          (class1, class2) =>
            new Date(`${fDate(class1.date, 'MMMM dd, yyyy')} ${class1.fromTime}:00`) -
            new Date(`${fDate(class2.date, 'MMMM dd, yyyy')} ${class2.fromTime}:00`)
        )
      );
      setOpenEditClassDialog(false);
      setSelectedClass({});
    } else {
      enqueueSnackbar('Selected time overlaps with existing schedules', { variant: 'error' });
    }
  };

  const handleDelete = (deletedClass, students) => {
    try {
      let previousData = {};
      if (deletedClass.id !== '') {
        previousData = localSchedule.find((eachClass) => eachClass?.id === deletedClass.id);
      } else {
        previousData = localSchedule.find(
          (eachClass) =>
            new Date(eachClass.date).getTime() === new Date(deletedClass.date).getTime() &&
            eachClass.fromTime === deletedClass.fromTime &&
            eachClass.toTime === deletedClass.toTime
        );
      }

      // let formattedData = {};
      let filteredSchedules = [];
      // If old class
      if (deletedClass.id !== '') {
        setDeletedClassList([...deletedClassList, deletedClass]);
        filteredSchedules = localSchedule.filter((eachSchedule) => eachSchedule?.id !== deletedClass.id);
        setLocalSchedule(
          filteredSchedules.sort(
            (class1, class2) =>
              new Date(`${fDate(class1.date, 'MMMM dd, yyyy')} ${class1.fromTime}:00`) -
              new Date(`${fDate(class2.date, 'MMMM dd, yyyy')} ${class2.fromTime}:00`)
          )
        );
      } else {
        filteredSchedules = localSchedule.filter((eachSchedule) => eachSchedule !== previousData);
        setLocalSchedule(
          filteredSchedules.sort(
            (class1, class2) =>
              new Date(`${fDate(class1.date, 'MMMM dd, yyyy')} ${class1.fromTime}:00`) -
              new Date(`${fDate(class2.date, 'MMMM dd, yyyy')} ${class2.fromTime}:00`)
          )
        );
      }
    } catch (error) {
      enqueueSnackbar(error.message, { variant: 'error' });
    }
  };

  const handleCloseDeleteDialog = () => {
    setDeletedClass({});
    setOpenDeleteClassDialog(false);
  };

  const handleSaveChanges = async () => {
    setIsSubmitting(true);
    try {
      const addedClasses = localSchedule.filter((eachClass) => eachClass.id === '');

      if (deletedClassList.length > 0) {
        const formattedDeletedClasses = deletedClassList.map((eachClass) => eachClass.id);

        let deleteFormatURL = '';
        formattedDeletedClasses.forEach((eachClassId) => {
          deleteFormatURL = deleteFormatURL.concat(`listOfClassId=${eachClassId.toString()}`, '&');
        });

        const deleteFinalFormatURL = `${HOG_API}/api/Schedule/ListOfClass/Delete?${deleteFormatURL.slice(0, -1)}`;
        // console.log('final format delete', deleteFinalFormatURL)
        await axios
          .delete(deleteFinalFormatURL)
          // .then((res) => console.log(res))
          .catch((error) => {
            throw error;
          });
      }

      if (edittedClassList.length > 0) {
        const formattedEdittedClasses = edittedClassList.map((eachClass) => ({
          id: eachClass.id,
          room: eachClass.room,
          method: eachClass.method,
          date: eachClass.date,
          fromTime: eachClass.fromTime,
          toTime: eachClass.toTime,
          teacherPrivateClass: {
            id: eachClass.teacherPrivateClass.id,
            teacherId: eachClass.teacherPrivateClass.teacherId,
            workType: eachClass.teacherPrivateClass.workType,
            status: eachClass.teacherPrivateClass.status,
          },
        }));
        await axios.put(`${HOG_API}/api/Schedule/ListOfClass/Put`, formattedEdittedClasses).catch((error) => {
          throw error;
        });
      }

      if (addedClasses.length > 0) {
        const formattedAddedClasses = addedClasses.map((eachClass) => ({
          courseId: selectedCourse.id,
          privateClass: {
            room: '',
            method: eachClass.method,
            date: eachClass.date,
            fromTime: eachClass.fromTime,
            toTime: eachClass.toTime,
            studentPrivateClasses: eachClass.studentPrivateClasses,
            teacherPrivateClass: {
              teacherId: eachClass.teacherPrivateClass.teacherId,
              workType: eachClass.teacherPrivateClass.workType,
              status: eachClass.teacherPrivateClass.status,
            },
          },
        }));
        await axios.post(`${HOG_API}/api/Schedule/ListOfClass/Post`, formattedAddedClasses).catch((error) => {
          throw error;
        });
      }
      navigate(0);
      setIsSubmitting(false);
    } catch (error) {
      console.error(error);
      setIsSubmitting(false);
      enqueueSnackbar(error.message, { variant: 'error' });
    }
  };

  const calculateTotalHour = (schedule) => {
    let HoursCount = 0;
    schedule.forEach((eachSchedule) => {
      const timeA = moment([eachSchedule.fromTime.slice(0, 2), eachSchedule.fromTime.slice(3, 5)], 'HH:mm');
      const timeB = moment([eachSchedule.toTime.slice(0, 2), eachSchedule.toTime.slice(3, 5)], 'HH:mm');
      HoursCount += timeB.diff(timeA, 'hours');
    });
    return HoursCount;
  };

  const weekday = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

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
      padding: role === 'Education Admin' ? 5 : 16,
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

  const customTextFieldStyle = {
    fontSize: '0.9rem',
  };

  let displayAccumulatedHours = 0;

  function accumulatedHours() {
    let HoursCount = 0;
    localSchedule.forEach((eachSchedule) => {
      const timeA = moment([eachSchedule.fromTime.slice(0, 2), eachSchedule.fromTime.slice(3, 5)], 'HH:mm');
      const timeB = moment([eachSchedule.toTime.slice(0, 2), eachSchedule.toTime.slice(3, 5)], 'HH:mm');
      HoursCount += timeB.diff(timeA, 'hours');
    });
    return HoursCount;
  }

  return (
    <Dialog fullWidth maxWidth="xl" open={open} onClose={onClose}>
      <Scrollbar>
        <Grid container direction="row" sx={{ p: 3, pb: 1 }} spacing={2}>
          <Grid container item xs={12} md={12} justifyContent="space-between" alignItems="center">
            <Typography variant="h6">{`Edit Class (${section})`}</Typography>
            <IconButton variant="h6" onClick={onClose}>
              {' '}
              <CloseIcon />{' '}
            </IconButton>
          </Grid>
        </Grid>

        <Grid container direction="row" sx={{ px: 3, mb: 3 }} spacing={2}>
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
                      style: customTextFieldStyle,
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
                      style: customTextFieldStyle,
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
                    value={_.capitalize(selectedCourse.method)}
                    label="Learning Method"
                    disabled
                    inputProps={{
                      style: { textTransform: 'capitalize', fontSize: '0.9rem' },
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
                      style: customTextFieldStyle,
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
                      style: customTextFieldStyle,
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
                      style: customTextFieldStyle,
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
                      style: customTextFieldStyle,
                    }}
                  />
                </Grid>
              </Grid>
            </Stack>
          </Grid>

          <Grid item xs={12} md={7}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{ mb: role === 'Education Admin' ? 1 : 2 }}
            >
              <Typography variant="h6" sx={{ mb: role === 'Education Admin' ? 0.8 : 0 }}>
                Classes & Schedules
              </Typography>
            </Stack>

            {role === 'Education Admin' && (
              <AddClassSection
                students={selectedStudents}
                hourPerClass={selectedCourse.hourPerClass}
                onAdd={handleAddClass}
                deletedClassList={deletedClassList}
                edittedClassList={edittedClassList}
                courseCustom
              />
            )}

            <Scrollbar sx={{ maxHeight: '25rem', pr: 1.5 }}>
              {localSchedule.length > 0 && (
                <TableContainer component={Paper}>
                  <Table sx={{ width: '100%' }}>
                    <TableHead>
                      <TableRow>
                        <StyledTableCell align="center">No.</StyledTableCell>
                        <StyledTableCell align="center">Day</StyledTableCell>
                        <StyledTableCell align="center">Date</StyledTableCell>
                        <StyledTableCell colSpan={2} align="center">
                          Time
                        </StyledTableCell>
                        <StyledTableCell align="center">Method</StyledTableCell>
                        <StyledTableCell align="center">Teacher</StyledTableCell>
                        <StyledTableCell align="center">Hours</StyledTableCell>
                        {role === 'Education Admin' && <StyledTableCell align="center" />}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {localSchedule.map((eachClass, index) => {
                        const timeA = moment([eachClass.fromTime.slice(0, 2), eachClass.fromTime.slice(3, 5)], 'HH:mm');
                        const timeB = moment([eachClass.toTime.slice(0, 2), eachClass.toTime.slice(3, 5)], 'HH:mm');
                        const hourPerClass = timeB.diff(timeA, 'hours');
                        displayAccumulatedHours += hourPerClass;
                        const classDate = new Date(eachClass.date);
                        if (eachClass.classStatus !== 'delete') {
                          return (
                            <StyledTableRow
                              key={index}
                              sx={{ backgroundColor: eachClass.teacherPrivateClass.workType !== 'Normal' && '#D6E4FF' }}
                            >
                              <StyledTableCell component="th" scope="row" align="center">
                                {(index + 1).toString()}
                              </StyledTableCell>
                              <StyledTableCell align="center">
                                {' '}
                                {weekday[classDate.getDay()].slice(0, 3)}{' '}
                              </StyledTableCell>
                              <StyledTableCell align="center">{fDate(classDate, 'dd-MMM-yyyy')}</StyledTableCell>
                              <StyledTableCell align="center">
                                {eachClass.fromTime} - {eachClass.toTime}
                              </StyledTableCell>
                              <StyledTableCell sx={{ width: '8%' }} align="center">
                                {hourPerClass.toString()}
                              </StyledTableCell>
                              <StyledTableCell align="center">{_.capitalize(eachClass.method)}</StyledTableCell>
                              <StyledTableCell sx={{ width: '15%' }} align="center">
                                {eachClass.teacherPrivateClass?.nickname.toUpperCase() || ''}
                                {!!eachClass.teacherPrivateClass?.workType
                                  ? eachClass.teacherPrivateClass.workType !== 'Normal' &&
                                    `(${eachClass.teacherPrivateClass.workType})`
                                  : ''}
                              </StyledTableCell>
                              <StyledTableCell align="center">{displayAccumulatedHours.toString()}</StyledTableCell>
                              {role === 'Education Admin' && (
                                <StyledTableCell align="center">
                                  <IconButton onClick={() => handleOpenEditDialog(eachClass, index)}>
                                    <EditIcon fontSize="small" />
                                  </IconButton>
                                </StyledTableCell>
                              )}
                            </StyledTableRow>
                          );
                        }
                        return null;
                      })}
                      <StyledTableRow>
                        <StyledTableCell colSpan={7} align="center">
                          TOTAL
                        </StyledTableCell>
                        <StyledTableCell align="center">{accumulatedHours()}</StyledTableCell>
                        {role === 'Education Admin' && <StyledTableCell align="center" />}
                      </StyledTableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Scrollbar>
          </Grid>

          {role === 'Education Admin' && (
            <Grid container item justifyContent="flex-end" xs={12} md={12} sx={{ mr: 1 }}>
              <LoadingButton variant="contained" color="primary" size="large" onClick={() => setOpenSaveChangesDialog(true)}>
                Save Changes
              </LoadingButton>
            </Grid>
          )}
        </Grid>

        <Dialog fullWidth maxWidth="sm" open={openSaveChangesDialog} onClose={() => setOpenSaveChangesDialog(false)}>
          <DialogTitle>Save Changes?</DialogTitle>
          <DialogContent>Are you sure you want save changes for the schedule?</DialogContent>
          <DialogActions>
            <Stack direction="row" justifyContent="flex-end" spacing={2}>
              <Button
                variant="outlined"
                disabled={isSubmitting}
                color="inherit"
                onClick={() => setOpenSaveChangesDialog(false)}
              >
                Cancel
              </Button>
              <LoadingButton loading={isSubmitting} variant="contained" color="primary" onClick={handleSaveChanges}>
                Confirm
              </LoadingButton>
            </Stack>
          </DialogActions>
        </Dialog>

        {Object.keys(selectedClass).length > 0 && (
          <EditClassDialog
            open={openEditClassDialog}
            close={handleCloseEditClassDialog}
            schedule={selectedClass}
            students={selectedStudents}
            hourPerClass={selectedCourse.hourPerClass}
            onEdit={handleEditClass}
            onDelete={handleDelete}
            deletedClassList={deletedClassList}
            edittedClassList={edittedClassList}
            courseCustom
          />
        )}
      </Scrollbar>
    </Dialog>
  );
}
