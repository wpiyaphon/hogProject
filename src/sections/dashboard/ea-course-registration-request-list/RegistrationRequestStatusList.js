import { useState, useEffect } from 'react';
import sumBy from 'lodash/sumBy';
// import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
// @mui
import { useTheme } from '@mui/material/styles';
import {
  Tab,
  Tabs,
  Card,
  Table,
  Button,
  Tooltip,
  Divider,
  TableBody,
  Container,
  IconButton,
  TableContainer,
  TableRow,
  TableCell, createTheme, ThemeProvider,
} from '@mui/material';
// utils
import { fTimestamp } from '../../../utils/formatTime';
// components
import Label from '../../../components/label';
import Iconify from '../../../components/iconify';
import Scrollbar from '../../../components/scrollbar';
import CustomBreadcrumbs from '../../../components/custom-breadcrumbs';
import { useSettingsContext } from '../../../components/settings';
import {
  useTable,
  getComparator,
  emptyRows,
  TableNoData,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from '../../../components/table';
// sections
import RegistrationTableToolbar from './RegistrationTableToolbar';
// import Condition from 'yup/lib/Condition';

// ----------------------------------------------------------------------

// {Condition=== true && ()}
// {Condition=== true ? () : (else)}

function createData(id, requestDate, courseType, section, registeredCourses, requestedBy, role, receipt) {
  return { id, requestDate, courseType, section, registeredCourses, requestedBy, role, receipt };
}

const TABLE_HEAD_REQUESTS = [
  { id: 'requestId', label: 'Request ID', align: 'left' },
  { id: 'requestDate', label: 'Request Date', align: 'left' },
  { id: 'courseType', label: 'Course Type', align: 'left' },
  { id: 'section ', label: 'Section', align: 'left', width: 200 },
  { id: 'registredCourses', label: 'Registered Courses(s)', align: 'left', width: 200 },
  { id: 'requestedBy', label: 'Requested by (EP)', align: 'left' },
  { id: 'incomplete' },
  { id: 'moreInfo' },
];

const TABLE_DATA_REQUESTS = [
  // Table {  RID,    Req Date ,     courseType,     section,           regiscourses, requestedBy,      role,   Receipt }
  createData('R032', '30-Oct-2022', 'Group', 'Class 20', 1, 'Nirawit(Boss)', 'available', 'completeReceipt'),
  createData('R014', '16-Nov-2022', 'Private', 'Thanatuch Lertritsirkul', 2, 'Nirawit(Boss)', 'myRequest', 'incompleteReceipt'),
  createData('R302', '28-Nov-2022', 'Private', 'Saw Zwe Wai Yan', 1, 'Nirawit(Boss)', 'available', ''),
  createData('R561', '30-Nov-2022', 'Semi Private', 'Semi Group 20', 1, 'Nirawit(Boss)', 'available', ''),
  createData('R592', '25-Dec-2022', 'Private', 'Piyaphon Wu', 2, 'Nirawit(Boss)', 'available', ''),
  createData('R777', '30-Dec-2022', 'Group', 'Class 23', 1, 'Nirawit(Boss)', 'myRequest', 'completeReceipt'),
  createData('R888', '15-Dec-2022', 'Group', 'Class 50', 1, 'Nirawit(Boss)', 'completed', ''),
  createData('R999', '18-Dec-2022', 'Private', 'Zain', 1, 'Nirawit(Boss)', 'rejected', ''),
  createData('R111', '27-Dec-2022', 'Private', 'Pan', 1, 'Nirawit(Boss)', 'completed', ''),
  createData('R222', '02-Dec-2022', 'Group', 'Class 80', 1, 'Nirawit(Boss)', 'rejected', ''),
  createData('R892', '02-Dec-2022', 'Private', 'Tar', 1, 'Nirawit(Boss)', 'rejected', ''),

];
const errorTheme = createTheme({
  palette: {
    primary: {
      main: '#D12E24',
    },
    secondary: {
      main: '#D12E24',
    },
  },
});

// ----------------------------------------------------------------------

export default function RegistrationRequestStatusList() {

  const { themeStretch } = useSettingsContext();

  const navigate = useNavigate();

  const {
    dense,
    page,
    order,
    orderBy,
    rowsPerPage,
    setPage,
    //
    selected,
    setSelected,
    onSelectRow,
    onSelectAllRows,
    //
    onSort,
    onChangeDense,
    onChangePage,
    onChangeRowsPerPage,
  } = useTable({ defaultOrderBy: 'createDate' });

  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    setTableData(TABLE_DATA_REQUESTS);
  }, []);

  const [filterName, setFilterName] = useState('');

  const [openConfirm, setOpenConfirm] = useState(false);

  const [filterRole, setFilterRole] = useState('available');

  const [currentRequest, setcurrentRequest] = useState([])

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(order, orderBy),
    filterName,
    filterRole,
  });

  const dataInPage = dataFiltered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const denseHeight = dense ? 56 : 76;

  const isFiltered =
    filterRole !== 'available' || filterName !== '';

  const isNotFound =
    (!dataFiltered.length && !!filterName) ||
    (!dataFiltered.length && !!filterRole);

  const getLengthByStatus = (role) => tableData.filter((item) => item.role === role).length;

  const TABS = [
    { value: 'available', label: 'Available Requests', color: 'warning', count: getLengthByStatus('available') },
    { value: 'myRequest', label: 'My Requests', color: 'warning', count: getLengthByStatus('myRequest') },
    { value: 'completed', label: 'Completed', count: getLengthByStatus('completed'), color: 'success' },
    { value: 'rejected', label: 'Rejected', count: getLengthByStatus('rejected'), color: 'error' },
  ];


  const handleOpenConfirm = () => {
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };


  const handleFilterRole = (event, newValue) => {
    setPage(0);
    setFilterRole(newValue);
  };

  const handleFilterName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const handleDeleteRow = (id) => {
    const deleteRow = tableData.filter((row) => row.id !== id);
    setSelected([]);
    setTableData(deleteRow);

    if (page > 0) {
      if (dataInPage.length < 2) {
        setPage(page - 1);
      }
    }
  };

  const handleDeleteRows = (selected) => {
    const deleteRows = tableData.filter((row) => !selected.includes(row.id));
    setSelected([]);
    setTableData(deleteRows);

    if (page > 0) {
      if (selected.length === dataInPage.length) {
        setPage(page - 1);
      } else if (selected.length === dataFiltered.length) {
        setPage(0);
      } else if (selected.length > dataInPage.length) {
        const newPage = Math.ceil((tableData.length - selected.length) / rowsPerPage) - 1;
        setPage(newPage);
      }
    }
  };

  const handleResetFilter = () => {
    setFilterName('');
    setFilterRole('available');
  };
  // console.log(tableData)
  const acceptRequest =  (currentId,tableData,setTableData) => {

    const newRow = tableData.find(el => (el.id === currentId))
    newRow.role = 'myRequest';
    setTableData([...tableData, newRow])
    console.log(tableData)
  };
  return (
    <>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <Card>
          <Tabs
            value={filterRole}
            onChange={handleFilterRole}
            sx={{
              px: 2,
              bgcolor: 'background.neutral',
            }}
          >
            
            {TABS.map((tab) => (
              <Tab
                key={tab.value}
                value={tab.value}
                label={tab.label}
                style={{float: 'left'}}
                icon={
                  <Label color={tab.color} sx={{ mr: 1 }}>
                    {tab.count}
                  </Label>
                }
              />
            ))}
          </Tabs>
          <Divider />

          <RegistrationTableToolbar
            filterName={filterName}
            isFiltered={isFiltered}
            onFilterName={handleFilterName}
            onResetFilter={handleResetFilter}
          />

          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <Scrollbar>
              <Table size={dense ? 'small' : 'medium'} sx={{ minWidth: 800 }}>
                <TableHeadCustom
                  headLabel={TABLE_HEAD_REQUESTS}
                />

                <TableBody>
                  {dataFiltered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                    // updateRequest === row.id ? <Request row={row} tableData={tableData} setTableData={setTableData}/> :
                    <TableRow
                      hover
                      key={row.id}
                    >
                      <TableCell align="left" > {row.id} </TableCell>
                      <TableCell align="left">{row.requestDate}</TableCell>
                      <TableCell align="left">{row.courseType}</TableCell>
                      <TableCell align="left">{row.section}</TableCell>
                      <TableCell align="center">{row.registeredCourses}</TableCell>
                      <TableCell align="left">{row.requestedBy}</TableCell>

                      {row.receipt === 'incompleteReceipt' ? (
                        <ThemeProvider theme={errorTheme}>
                          <TableCell align="left">
                            <Tooltip title="Incomplete Reciept">
                              <IconButton color='primary'>
                                <Iconify icon="ic:error" />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </ThemeProvider>
                      ) :
                        <TableCell align="left" />
                      }

                      <TableCell>
                        <Tooltip title="More Info">
                          <IconButton onClick={()=>acceptRequest(row.id,tableData,setTableData)}>
                            <Iconify icon="ic:chevron-right" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>

                    </TableRow>
                  ))}

                  <TableEmptyRows height={denseHeight} emptyRows={emptyRows(page, rowsPerPage, tableData.length)} />

                  <TableNoData isNotFound={isNotFound} />
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
            //
            dense={dense}
            onChangeDense={onChangeDense}
          />
        </Card>
      </Container>
    </>
  );
}

// ----------------------------------------------------------------------

function applyFilter({
  inputData,
  comparator,
  filterName,
  filterStatus,
  filterRole,
}) {
  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (filterName) {
    inputData = inputData.filter((request) => request.id.toLowerCase().indexOf(filterName.toLowerCase()) !== -1 || request.section.toLowerCase().indexOf(filterName.toLowerCase()) !== -1 || request.courseType.toLowerCase().indexOf(filterName.toLowerCase()) !== -1);
  }


  if (filterRole !== '') {
    inputData = inputData.filter((request) => request.role === filterRole);
  }

  return inputData;
}

// function acceptRequest(id) {
//   setUpdateRequest(id)
// };

// function Request(row,tableData,setTableData){
//   return(
//     console.log(row.role)
//   )
// }