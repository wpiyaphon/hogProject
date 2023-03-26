import PropTypes from 'prop-types';
import { useState } from 'react';
import axios from 'axios';
import { LoadingButton } from '@mui/lab';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button
} from '@mui/material';
// auth
import { useAuthContext } from '../auth/useAuthContext';
// components
import { useSnackbar } from './snackbar';
//
import { HOG_API } from '../config';

ResetPasswordDialog.propTypes = {
    open: PropTypes.bool,
    onClose: PropTypes.func,
    email: PropTypes.string,
}

export default function ResetPasswordDialog({ open, onClose, email }) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { enqueueSnackbar } = useSnackbar();
    const { user } = useAuthContext();

    axios.defaults.headers.common.Authorization = `Bearer ${user.accessToken}`

    const handleResetPassword = async () => {
        setIsSubmitting(true);
        try {
            await axios.post(`${HOG_API}/api/Auth/ResetPassword?email=${encodeURIComponent(email)}`)
                .catch((error) => {
                    throw error;
                })
            setIsSubmitting(false);
            enqueueSnackbar('Successfully sent reset password request', { variant: 'success' });
            onClose();

        } catch (error) {
            console.error(error);
            setIsSubmitting(false);
            enqueueSnackbar(error.message, { variant: 'error' });
        }
    }

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>
                Reset Password?
            </DialogTitle>
            <DialogContent>
                Once clicked reset, the reset password request will be sent to user's email address.
            </DialogContent>
            <DialogActions>
                <Button variant="outlined" color="inherit" onClick={onClose}>
                    Cancel
                </Button>
                <LoadingButton loading={isSubmitting} variant="contained" color="inherit" onClick={handleResetPassword}>
                    Reset
                </LoadingButton>
            </DialogActions>
        </Dialog>
    )
}