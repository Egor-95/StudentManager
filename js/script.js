const studentForm = document.getElementById('studentForm');
const studentTable = document.getElementById('studentTable').getElementsByTagName('tbody')[0];
const students = [];

studentForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const firstName = capitalizeFirstLetter(document.getElementById('firstName').value.trim());
    const lastName = capitalizeFirstLetter(document.getElementById('lastName').value.trim());
    const patronymic = capitalizeFirstLetter(document.getElementById('patronymic').value.trim());
    const birthdate = new Date(document.getElementById('birthdate').value);
    const startYear = parseInt(document.getElementById('startYear').value);
    const faculty = capitalizeFirstLetter(document.getElementById('faculty').value.trim());

    const firstNameError = document.getElementById('firstNameError');
    const lastNameError = document.getElementById('lastNameError');
    const patronymicError = document.getElementById('patronymicError');
    const birthdateError = document.getElementById('birthdateError');
    const startYearError = document.getElementById('startYearError');
    const facultyError = document.getElementById('facultyError');

    firstNameError.innerText = '';
    lastNameError.innerText = '';
    patronymicError.innerText = '';
    birthdateError.innerText = '';
    startYearError.innerText = '';
    facultyError.innerText = '';

    if (firstName === '') {
        firstNameError.innerText = 'Введите имя студента.';
    }
    if (lastName === '') {
        lastNameError.innerText = 'Введите фамилию студента.';
    }
    if (patronymic === '') {
        patronymicError.innerText = 'Введите отчество студента.';
    }
    if (isNaN(birthdate.getTime()) || birthdate < new Date('1900-01-01') || birthdate > new Date()) {
        birthdateError.innerText = 'Введите корректную дату рождения.';
    }
    if (isNaN(startYear) || startYear < 2000 || startYear > new Date().getFullYear()) {
        startYearError.innerText = 'Введите корректный год начала обучения.';
    }
    if (faculty === '') {
        facultyError.innerText = 'Введите факультет студента.';
    }

    if (firstNameError.innerText !== '' || lastNameError.innerText !== '' || patronymicError.innerText !== '' ||
        birthdateError.innerText !== '' || startYearError.innerText !== '' || facultyError.innerText !== '') {
        return;
    }

    const student = {
        firstName,
        lastName,
        patronymic,
        birthdate,
        startYear,
        faculty,
    };

    students.push(student);
    updateStudentTable();
    studentForm.reset();
});

function capitalizeFirstLetter(str) {
  return str.toLowerCase().replace(/(?:^|\s)\S/g, function (c) {
    return c.toUpperCase();
  });
}



function sortTableByColumn(column) {
    const sortDirection = studentTable.getAttribute('data-sort') === column ? -1 : 1;
    studentTable.setAttribute('data-sort', column);

    students.sort((a, b) => {
        if (column === 'fullName') {
            const fullNameA = `${a.lastName} ${a.firstName} ${a.patronymic}`.toLowerCase();
            const fullNameB = `${b.lastName} ${b.firstName} ${b.patronymic}`.toLowerCase();
            return sortDirection * fullNameA.localeCompare(fullNameB);
        } else if (column === 'birthdate') {
            return sortDirection * (a[column].getTime() - b[column].getTime());
        } else {
            return sortDirection * (a[column] > b[column] ? 1 : -1);
        }
    });

    updateStudentTable();
}

function applyFilters() {
    const nameFilter = document.getElementById('nameFilter').value.trim().toLowerCase();
    const facultyFilter = document.getElementById('facultyFilter').value.trim().toLowerCase();
    const startYearFilter = parseInt(document.getElementById('startYearFilter').value);
    const endYearFilter = parseInt(document.getElementById('endYearFilter').value);

    let filteredStudents = students.filter(student => {
        return (student.firstName.toLowerCase().includes(nameFilter) ||
            student.lastName.toLowerCase().includes(nameFilter) ||
            student.patronymic.toLowerCase().includes(nameFilter)) &&
            student.faculty.toLowerCase().includes(facultyFilter) &&
            (isNaN(startYearFilter) || student.startYear === startYearFilter) &&
            (isNaN(endYearFilter) || student.startYear + 4 === endYearFilter);
    });

    updateStudentTable(filteredStudents);
}

