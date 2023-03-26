import PropTypes from 'prop-types';
import { useState } from 'react';
import * as Yup from 'yup';
import { useNavigate } from 'react-router';
// @mui
import axios from 'axios';
import { LoadingButton } from '@mui/lab';
import { Stack, Typography, Dialog, Button, DialogTitle, DialogContent, DialogActions } from '@mui/material';
// components
import { useSnackbar } from '../../../components/snackbar';
import { HOG_API } from '../../../config';
import { useAuthContext } from '../../../auth/useAuthContext';

DisableAccountDialog.propTypes = {
    accountId: PropTypes.string,
    accountRole: PropTypes.string,
    accountName: PropTypes.string,
    open: PropTypes.bool,
    onClose: PropTypes.func,
}

export default function DisableAccountDialog({ accountId, accountRole, accountName, open, onClose }) {
    const { enqueueSnackbar } = useSnackbar();
    const { user } = useAuthContext();

    axios.defaults.headers.common.Authorization = `Bearer ${user.accessToken}`

    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const element = document.querySelector('#delete-request-error-handling .status');

    const handleDelete = async () => {
        setIsSubmitting(true);

        try {
            // console.log(accountId, accountRole, accountName)
            if (accountRole === 'Teacher') {
                await axios.delete(`${HOG_API}/api/Teacher/Disable/${accountId}`)
                    .catch((error) => {
                        throw error;
                    })
                enqueueSnackbar("Disable the account successfully", { variant: 'success' });
                navigate('/account/teacher-management/teacher')
            } else {
                await axios.delete(`${HOG_API}/api/Staff/Disable/${accountId}`)
                    .catch((error) => {
                        throw error;
                    })
                enqueueSnackbar("Disable the account successfully", { variant: 'success' });
                navigate('/account/staff-management/staff')
            }
        } catch (error) {
            console.error('There was an error!', error);
            element.parentElement.innerHTML = `Error: ${error.message}`;
        }

        setIsSubmitting(false);
    };



    return (
        <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose}>
            <DialogTitle>
                <Stack direction="row" alignItems="center" justifyContent="flex-start" spacing={2}>
                    <Typography variant='h4'>Disable Account?</Typography>
                </Stack>
            </DialogTitle>
            <DialogContent>
                {`Once disabled, ${accountName}'s account will no longer be accessible.`}
            </DialogContent>
            <DialogActions>
                <Button
                    variant="outlined"
                    color="inherit"
                    onClick={onClose}
                >
                    Cancel
                </Button>
                <LoadingButton
                    type="submit"
                    variant="contained"
                    color="error"
                    loading={isSubmitting}
                    onClick={handleDelete}
                >
                    Disable
                </LoadingButton>
            </DialogActions>
        </Dialog>
    )
}