import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';

// @mui
import { Table, Tooltip, TableRow, TableBody, TableCell, IconButton, TableContainer, Box } from '@mui/material';
// components
import axios from 'axios';
import Iconify from '../../../components/iconify';
import Scrollbar from '../../../components/scrollbar';
import { useTable, getComparator, TableHeadCustom, TablePaginationCustom } from '../../../components/table';
import Label from '../../../components/label';
//
import { HOG_API } from '../../../config';

import ToolbarStudentSearch from './ToolbarStudentSearch';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'id', label: 'Student ID', align: 'left' },
  { id: 'fullname', label: 'Fullname  ', align: 'left' },
  { id: 'nickname', label: 'Nickname  ', align: 'left' },
  { id: 'status', label: 'Status', align: 'left' },
  { id: '' },
];

// ----------------------------------------------------------------------
StudentList.propTypes = {
  studentTableData: PropTypes.array,
};

export default function StudentList({ studentTableData }) {
  const navigate = useNavigate();

  const {
    dense,
    page,
    order,
    orderBy,
    rowsPerPage,
    //
    onChangeDense,
    onChangePage,
    onChangeRowsPerPage,
  } = useTable({
    defaultOrderBy: 'studentId',
  });

  const [tableData, setTableData] = useState(studentTableData);

  const [filterValue, setFilterValue] = useState('');

  const [openConfirm, setOpenConfirm] = useState(false);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(order, orderBy),
    filterValue,
  });

  // Filter
  const [openFilter, setOpenFilter] = useState(false);

  const isFiltered = filterValue !== '';
  const isNotFound = !dataFiltered.length && !!filterValue;

  const defaultValues = {
    gender: [],
  };

  const methods = useForm({
    defaultValues,
  });

  const {
    reset,
    watch,
    formState: { dirtyFields },
  } = methods;

  const isDefault = !dirtyFields.gender || false;

  const values = watch();

  const handleResetFilter = () => {
    reset();
  };

  const handleOpenFilter = () => {
    setOpenFilter(true);
  };

  const handleCloseFilter = () => {
    setOpenFilter(false);
  };

  const handleFilterValue = (event) => {
    setFilterValue(event.target.value);
  };

  return (
    <div>
      <ToolbarStudentSearch
        isFiltered={isFiltered}
        filterValue={filterValue}
        onFilterValue={handleFilterValue}
        isDefault={isDefault}
        open={openFilter}
        onOpen={handleOpenFilter}
        onClose={handleCloseFilter}
        onResetFilter={handleResetFilter}
      />

      <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
        <Scrollbar>
          <Table size={dense ? 'small' : 'medium'} sx={{ minWidth: 800 }}>
            <TableHeadCustom headLabel={TABLE_HEAD} />
            <TableBody>
              {dataFiltered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
                <TableRow
                  hover
                  key={index}
                  onClick={() => navigate(`/account/student-management/student/${row.id}`)}
                  sx={{ cursor: 'pointer' }}
                >
                  <TableCell align="left">{row.studentId}</TableCell>
                  <TableCell align="left">{row.fullName}</TableCell>
                  <TableCell align="left">{row.nickname}</TableCell>
                  <TableCell align="left">
                    <Label
                      variant="soft"
                      color={(row.isActive && 'success') || 'error'}
                      sx={{ textTransform: 'capitalize' }}
                    >
                      {row.isActive ? 'Active' : 'Inactive'}
                    </Label>
                  </TableCell>
                  <TableCell align="right">
                    <Iconify icon="ic:chevron-right" sx={{ mr: 5 }} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Scrollbar>
      </TableContainer>

      <TablePaginationCustom
        count={dataFiltered.length}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={onChangePage}
        onRowsPerPageChange={onChangeRowsPerPage}
      />
    </div>
  );
}

// ----------------------------------------------------------------------

function applyFilter({ inputData, comparator, filterValue }) {
  const stabilizedThis = inputData.map((el, index) => [el, index]);
  // console.log('inputData', inputData)

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);

    if (order !== 0) return order;

    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (filterValue) {
    inputData = inputData.filter((user) => {
      return (
        user.fullName.toLowerCase().indexOf(filterValue.toLowerCase()) !== -1 ||
        user.nickname.toLowerCase().indexOf(filterValue.toLowerCase()) !== -1 ||
        user.studentId.toLowerCase().indexOf(filterValue.toLowerCase()) !== -1
      );
    });
  }

  return inputData;
}
