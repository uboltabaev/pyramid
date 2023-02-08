import moment from 'moment';
import 'moment/locale/ru';
import 'moment/locale/uz';
import 'moment/locale/uz-latn';
import _ from 'underscore';

class DateHelper {
    en = {
        monthNames: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
        monthNamesShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        dayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        dayNamesShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        dayNamesMin: ["S", "M", "T", "W", "T", "F", "S"]
    }
    ru = {
        monthNames: ["Январь‎", "Февраль‎", "Март‎", "Апрель", "Май‎", "Июнь‎", "Июль‎", "Август‎", "Сентябрь‎", "Октябрь‎", "Ноябрь‎", "Декабрь‎"],
        monthNamesShort: ["Янв", "Фев", "Мрт", "Апр", "Май", "Июн", "Июл", "Авг", "Сен", "Окт", "Нбр", "Дек"],
        dayNames: ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"],
        dayNamesShort: ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
        dayNamesMin: ["В", "П", "В", "С", "Ч", "П", "С"]
    }
    uz = {
        monthNames: ["Январь‎", "Февраль‎", "Март‎", "Апрель", "Май‎", "Июнь‎", "Июль‎", "Август‎", "Сентябрь‎", "Октябрь‎", "Ноябрь‎", "Декабрь‎"],
        monthNamesShort: ["Янв", "Фев", "Мрт", "Апр", "Май", "Июн", "Июл", "Авг", "Сен", "Окт", "Нбр", "Дек"],
        dayNames: ["Якшанба", "Душанба", "Сешанба", "Чоршанба", "Пайшанба", "Жума", "Шанба"],
        dayNamesShort: ["Якш", "Душ", "Сеш", "Чор", "Пай", "Жум", "Шан"],
        dayNamesMin: ["Я", "Д", "С", "Ч", "П", "Ж", "Ш"]
    }
    uz_latin = {
        monthNames: ["Yanvar", "Fevral", "Mart", "Aprel", "May", "Iyun", "Iyul", "Avgust", "Sentabr", "Oktabr", "Noyabr", "Dekabr"],
        monthNamesShort: ["Yan", "Fev", "Mrt", "Apr", "May", "Iyn", "Iyl", "Avg", "Sen", "Okt", "Noy", "Dek"],
        dayNames: ["Yakshanba", "Dushanba", "Seshanba", "Chorshanba", "Payshanba", "Juma", "Shanba"],
        dayNamesShort: ["Yak", "Dsh", "Ssh", "Chr", "Pay", "Jum", "Sha"],
        dayNamesMin: ["Y", "D", "S", "C", "P", "J", "S"]
    }
    constructor(locale) {
        this.locale = locale;
        moment.updateLocale(locale, {
            week: {
                dow: 1
            }
        });
        this.a = {
            ru: {
                shortYear: "г", 
                fullYear: "год",
            },
            uz: {
                shortYear: "й",
                fullYear: "йил",
            }
        };
    }
    getDayNamesShort() {
        if (this.locale) {
            return this[this.locale]['dayNamesShort'];
        }
        return null;
    }
    getLocaleShortYear() {
        if (this.locale) {
            return this.a[this.locale].shortYear;
        }
        return null;
    }
    getDateShort(date) {
        if (date) {
            const shortYear = this.getLocaleShortYear();
            return moment(date).format("D MMM YYYY " + shortYear + ".");
        }
        return date;
    }
    static daysBetween(a, b) {
        const c = 864e5;
        return Math.ceil((b.getTime() - a.getTime()) / c);
    }
    static getDateTime(date) {
        if (date) {
            return moment(date).format("H:mm");
        }
        return date;
    }
    getDateDayMonth(date) {        
        if (date) {
            return moment(date).format("D MMMM");
        }
        return date;
    }
    static getNowDbDateFormat() {
        const date = new Date();
        return moment(date).format("YYYY-MM-DD");
    }
    static getNowDateTimeFormat() {
        const date = new Date();
        return moment(date).format("YYYY-MM-DD HH:mm:ss");
    }
    static convertDbDateFormat(date) {
        if (date)
            return moment(date).format("YYYY-MM-DD");
        return date;
    }
    static getShortDate(date) {
        if (date)
            return moment(date).format("DD.MM.YYYY");
        return date;
    }
    static mSecsTimeFormat(val, showMsecs) {
        let msecs = Math.floor((val / 10) % 100);
        if (msecs < 10)
            msecs = `0${msecs}`;
        let seconds = Math.floor((val * 10 / 10000) % 60);
        let minutes = Math.floor(val * 10 / 10000 / 60);
        let formatted;
        if (showMsecs)
            formatted = `${minutes < 10 ? 0 : ""}${minutes}:${seconds < 10 ? 0 : ""}${seconds}:${msecs}`;
        else
            formatted = `${minutes < 10 ? 0 : ""}${minutes}:${seconds < 10 ? 0 : ""}${seconds}`;
        return formatted;
    }
    static isToday(a) {
        const b = new Date(Date.now());
        return DateHelper.isSameDay(a, b);
    }
    static isSameDay(a, b) {
        return b.getFullYear() === a.getFullYear() && b.getMonth() === a.getMonth() && b.getDate() === a.getDate();
    }
    static isSameYear(a, b) {
        return b.getFullYear() === a.getFullYear();
    }
    static isDateInArray(date, arr) {
        let result = false;
        if (_.isArray(arr)) {
            for (let x = 0; x < arr.length; x++) {
                if (DateHelper.isSameDay(date, arr[x])) {
                    result = true;
                    break;
                }
            }
        }
        return result;
    }
    static distance(a, yesterday = 'Yesterday') {
        if (a) {
            return moment(a).calendar( null, {
                lastWeek: 'DD/MM HH:mm',
                lastDay:  '[' + yesterday + '] HH:mm',
                sameDay:  'HH:mm',
                sameElse: function () {
                    const b = new Date(Date.now());
                    if (DateHelper.isSameYear(a, b))
                        return 'DD/MM HH:mm';
                    else
                        return "DD/MM/YY HH:mm";
                }
            });
        }
        return a;
    }
    static firebaseDate(date) {
        return _.isDate(date) ? date : _.isObject(date.toDate()) ? date.toDate() : null;
    }
}

export default DateHelper;