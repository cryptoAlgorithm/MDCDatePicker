class MDCDatepicker {
    // ----------------------- //
    // ====== Constants ====== //
    // ----------------------- //
    DAY_STRINGS = ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat'];
    MONTH_STRINGS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    F_MONTH_STRINGS = ['January',
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

    formatDate = (date) => {
        return `${this.DAY_STRINGS[date.getDay()]}, ${this.MONTH_STRINGS[date.getMonth()]} ${date.getDate()}`;
    }

    constructor(pickerElem) {
        this.elem = pickerElem; // Set calendar element

        // ====== Utility Functions ====== //
        this.q = (e) => { return this.elem.querySelector(e) }
        this.qAll = (e) => { return this.elem.querySelectorAll(e) }
        this.$ = (i) => { return document.getElementById(i) }


        // ---------------------- //
        // ====== Elements ====== //
        // ---------------------- //
        this.selectedDate = this.q('.mdc-datepicker__header > .mdc-datepicker__header-content > h2');
        this.monthYearBtn = this.q('.mdc-datepicker > .mdc-datepicker__body > .mdc-datepicker__body-button-row > #month-year-btn');
        this.calTableBody = this.q('.mdc-datepicker > .mdc-datepicker__body > table > tbody');


        // ------------------ //
        // ====== Init ====== //
        // ------------------ //
        this.current = new Date();
        this.selected = this.current; // Selected date

        // Update UI elements
        this.selectedDate.textContent = this.formatDate(this.selected); // Set selected date to today's date
        this.monthYearBtn.querySelector('.mdc-button__label').textContent =
            `${this.F_MONTH_STRINGS[this.current.getMonth()]} ${this.current.getFullYear()}`;

        // Populate table with current month
        this.updateCal(this.current);


        this.q('#prev-month').onclick = () => {
            this.changeMonth(-1)
        }
        this.q('#next-month').onclick = () => {
            this.changeMonth(1);
        }
    }

    // Change currently displayed month
    changeMonth(change) {
        this.current.setMonth(this.current.getMonth() + change);
        this.updateCal(this.current);
        this.monthYearBtn.querySelector('.mdc-button__label').textContent =
            `${this.F_MONTH_STRINGS[this.current.getMonth()]} ${this.current.getFullYear()}`;
    }

    // Calendar event listener
    calListener = (event, data) => {
        switch (event) {
            case 'MDCDatepicker:dateClicked':
                this.selectedDate.textContent = this.formatDate(new Date(data[0], data[1], data[2]));
                break;
        }
    }

    clearDateSelection() {
        this.qAll('.mdc-datepicker > .mdc-datepicker__body > table > tbody td.selected').forEach((elem) => {
            elem.classList.remove('selected');
        });
    }

    // ====== Calendar Functions ====== //
    // Modifies the table body with the selected month and year
    updateCal(current) {
        const
            month = current.getMonth(),
            year = current.getFullYear(),
            now = new Date(),
            tBody = this.calTableBody,
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
            const chkY = current.getFullYear();
            const chkM = current.getMonth();
            if (chkY === now.getFullYear() && chkM === now.getMonth() && i === now.getDate()) {
                html += '<td class="today mdc-ripple-surface" data-date="' + [year, month, i].join(',') + '" data-mdc-auto-init="MDCRipple">' + i + '</td>';
            } else {
                html += '<td class="mdc-ripple-surface" data-date="' + [year, month, i].join(',') + '" data-mdc-auto-init="MDCRipple">' + i + '</td>';
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
        this.qAll('.mdc-datepicker > .mdc-datepicker__body > table > tbody td').forEach((elem) => {
            elem.onclick = () => {
                if (elem.dataset.date != null) {
                    this.calListener('MDCDatepicker:dateClicked', elem.dataset.date.split(','));
                    this.clearDateSelection();
                    elem.classList.add('selected');
                }
            }
        });

        // Init new elements
        mdc.autoInit();
    }
}