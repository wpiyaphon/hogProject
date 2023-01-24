import PropTypes from 'prop-types';
import {
  InputAdornment, TextField, Tooltip, Typography,
  IconButton, Stack, Button, Drawer, Box, Divider,
  List, ListItem, ListItemButton, ListItemText, MenuItem, Checkbox,Badge
} from '@mui/material';
import { useState, React } from 'react'
import { Controller, useFormContext } from 'react-hook-form';
import { alpha } from '@mui/material/styles';
// components
import Iconify from '../../../components/iconify';
import Scrollbar from '../../../components/scrollbar';
import { RHFMultiCheckbox, RHFTextField} from '../../../components/hook-form';


// ----------------------------------------------------------------------

export const FILTER_GENDER_OPTIONS = [
  { label: 'Men', value: 'Men' },
  { label: 'Women', value: 'Women' },
  { label: 'Kids', value: 'Kids' },
];



// ----------------------------------------------------------------------
// const onSelected = (selected, item) =>
//   selected.includes(item) ? selected.filter((value) => value !== item) : [...selected, item];

SortingSelectingToolbar.propTypes = {
  open: PropTypes.bool,
  onOpen: PropTypes.func,
  onClose: PropTypes.func,
  isDefault: PropTypes.bool,
  onResetFilter: PropTypes.func,
  filterValue: PropTypes.string,
  onFilterValue: PropTypes.func,
};



// Filter


export default function SortingSelectingToolbar({ filterValue, onFilterValue, open, onOpen, onClose, isDefault, onResetFilter }) {
  // const { control } = useFormContext();
const [groupchecked, setGroupChecked] = useState(false);
const [privatechecked, setPrivateChecked] = useState(false);
const [semiprivatechecked, setSemiprivateChecked] = useState(false);

const handleGroupChange = (event) => {
  setGroupChecked(event.target.checked);
};
const handlePrivateChange = (event) => {
  setPrivateChecked(event.target.checked);
};
const handleSemiChange = (event) => {
  setSemiprivateChecked(event.target.checked);
};
  return (
    <>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ p: 3 }}>
        <TextField value={filterValue}
        onChange={onFilterValue} id="search-student" label="Search" variant="outlined" sx={{ width: 980 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon="ic:search" />
              </InputAdornment>
            ),
          }} />
        <Tooltip title="Filter list">
          <Button sx={{ p: 2, m: 2 }} variant='outlined' onClick={onOpen} endIcon={<Iconify icon="ic:round-filter-list" />}>
            <Typography>Filter</Typography>
          </Button>
        </Tooltip>
      </Stack>
      
      <Drawer
        anchor="right"
        open={open}
        onClose={onClose}
        BackdropProps={{
          invisible: true,
        }}
      >
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ pl: 2, pr: 1, py: 2 }}>
          <Typography variant="subtitle1">Filters</Typography>

          <IconButton onClick={onClose}>
            <Iconify icon="eva:close-fill" />
          </IconButton>
        </Stack>

        <Divider />

        <Scrollbar>
          <Stack spacing={3} sx={{ p: 2.5 }}>
            <Stack spacing={1}>
              <Typography variant="subtitle1"> Gender </Typography>
              {/* s<RHFMultiCheckbox name="gender" options={FILTER_GENDER_OPTIONS} sx={{ width: 1 }} /> */}
            </Stack>
          </Stack>
        </Scrollbar>

        <Box sx={{ p: 2.5 }}>
          <Badge
            color="error"
            variant="dot"
            anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
            invisible={isDefault}
            sx={{ width: 1 }}
          >
            <Button
              fullWidth
              size="large"
              type="submit"
              color="inherit"
              variant="outlined"
              onClick={onResetFilter}
              startIcon={<Iconify icon="eva:trash-2-outline" />}
            >
              Clear
            </Button>
          </Badge>
        </Box>
      </Drawer>


    </>

  );
}
