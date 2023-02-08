import { Alert } from 'react-native';
import _ from 'underscore';
import Numeral from 'numeral';
import "numeral/locales/ru";
import i18n from 'i18n-js';
import {NATIONAL_CURRENCY} from '../constants/app';
import DateHelper from './date_helper';

class MiscHelper {
    /**
     * Groups given array by group
     * 
     * @param {array} arr 
     * @param {number} n
     * @returns array 
     */
    static groupByPerItems(arr, n) {
        return arr.reduce((r,v,i) => {
            let index = Math.floor(i/n);
            (r[index] = r[index] || [])[i%n] = v;
            return r;
        },[]);
    }
    /**
     * Anonymize name
     * 
     * @param {string} name
     * @returns string 
     */
    static anonymizeName(name) {
        if (name === undefined || name.length === 0)
            return;
        const first = name.charAt(0),
            last = name.charAt(name.length - 1),
            arr = [first, '***', last];
        return arr.join('');
    }
    /**
     * Generate UUID
     * @returns string
     */
    static getUUID() {
        let lut = []; 
        for (let i = 0; i < 256; i++) { 
            lut[i] = (i<16?'0':'')+(i).toString(16); 
        }
        let d0 = Math.random()*0xffffffff|0;
        let d1 = Math.random()*0xffffffff|0;
        let d2 = Math.random()*0xffffffff|0;
        let d3 = Math.random()*0xffffffff|0;
        return lut[d0&0xff]+lut[d0>>8&0xff]+lut[d0>>16&0xff]+lut[d0>>24&0xff]+'-'+
        lut[d1&0xff]+lut[d1>>8&0xff]+'-'+lut[d1>>16&0x0f|0x40]+lut[d1>>24&0xff]+'-'+
        lut[d2&0x3f|0x80]+lut[d2>>8&0xff]+'-'+lut[d2>>16&0xff]+lut[d2>>24&0xff]+
        lut[d3&0xff]+lut[d3>>8&0xff]+lut[d3>>16&0xff]+lut[d3>>24&0xff];        
    }
    /**
     * Get first char from string
     * 
     * @param {string} text
     * @returns string 
     */
    static getFirstChar(text) {
        if (text === undefined || text.length === 0)
            return;
        return text.charAt(0);
    }
    /**
     * Re-index of given array
     * 
     * @param {array} messages
     * @returns array 
     */
    static reIndexMessages(messages) {
        const today = DateHelper.getNowDbDateFormat(),
        lastDate = _.find(messages, {date: today});
        if (_.isObject(lastDate)) {
            messages.map((m) => {
                if (m.date === today)
                    m.data.unshift(null);        
                return m;
            });
        } else {
            const data = {
                date: null,
                data: [null]
            };
            messages.unshift(data);
        }
        return messages;
    }
    /**
     * Split array into two pieces
     * 
     * @param {array} data
     * @returns object 
     */
    static splitProducts(data) {
        const result = _.partition(data, (v, i) => {
            return i % 2 === 0
        });
        return {
            odd: _.isArray(result[0]) ? result[0] : [],
            even: _.isArray(result[1]) ? result[1] : [],
        };
    }
    /**
     * Sets timeout for giving 
     * 
     * @param {integer} timeout 
     * @returns Promise
     */
    static wait(timeout) {
        return new Promise(resolve => {
            setTimeout(resolve, timeout);
        });
    }
    /**
     * Gets random arbitrary number
     * 
     * @param {integer} min 
     * @param {integer} max
     * @returns integer 
     */
    static getRandomArbitrary(min, max) {
        return Math.random() * (max - min) + min;
    }
    /**
     * Generate price
     * 
     * @param {integer} number 
     * @returns string
     */
    static price(number) {
        Numeral.locale('ru');
        const arr = [
            Numeral(number).format('0,0'),
            i18n.t(NATIONAL_CURRENCY, {defaultValue: NATIONAL_CURRENCY})
        ];
        return arr.join(" ");
    }
    /**
     * Validate string for alphanumeric
     * 
     * @param {string} str 
     * @returns boolean
     */
    static isAlphanumeric(str) {
        if (str) {
            return !/[^0-9a-z\xDF-\xFF]/.test(str.toLowerCase());
        }
        return str;
    }
    /**
     * Checks the lenght of string by giving 
     * 
     * @param {string} str 
     * @param {integer} min 
     * @param {integer} max
     * @returns boolean 
     */
    static checkStrLength(str, min = 6, max = 20) {
        if (str.length <= max && str.length >= min)
            return true;
        return false;
    }
    /**
     * Gets just numbers by given string
     * 
     * @param {string} str 
     * @returns string
     */
    static getNumbersFromStr(str) {
        return str.replace(/\D/g, "");
    }
    /**
     * Alerts an error
     */
    static alertError() {
        Alert.alert(
            "",
            i18n.t('errors:errorOccured', {defaultValue: 'Произошла ошибка, попробуйте позже'})
        );
    }
    /**
     * Generates discount
     * 
     * @param {intger} val 
     * @returns string
     */
    static discount(val) {
        if (val) {
            const arr = [
                '-',
                val,
                '%'
            ];
            return arr.join("");
        }
        return val;
    }
    /**
     * 
     * @param {integer} itemsNum
     *  
     */
    static getCartTitle(itemsNum) {
        let val = {};
        val.i18nKey = 'navigation:cart';
        val.defaultText = 'Корзина';
        val.amount = {
            amount: 0
        };
        if (itemsNum > 0) {
            val.i18nKey = 'navigation:cartAmount';
            val.defaultText = 'Корзина (' + itemsNum + ')';
            val.amount = {
                amount: itemsNum
            };
        }
        return val;
    }
}

export default MiscHelper;