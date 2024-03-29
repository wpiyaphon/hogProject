export const currentStudent = {
    fName: 'Piyaphon',
    lName: 'Wu',
    studentPrivateClass: [
        {
            id: '0',
            course: { id: '0', course: 'SAT', subject: 'MATH', level: 'INTENSIVE', type: 'Private' },
            classNo: '1',
            students: [{ id: '1', fullName: 'Piyaphon Wu' }],
            date: '13-Mar-2023',
            fromTime: '10:00',
            toTime: '12:00',
            room: '306',
            section: 'Piyaphon Wu',
            teacher: { id: '1', fullName: 'Kiratijuta Bhumichitr' },
            attendance: 'Present'
        },
        {
            id: '1',
            course: { id: '0', course: 'SAT', subject: 'MATH', level: 'INTENSIVE', type: 'Private' },
            classNo: '2',
            students: [{ id: '1', fullName: 'Piyaphon Wu' }],
            date: '15-Mar-2023',
            fromTime: '10:00',
            toTime: '12:00',
            room: '306',
            section: 'Piyaphon Wu',
            teacher: { id: '1', fullName: 'Kiratijuta Bhumichitr' },
            attendance: 'Present'
        },
        {
            id: '2',
            course: { id: '0', course: 'SAT', subject: 'MATH', level: 'INTENSIVE', type: 'Private' },
            classNo: '3',
            students: [{ id: '1', fullName: 'Piyaphon Wu' }],
            date: '17-Mar-2023',
            fromTime: '10:00',
            toTime: '12:00',
            room: '306',
            section: 'Piyaphon Wu',
            teacher: { id: '1', fullName: 'Kiratijuta Bhumichitr' },
            attendance: 'None'
        },
        {
            id: '3',
            course: { id: '0', course: 'SAT', subject: 'MATH', level: 'INTENSIVE', type: 'Private' },
            classNo: '4',
            students: [{ id: '1', fullName: 'Piyaphon Wu' }],
            date: '19-Mar-2023',
            fromTime: '10:00',
            toTime: '12:00',
            room: '306',
            section: 'Piyaphon Wu',
            teacher: { id: '1', fullName: 'Kiratijuta Bhumichitr' },
            attendance: 'None'
        },
        {
            id: '4',
            course: { id: '1', course: 'GED', subject: 'MATH', level: 'REGULAR', type: 'Semi Private' },
            classNo: '1',
            students: [{ id: '0', fullName: 'Michael Bull'}, { id: '1', fullName: 'Piyaphon Wu' }],
            date: '14-Mar-2023',
            fromTime: '13:00',
            toTime: '15:00',
            room: '306',
            section: 'Kaphao Mookrob Group',
            teacher: { id: '2', fullName: 'Nirawit Janturong' },
            attendance: 'None'
        },
        {
            id: '5',
            course: { id: '1', course: 'GED', subject: 'MATH', level: 'REGULAR', type: 'Semi Private' },
            classNo: '2',
            students: [{ id: '0', fullName: 'Michael Bull'}, { id: '1', fullName: 'Piyaphon Wu' }],
            date: '16-Mar-2023',
            fromTime: '13:00',
            toTime: '15:00',
            room: '306',
            section: 'Kaphao Mookrob Group',
            teacher: { id: '2', fullName: 'Nirawit Janturong' },
            attendance: 'None'
        }
    ],
    studentGroupClass: [
        {
            id: '0',
            course: { id: '0', course: 'SAT', subject: 'READING', level: 'INTENSIVE', type: 'Group' },
            classNo: '1',
            students: [{ id: '0', fullName: 'Michael Bull'}, { id: '1', fullName: 'Piyaphon Wu' }],
            date: '13-Mar-2023',
            fromTime: '14:00',
            toTime: '16:00',
            room: '306',
            section: 'Kaphao Mookrob Group',
            teacher: { id: '0', fullName: 'Zain Janpatiew' },
            attendance: 'Absent'
        },
        {
            id: '0',
            course: { id: '0', course: 'SAT', subject: 'READING', level: 'INTENSIVE', type: 'Group' },
            classNo: '2',
            students: [{ id: '0', fullName: 'Michael Bull'}, { id: '1', fullName: 'Piyaphon Wu' }],
            date: '15-Mar-2023',
            fromTime: '14:00',
            toTime: '16:00',
            room: '306',
            section: 'Kaphao Mookrob Group',
            teacher: { id: '0', fullName: 'Zain Janpatiew' },
            attendance: 'Absent'
        }
    ],
    studentPrivateCourse: [
        { id: '0', course: 'SAT', subject: 'MATH', level: 'INTENSIVE', type: 'Private' },
        { id: '1', course: 'SAT', subject: 'VERBAL', level: 'REGULAR', type: 'Semi Private' }
    ],
    studentGroupCourse: [
        { id: '0', course: 'SAT', subject: 'READING', level: 'INTENSIVE', type: 'Group' }
    ],

    studentClassRequest:[
        { id: '0', course:'SAT', subject: 'READING', level: 'Intensive', type: 'Private', requestDate:'17-Feb-2022',cancelDate:'18-Feb-2022  09:00 - 12:00',makeupDate:'20-Feb-2022  09:00 - 12:00',status:'Pending',remark:"Can I change to feb 20?",tutor:"Kiratijuta Bhumichitr"},
        { id: '1', course:'SAT', subject: 'MATH', level: 'Intensive', type: 'Private', requestDate:'15-Feb-2022',cancelDate:'17-Feb-2022 | 09:00 - 12:00',makeupDate:'22-Feb-2022  09:00 - 12:00',status:'Complete',remark:"Can I change to feb 22?",tutor:"Kiratijuta Bhumichitr"},
        { id: '2', course:'SAT', subject: 'VERBAL', level: 'Intensive', type: 'Semi-Private', requestDate:'19-Feb-2022',cancelDate:'19-Feb-2022  09:00 - 12:00',makeupDate:'21-Feb-2022  09:00 - 12:00',status:'Reject',remark:"Can I change to feb 21?",tutor:"Kiratijuta Bhumichitr"},
    ],
}