function updateStudentTable(filteredStudents = students) {
    studentTable.innerHTML = '';
    for (const student of filteredStudents) {
        const row = studentTable.insertRow();
        row.insertCell().innerText = `${student.lastName} ${student.firstName} ${student.patronymic}`;
        row.insertCell().innerText = student.faculty;

        const birthdateCell = row.insertCell();
        const age = calculateAge(student.birthdate);
        birthdateCell.innerText = formatDate(student.birthdate) + ` (${age} лет)`;

        const startYearCell = row.insertCell();
        const endYear = student.startYear + 4;
        const course = endYear <= new Date().getFullYear() ? 'закончил' : `${getCourse(student.startYear)} курс`;
        startYearCell.innerText = `${student.startYear}-${endYear} (${course})`;
    }
}

function calculateAge(birthdate) {
    const today = new Date();
    const birthdateThisYear = new Date(today.getFullYear(), birthdate.getMonth(), birthdate.getDate());
    let age = today.getFullYear() - birthdate.getFullYear();
    if (today < birthdateThisYear) {
        age--;
    }
    return age;
}

function formatDate(date) {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
}

function getCourse(startYear) {
    const currentYear = new Date().getFullYear();
    return currentYear - startYear + 1;
}

const studentsData = [
    {
        firstName: 'Иван',
        lastName: 'Иванов',
        patronymic: 'Иванович',
        birthdate: new Date('1999-04-15'),
        startYear: 2018,
        faculty: 'Информатика',
    },
    {
        firstName: 'Мария',
        lastName: 'Петрова',
        patronymic: 'Александровна',
        birthdate: new Date('2000-07-25'),
        startYear: 2019,
        faculty: 'Экономика',
    },

    {
        firstName: 'Елена',
        lastName: 'Морозова',
        patronymic: 'Андреевна',
        birthdate: new Date('1999-06-30'),
        startYear: 2018,
        faculty: 'Информатика',
    },
    {
        firstName: 'Дмитрий',
        lastName: 'Васильев',
        patronymic: 'Сергеевич',
        birthdate: new Date('2001-02-12'),
        startYear: 2020,
        faculty: 'Физика',
    },
    {
        firstName: 'Анастасия',
        lastName: 'Макарова',
        patronymic: 'Ивановна',
        birthdate: new Date('1999-10-20'),
        startYear: 2018,
        faculty: 'Химия',
    },
    {
        firstName: 'Максим',
        lastName: 'Зайцев',
        patronymic: 'Александрович',
        birthdate: new Date('2000-05-05'),
        startYear: 2019,
        faculty: 'Экономика',
    },
    {
        firstName: 'София',
        lastName: 'Николаева',
        patronymic: 'Павловна',
        birthdate: new Date('1998-12-28'),
        startYear: 2017,
        faculty: 'История',
    },
    {
        firstName: 'Илья',
        lastName: 'Павлов',
        patronymic: 'Данилович',
        birthdate: new Date('1999-08-07'),
        startYear: 2018,
        faculty: 'Физика',
    },
    {
        firstName: 'Ольга',
        lastName: 'Кузнецова',
        patronymic: 'Егоровна',
        birthdate: new Date('2000-04-18'),
        startYear: 2019,
        faculty: 'Математика',
    },
    {
        firstName: 'Александр',
        lastName: 'Лебедев',
        patronymic: 'Алексеевич',
        birthdate: new Date('1999-07-22'),
        startYear: 2018,
        faculty: 'Информатика',
    },
    {
        firstName: 'Татьяна',
        lastName: 'Соловьева',
        patronymic: 'Максимовна',
        birthdate: new Date('2001-03-10'),
        startYear: 2020,
        faculty: 'Физика',
    },
    {
        firstName: 'Павел',
        lastName: 'Воробьев',
        patronymic: 'Николаевич',
        birthdate: new Date('1999-11-28'),
        startYear: 2018,
        faculty: 'Химия',
    },
    {
        firstName: 'Анна',
        lastName: 'Михайлова',
        patronymic: 'Артемовна',
        birthdate: new Date('2000-06-15'),
        startYear: 2019,
        faculty: 'Экономика',
    },
    {
        firstName: 'Егор',
        lastName: 'Козлов',
        patronymic: 'Ильич',
        birthdate: new Date('1998-12-10'),
        startYear: 2017,
        faculty: 'История',
    },
    {
        firstName: 'Дарья',
        lastName: 'Ковалева',
        patronymic: 'Дмитриевна',
        birthdate: new Date('1999-09-25'),
        startYear: 2018,
        faculty: 'Физика',
    },
    {
        firstName: 'Никита',
        lastName: 'Тимофеев',
        patronymic: 'Владиславович',
        birthdate: new Date('2000-01-12'),
        startYear: 2019,
        faculty: 'Математика',
    },
    {
        firstName: 'Валерия',
        lastName: 'Иванова',
        patronymic: 'Кирилловна',
        birthdate: new Date('1999-11-18'),
        startYear: 2018,
        faculty: 'Информатика',
    },
    {
        firstName: 'Алексей',
        lastName: 'Краснов',
        patronymic: 'Андреевич',
        birthdate: new Date('2001-04-30'),
        startYear: 2020,
        faculty: 'Физика',
    },
    {
        firstName: 'Екатерина',
        lastName: 'Сорокина',
        patronymic: 'Денисовна',
        birthdate: new Date('1999-07-05'),
        startYear: 2018,
        faculty: 'Химия',
    },
    {
        firstName: 'Артем',
        lastName: 'Попов',
        patronymic: 'Сергеевич',
        birthdate: new Date('2000-02-18'),
        startYear: 2019,
        faculty: 'Экономика',
    },
    {
        firstName: 'Мария',
        lastName: 'Лебедева',
        patronymic: 'Ивановна',
        birthdate: new Date('1998-09-12'),
        startYear: 2017,
        faculty: 'История',
    },
    {
        firstName: 'Дмитрий',
        lastName: 'Макаров',
        patronymic: 'Николаевич',
        birthdate: new Date('1999-10-28'),
        startYear: 2018,
        faculty: 'Физика',
    },
    {
        firstName: 'Алиса',
        lastName: 'Васильева',
        patronymic: 'Петровна',
        birthdate: new Date('2000-05-05'),
        startYear: 2019,
        faculty: 'Математика',
    },
    {
        firstName: 'Сергей',
        lastName: 'Егоров',
        patronymic: 'Александрович',
        birthdate: new Date('1999-06-22'),
        startYear: 2018,
        faculty: 'Информатика',
    },
    {
        firstName: 'Татьяна',
        lastName: 'Зайцева',
        patronymic: 'Евгеньевна',
        birthdate: new Date('2001-02-01'),
        startYear: 2020,
        faculty: 'Физика',
    },
    {
        firstName: 'Владислав',
        lastName: 'Морозов',
        patronymic: 'Денисович',
        birthdate: new Date('1999-10-10'),
        startYear: 2018,
        faculty: 'Химия',
    },
    {
        firstName: 'Анна',
        lastName: 'Иванова',
        patronymic: 'Александровна',
        birthdate: new Date('2000-04-15'),
        startYear: 2019,
        faculty: 'Экономика',
    },
    {
        firstName: 'Максим',
        lastName: 'Козлов',
        patronymic: 'Игоревич',
        birthdate: new Date('1998-12-30'),
        startYear: 2017,
        faculty: 'История',
    },
    {
        firstName: 'Кристина',
        lastName: 'Петрова',
        patronymic: 'Дмитриевна',
        birthdate: new Date('1999-09-08'),
        startYear: 2018,
        faculty: 'Физика',
    },
    {
        firstName: 'Игорь',
        lastName: 'Тимофеев',
        patronymic: 'Александрович',
        birthdate: new Date('2000-01-12'),
        startYear: 2019,
        faculty: 'Математика',
    },
    {
        firstName: 'Анастасия',
        lastName: 'Иванова',
        patronymic: 'Ивановна',
        birthdate: new Date('1998-11-18'),
        startYear: 2018,
        faculty: 'Информатика',
    },
    {
        firstName: 'Иван',
        lastName: 'Краснов',
        patronymic: 'Алексеевич',
        birthdate: new Date('2001-04-20'),
        startYear: 2020,
        faculty: 'Физика',
    },
    {
        firstName: 'Мария',
        lastName: 'Сорокина',
        patronymic: 'Евгеньевна',
        birthdate: new Date('1999-07-05'),
        startYear: 2018,
        faculty: 'Химия',
    },
    {
        firstName: 'Егор',
        lastName: 'Попов',
        patronymic: 'Сергеевич',
        birthdate: new Date('2000-02-18'),
        startYear: 2019,
        faculty: 'Экономика',
    },
];


for (const studentData of studentsData) {
    const student = {
        firstName: studentData.firstName,
        lastName: studentData.lastName,
        patronymic: studentData.patronymic,
        birthdate: new Date(studentData.birthdate),
        startYear: parseInt(studentData.startYear),
        faculty: studentData.faculty,
    };
    students.push(student);
}

updateStudentTable();
