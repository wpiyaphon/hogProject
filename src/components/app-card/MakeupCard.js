import PropTypes from 'prop-types';
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
// @mui
import { Card, CardActions, CardContent, Grid, Typography, Box, Button, Divider, Link, Stack } from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
//
import { Icon } from '@iconify/react';
// utils
import { fDate } from '../../utils/formatTime';

MakeupCard.propTypes = {
    slot: PropTypes.object,
    select: PropTypes.func
};

export default function MakeupCard({ slot, select }) {
    const {
        date,
        fromTime,
        toTime
    } = slot;

    return (
        <Grid container>
            <Box display="inline-block" sx={{ width: '100%' }}>
                <Card
                    variant="outlined"
                    sx={{ display: 'flex', justifyContent: 'space-between', borderRadius: 1, cursor: "pointer", px: 2, py: 1.5 }}
                    onClick={() => select(slot)}>
                    <Stack direction="column">
                        <Typography component="div">
                            {fDate(date, 'dd MMMM yyyy')}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {fromTime} - {toTime}
                        </Typography>
                    </Stack>
                </Card>
            </Box>
        </Grid>
    )
}