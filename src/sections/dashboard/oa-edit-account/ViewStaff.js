import PropTypes from 'prop-types';
import { useState } from 'react';
import { useNavigate } from 'react-router';
// form
import { useForm } from 'react-hook-form';
// @mui
import { Card, Grid, Stack, Typography, Button } from '@mui/material';
// components
import FormProvider, { RHFTextField } from '../../../components/hook-form';
import ResetPasswordDialog from '../../../components/ResetPasswordDialog';
//
import DisableAccountDialog from './DisableAccountDialog';
import ActivateAccountDialog from './ActivateAccountDialog';
import { useAuthContext } from '../../../auth/useAuthContext';

// ----------------------------------------------------------------------
ViewStaff.propTypes = {
    currentStaff: PropTypes.object
}

export default function ViewStaff({ currentStaff }) {
    const navigate = useNavigate();
    const { user } = useAuthContext();

    const [openResetPasswordDialog, setOpenResetPasswordDialog] = useState(false);
    const [openDeleteAccountDialog, setOpenDeleteAccountDialog] = useState(false);
    const [openActivateAccountDialog, setOpenActivateAccountDialog] = useState(false);

    const defaultValues = {
        role: currentStaff?.role || '',
        fName: currentStaff?.fName || '',
        lName: currentStaff?.lName || '',
        nickname: currentStaff?.nickname || '',
        phone: currentStaff?.phone || '',
        line: currentStaff?.line || '',
        email: currentStaff?.email || '',
    };

    const methods = useForm({
        defaultValues
    });

    const handleClickEdit = () => {
        navigate(`/account/staff-management/staff/${currentStaff.id}/edit`);
    };

    // console.log(currentStaff);

    return (
        <FormProvider methods={methods}>
            <Card sx={{ p: 3 }}>
                <Typography variant="h6"
                    sx={{
                        mb: 2,
                        display: 'block',
                    }}
                >
                    {`Staff detail (${currentStaff.role})`}
                </Typography>

                <Grid direction="row" container spacing={2}>
                    <Grid item xs={12} md={4}>
                        <RHFTextField name="fName" label="First name" disabled />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <RHFTextField name="lName" label="Last name" disabled />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <RHFTextField name="nickname" label="Nickname" disabled />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <RHFTextField name="phone" label="Phone number" disabled />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <RHFTextField name="line" label="Line ID" disabled />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <RHFTextField name="email" label="Email" disabled />
                    </Grid>

                    <Grid item xs={12} md={12} sx={{ mt: 2 }}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                            {currentStaff.id !== user.id ? (
                                currentStaff.isActive ? (
                                    <Button
                                        variant="contained"
                                        color='error'
                                        onClick={() => setOpenDeleteAccountDialog(true)}
                                    >
                                        Disable Account
                                    </Button>
                                ) : (
                                    <Button
                                        variant="contained"
                                        color='success'
                                        onClick={() => setOpenActivateAccountDialog(true)}
                                    >
                                        Activate Account
                                    </Button>
                                ) 
                            ) : (
                                <Stack />
                            )}

                            <Stack direction="row" justifyContent="flex-end" alignItems="center" spacing={1}>
                                <Button
                                    variant="outlined"
                                    color="inherit"
                                    onClick={() => setOpenResetPasswordDialog(true)}
                                >
                                    Reset password
                                </Button>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleClickEdit}
                                >
                                    Edit
                                </Button>
                            </Stack>
                        </Stack>
                    </Grid>
                </Grid>
            </Card>

            <ResetPasswordDialog
                open={openResetPasswordDialog}
                onClose={() => setOpenResetPasswordDialog(false)}
                email={currentStaff.email}
            />

            <DisableAccountDialog
                accountId={currentStaff.id.toString()}
                accountRole={currentStaff.role}
                accountName={currentStaff.fName}
                open={openDeleteAccountDialog}
                onClose={() => setOpenDeleteAccountDialog(false)}
            />

            <ActivateAccountDialog
                accountId={currentStaff.id.toString()}
                accountRole={currentStaff.role}
                accountName={currentStaff.fName}
                open={openActivateAccountDialog}
                onClose={() => setOpenActivateAccountDialog(false)}
            />
        </FormProvider >
    )
}