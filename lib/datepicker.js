// ====== Constants ====== //
const DAY_STRINGS = ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat'];
const MONTH_STRINGS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const F_MONTH_STRINGS = ['January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
];

// ====== Utility Functions ====== //
const q = (e) => { return document.querySelector(e) }

function formatDate(date) {
    return `${DAY_STRINGS[date.getDay()]}, ${MONTH_STRINGS[date.getMonth()]} ${date.getDate()}`;
}

// ====== Elements ====== //
const selectedDate = q('.mdc-datepicker__header > .mdc-datepicker__header-content > h2');
const monthYearBtn = q('.mdc-datepicker > .mdc-datepicker__body > .mdc-datepicker__body-button-row > #month-year-btn');
const calTableBody = q('.mdc-datepicker > .mdc-datepicker__body > table tbody');

// ====== Calendar Functions ====== //

// Modifies the table body with the selected month and year
function updateCal(month, year, tBody, now) {
    const
        // First day of the week in the selected month
        firstDayOfMonth = new Date(year, month, 1).getDay(),
        // Last day of the selected month
        lastDateOfMonth = new Date(year, month + 1, 0).getDate(),
        // Last day of the previous month
        lastDayOfLastMonth = month === 0 ? new Date(year - 1, 11, 0).getDate() : new Date(year, month, 0).getDate();

    let i = 1,
        k,
        html = '';

    do {
        let dow = new Date(year, month, i).getDay();

        const formattedDate = year.toString() + (month + 1).toString().padStart(2, '0') + i.toString().padStart(2, '0');

        // If Sunday, start new row
        if (dow === 0) {
            html += '<tr>';
        }
        // If day is not Sunday but first day of the month
        // it will write the last days from the previous month
        else if (i === 1) {
            html += '<tr>';
            k = lastDayOfLastMonth - firstDayOfMonth+1;
            for(let j=0; j < firstDayOfMonth; j++) {
                html += '<td></td>';
                k++;
            }
        }

        // Write the current day in the loop
        const chk = new Date();
        const chkY = chk.getFullYear();
        const chkM = chk.getMonth();
        if (chkY === now.getFullYear() && chkM === now.getMonth() && i === now.getDate()) {
            html += '<td class="today mdc-ripple-surface" data-date="' + [year, month, i].join(',') + '" data-mdc-auto-init="MDCRipple">' + i + '</td>';
        } else {
            html += '<td class="current mdc-ripple-surface" data-date="' + [year, month, i].join(',') + '" data-mdc-auto-init="MDCRipple">' + i + '</td>';
        }
        // If Saturday, closes the row
        if (dow === 6) {
            html += '</tr>';
        }

        // If not Saturday, but last day of the selected month
        // it will write the next few days from the next month
        else if (i === lastDateOfMonth) {
            k = 1;
            for(dow; dow < 6; dow++) {
                html += '<td></td>';
                k++;
            }
        }

        i++;
    } while(i <= lastDateOfMonth);

    tBody.innerHTML = html;
    // Init new elements
    mdc.autoInit();
}

// ====== Init ====== //
(function () {
    const now = new Date();

    // Update UI elements
    selectedDate.textContent = formatDate(now); // Set selected date to today's date
    monthYearBtn.querySelector('.mdc-button__label').textContent = `${F_MONTH_STRINGS[now.getMonth()]} ${now.getFullYear()}`;

    // Populate table with current month
    updateCal(1, 2021, calTableBody, now);
} ());
