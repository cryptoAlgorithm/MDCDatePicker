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
        this.calGridElem  = this.q('.mdc-datepicker > .mdc-datepicker__body > div.cal > div.body');
        this.textInputBtn = this.q('.mdc-datepicker__header > .mdc-datepicker__header-content > button');


        // ------------------ //
        // ====== Init ====== //
        // ------------------ //
        this.current = new Date();
        this.selected = new Date(); // Selected date

        // Update UI elements
        this.selectedDate.textContent = this.formatDate(this.selected); // Set selected date to today's date
        this.monthYearBtn.querySelector('.mdc-button__label').textContent =
            `${this.F_MONTH_STRINGS[this.current.getMonth()]} ${this.current.getFullYear()}`;

        // Populate table with current month
        this.updateCal(this.current, this.selected);


        // ====== Onclick Listeners ====== //
        this.q('#prev-month').onclick = () => {
            this.changeMonth(-1)
        }
        this.q('#next-month').onclick = () => {
            this.changeMonth(1);
        }

        this.textInputBtn.onclick = () => {
            pickerElem.classList.toggle('mdc-datepicker__text-field');
            if (pickerElem.classList.contains('mdc-datepicker__text-field')) pickerElem.querySelector('i.material-icons').textContent = 'calendar_today';
            else pickerElem.querySelector('i.material-icons').textContent = 'edit';
        }
    }

    // Change currently displayed month
    changeMonth(change) {
        this.current.setMonth(this.current.getMonth() + change);
        this.updateCal(this.current, this.selected);
        this.monthYearBtn.querySelector('.mdc-button__label').textContent =
            `${this.F_MONTH_STRINGS[this.current.getMonth()]} ${this.current.getFullYear()}`;
    }

    // Calendar event listener
    calListener = (event, data) => {
        switch (event) {
            case 'MDCDatepicker:dateClicked':
                this.selected.setFullYear(data[0]);
                this.selected.setMonth(data[1]);
                this.selected.setDate(data[2]);
                this.selectedDate.textContent = this.formatDate(this.selected);
                break;
        }
    }

    clearDateSelection() {
        this.qAll('.mdc-datepicker > .mdc-datepicker__body > div.cal > div.body div.selected').forEach((elem) => {
            elem.classList.remove('selected');
        });
    }

    // ====== Calendar Functions ====== //
    // Modifies the table body with the selected month and year
    updateCal(current, selected) {
        const
            month = current.getMonth(),
            year = current.getFullYear(),
            now = new Date(),
            tBody = this.calGridElem,
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

            // If day is not Sunday but first day of the month
            // it will write the last days from the previous month
            if (dow !== 0 && i === 1) {
                k = lastDayOfLastMonth - firstDayOfMonth+1;
                for(let j=0; j < firstDayOfMonth; j++) {
                    html += '<div></div>';
                    k++;
                }
            }

            // Write the current day in the loop
            const selY = selected.getFullYear();
            const selM = selected.getMonth();
            let classes = ['mdc-ripple-surface'];


            if (now.getFullYear() === year && now.getMonth() === month && i === now.getDate()) classes.push('today');
            // Selected date highlight
            if (selY === year && selM === month && i === selected.getDate()) classes.push('selected');

            html += `<div class="${classes.join(' ')}" data-date="${[year, month, i].join(',')}" data-mdc-auto-init="MDCRipple">${i}</div>`;

            // If not Saturday, but last day of the selected month
            // Create empty divs
            if (dow !== 6 && i === lastDateOfMonth) {
                k = 1;
                for(dow; dow < 6; dow++) {
                    html += '<div></div>';
                    k++;
                }
            }

            i++;
        } while(i <= lastDateOfMonth);

        tBody.innerHTML = html;
        this.qAll('.mdc-datepicker > .mdc-datepicker__body > div.cal > div.body > div').forEach((elem) => {
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