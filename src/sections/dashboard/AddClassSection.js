import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import axios from 'axios';
import _ from 'lodash';
import { useNavigate } from 'react-router';
// form
import { useForm, Controller } from 'react-hook-form';
// @mui
import { DatePicker } from '@mui/x-date-pickers';
import { LoadingButton } from '@mui/lab';
import CircularProgress from '@mui/material/CircularProgress';
import {
  Fade,
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
  DialogActions,
  InputAdornment,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import InfoIcon from '@mui/icons-material/Info';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
// auth
import { useAuthContext } from '../../auth/useAuthContext';
// utils
import { fDate } from '../../utils/formatTime';
// components
import { useSnackbar } from '../../components/snackbar';
import Scrollbar from '../../components/scrollbar/Scrollbar';
import FormProvider, { RHFSelect, RHFTextField } from '../../components/hook-form';
//
import { HOG_API } from '../../config';
// ----------------------------------------------------------------

AddClassSection.propTypes = {
  onAdd: PropTypes.func,
  hourPerClass: PropTypes.number,
  fromDate: PropTypes.string,
  toDate: PropTypes.string,
  method: PropTypes.string,
  students: PropTypes.array,
  deletedClassList: PropTypes.array,
  edittedClassList: PropTypes.array,
  courseCustom: PropTypes.bool,
};

export function AddClassSection({
  onAdd,
  hourPerClass,
  fromDate,
  toDate,
  method,
  students,
  deletedClassList,
  edittedClassList,
  courseCustom = false,
}) {
  const { user } = useAuthContext();

  const [isLoadingTime, setIsLoadingTime] = useState(false);
  const [isLoadingTeacher, setIsLoadingTeacher] = useState(false);
  const [availableTime, setAvailableTime] = useState();
  const [availableTeacher, setAvailableTeacher] = useState();

  const [editDeleteClassWithId, setEditDeleteClassWithId] = useState([]);

  axios.defaults.headers.common.Authorization = `Bearer ${user.accessToken}`;

  useEffect(() => {
    if (
      (deletedClassList !== undefined && deletedClassList.length > 0) ||
      (edittedClassList !== undefined && edittedClassList.length > 0)
    ) {
      setEditDeleteClassWithId([...deletedClassList, ...edittedClassList]);
    }
  }, []);

  const METHOD_OPTIONS = ['Onsite', 'Online'];

  const HOUR_OPTIONS = ['1', '2', '3'];

  const defaultValues = {
    classDate: '',
    classHour: '',
    classTime: '',
    classTeacher: '',
    classMethod: _.capitalize(method),
  };

  const methods = useForm({
    defaultValues,
  });

  const { control, reset, handleSubmit, setValue, watch, setFocus } = methods;

  const values = watch();

  const weekday = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const onSubmit = async (data) => {
    const newClass = {
      day: weekday[new Date(data.classDate).getDay()].slice(0, 3),
      date: data.classDate,
      hourPerClass: data.classHour,
      fromTime: data.classTime.slice(0, 5),
      toTime: data.classTime.slice(6, 11),
      method: data.classMethod,
      teacher: availableTeacher.find((eachTeacher) => eachTeacher.id === data.classTeacher),
    };

    const result = await onAdd(newClass);

    if (result === 'success') {
      resetValue();
      setFocus('classDate');
    }
  };

  const handleChangeDate = async (newDate) => {
    resetValue();
    setValue('classDate', newDate);
  };

  const handleChangeHourPerClass = (newHour) => {
    setAvailableTeacher();
    setAvailableTime();
    setValue('classHour', newHour);
    setValue('classTime', '');
    setValue('classTeacher', '');

    setIsLoadingTime(true);
    let studentList = '';
    students.forEach((eachStudent, index) => {
      studentList = studentList.concat(`listOfStudentId=${eachStudent.studentId}`, '&');
    });

    try {
      let sameDateClassId = 0;
      if (editDeleteClassWithId.length > 0) {
        editDeleteClassWithId.forEach((eachClass, index) => {
          if (new Date(eachClass.date).getTime() === new Date(values.classDate).getTime()) {
            sameDateClassId = eachClass.id;
          }
        });
      }

      if (courseCustom && sameDateClassId !== 0) {
        // console.log(`${HOG_API}/api/CheckAvailable/GetAvailableTime?${studentList}date=${fDate(values.classDate, 'dd-MMM-yyyy')}&hour=${newHour}&classId=${sameDateClassId}`)
        axios(
          `${HOG_API}/api/CheckAvailable/GetAvailableTime?${studentList}date=${fDate(
            values.classDate,
            'dd-MMM-yyyy'
          )}&hour=${newHour}&classId=${sameDateClassId}`
        )
          .then((res) => {
            // console.log('availableTime', res.data.data)
            setAvailableTime(res.data.data);
            setIsLoadingTime(false);
          })
          .catch((error) => {
            throw error;
          });
      } else {
        // console.log(`${HOG_API}/api/CheckAvailable/GetAvailableTime?${studentList}date=${fDate(values.classDate, 'dd-MMM-yyyy')}&hour=${newHour}&classId=0`)
        axios(
          `${HOG_API}/api/CheckAvailable/GetAvailableTime?${studentList}date=${fDate(
            values.classDate,
            'dd-MMM-yyyy'
          )}&hour=${newHour}&classId=0`
        )
          .then((res) => {
            setAvailableTime(res.data.data);
            setIsLoadingTime(false);
          })
          .catch((error) => {
            throw error;
          });
      }
    } catch (error) {
      console.error(error);
      setIsLoadingTime(false);
    }
  };

  const handleChangeTime = async (newTime) => {
    setAvailableTeacher();
    setValue('classTime', newTime);
    setValue('classTeacher', '');

    setIsLoadingTeacher(true);
    try {
      const fromTime = newTime.slice(0, 5).replace(':', '%3A');
      const toTime = newTime.slice(6, 11).replace(':', '%3A');

      let sameDateClassId = 0;
      if (editDeleteClassWithId.length > 0) {
        editDeleteClassWithId.forEach((eachClass, index) => {
          if (new Date(eachClass.date).getTime() === new Date(values.classDate).getTime()) {
            sameDateClassId = eachClass.id;
          }
        });
      }

      if (courseCustom && sameDateClassId !== 0) {
        axios(
          `${HOG_API}/api/CheckAvailable/GetAvailableTeacher?fromTime=${fromTime}&toTime=${toTime}&date=${fDate(
            values.classDate,
            'dd-MMM-yyyy'
          )}&classId=${sameDateClassId}`
        )
          .then((res) => {
            setAvailableTeacher(res.data.data);
            setIsLoadingTeacher(false);
          })
          .catch((error) => {
            throw error;
          });
      } else {
        // console.log(`${HOG_API}/api/CheckAvailable/GetAvailableTeacher?fromTime=${fromTime}&toTime=${toTime}&date=${fDate(values.classDate, 'dd-MMM-yyyy')}&classId=0`)
        axios(
          `${HOG_API}/api/CheckAvailable/GetAvailableTeacher?fromTime=${fromTime}&toTime=${toTime}&date=${fDate(
            values.classDate,
            'dd-MMM-yyyy'
          )}&classId=0`
        )
          .then((res) => {
            setAvailableTeacher(res.data.data);
            setIsLoadingTeacher(false);
          })
          .catch((error) => {
            throw error;
          });
      }
    } catch (error) {
      console.error(error);
      setIsLoadingTeacher(false);
    }
  };

  const resetValue = () => {
    setValue('classDate', null);
    setValue('classHour', '');
    setValue('classTime', '');
    setValue('classTeacher', '');
    setValue('classMethod', _.capitalize(method));
    setAvailableTime();
    setAvailableTeacher();
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container direction="row" spacing={2} sx={{ mb: 1.5, pr: 0.5 }}>
        <Grid item xs={6} md={2.5}>
          <Controller
            name="classDate"
            control={control}
            render={({ field, fieldState: { error } }) => {
              const fieldWithoutRef = { ...field, ref: undefined };
              return (
                <DatePicker
                  label="Date"
                  minDate={new Date(fromDate)}
                  maxDate={new Date(toDate)}
                  value={field.value}
                  onChange={handleChangeDate}
                  renderInput={(fieldWithoutRef) => (
                    <TextField
                      {...fieldWithoutRef}
                      inputRef={field.ref}
                      fullWidth
                      error={!!error}
                      helperText={error?.message}
                      required
                      autoComplete='off'
                    />
                  )}
                  disableOpenPicker
                  disableMaskedInput
                  inputFormat="dd/MM/yyyy"
                />
              );
            }}
          />
        </Grid>

        <Grid item xs={6} md={1.25}>
          <RHFSelect
            fullWidth
            name="classHour"
            label="Hrs."
            SelectProps={{ native: false, sx: { textTransform: 'capitalize' } }}
            onChange={(event) => handleChangeHourPerClass(event.target.value)}
            disabled={!values.classDate}
            required={!!values.classDate}
          >
            {HOUR_OPTIONS.map((eachHour, index) => (
              <MenuItem
                key={index}
                value={eachHour}
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
                {eachHour}
              </MenuItem>
            ))}
          </RHFSelect>
        </Grid>

        <Grid item xs={6} md={2.25}>
          {availableTime === undefined && !isLoadingTime && <TextField fullWidth label="Time" disabled />}
          {isLoadingTime && (
            <TextField
              fullWidth
              label="Time"
              disabled
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Box sx={{ display: 'flex' }}>
                      <CircularProgress size={20} />
                    </Box>
                  </InputAdornment>
                ),
              }}
            />
          )}
          {availableTime?.length === 0 && <TextField fullWidth label="Unavailable" disabled />}
          {availableTime?.length > 0 && (
            <RHFSelect
              fullWidth
              name="classTime"
              label="Time"
              SelectProps={{ native: false, sx: { textTransform: 'capitalize' } }}
              onChange={(event) => handleChangeTime(event.target.value)}
              required
            >
              {availableTime.map((eachTime, index) => (
                <MenuItem
                  key={index}
                  value={`${eachTime.fromTime}-${eachTime.toTime}`}
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
                  {`${eachTime.fromTime} - ${eachTime.toTime}`}
                </MenuItem>
              ))}
            </RHFSelect>
          )}
        </Grid>

        <Grid item xs={6} md={3}>
          {availableTeacher === undefined && !isLoadingTeacher && <TextField fullWidth label="Teacher" disabled />}
          {isLoadingTeacher && (
            <TextField
              fullWidth
              label="Teacher"
              disabled
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Box sx={{ display: 'flex' }}>
                      <CircularProgress size={20} />
                    </Box>
                  </InputAdornment>
                ),
              }}
            />
          )}

          {availableTeacher?.length === 0 && <TextField fullWidth label="Unavailable" disabled />}

          {availableTeacher?.length > 0 && (
            <RHFSelect
              fullWidth
              name="classTeacher"
              label="Teacher"
              SelectProps={{ native: false, sx: { textTransform: 'capitalize' } }}
              required
            >
              {availableTeacher.map((eachTeacher, index) => (
                <MenuItem
                  key={eachTeacher.id}
                  value={eachTeacher.id}
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
                  {`${eachTeacher.nickname.toUpperCase()} - ${eachTeacher.fName.toUpperCase()} (${
                    eachTeacher.workType
                  })`}
                </MenuItem>
              ))}
            </RHFSelect>
          )}
        </Grid>

        <Grid item xs={6} md={1.75}>
          <RHFSelect
            fullWidth
            name="classMethod"
            label="Method"
            SelectProps={{ native: false, sx: { textTransform: 'capitalize' } }}
            required
          >
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
        <Grid item xs={6} md={1.25}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={values.classTime === '' || values.classTeacher === '' || values.classMethod === ''}
            sx={{ height: '3.5rem' }}
          >
            Add
          </Button>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
