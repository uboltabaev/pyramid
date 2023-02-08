import { makeAutoObservable, observable, computed } from 'mobx';
import _ from 'underscore';
import moment from 'moment';
import DateHelper from '../helpers/date_helper';

class UserStore {
    isSignedIn = false;
    uid = null;
    fullName = '';
    profileImage = null;
    profileImageBase64 = null;
    userProfile = null;
    language = null;
    updateTime = null;

    especiallyProducts = [];

    isShippingAddressesLoaded = false;
    shippingAddresses = [];

    isHistoryLoaded = false;
    historyList = [];
    historySelectedDate = null;
    
    constructor(rootStore) {
        this.rootStore = rootStore;

        makeAutoObservable(this, {
            isSignedIn: observable,
            uid: observable,
            fullName: observable,
            profileImage: observable,
            profileImageBase64: observable,
            userProfile: observable,
            language: observable,
            updateTime: observable,
            isShippingAddressesLoaded: observable,
            shippingAddresses: observable,
            isHistoryLoaded: observable,
            historyList: observable,
            historySelectedDate: observable,
            historyListData: computed,
            historyAvailableDates: computed,
            historyListLength: computed
        });
    }

    setIsSignedIn = (v) => this.isSignedIn = v;

    setLanguage = (v) => this.language = v;

    updateUserProfile = (key, val, update_time) => {
        this.userProfile[key] = val;
        this.userProfile['update_time'] = update_time;
        this.updateTime = new Date();
    }

    setDefaultShippingAddress = (v) => {
        this.shippingAddresses.map((element) => {
            element.as_default = element.id === v.id ? true : false;
            return element;
        });
    }

    getShippingAddress = (id) => {
        return computed(() => {
            const s = this.shippingAddresses.find(v => v.id === id);
            return !_.isUndefined(s) ? s : null;
        }).get();
    }

    replaceShippingAddress = (o) => {
        const index = _.findIndex(this.shippingAddresses, {id: o.id});
        this.shippingAddresses[index] = o;
        if (o.as_default) {
            this.shippingAddresses.map((element) => {
                if (element.id !== o.id)
                    element.as_default = false;
                return element;
            });
        }
    }

    addShippingAddress = (o) => {
        this.shippingAddresses.push(o);
        if (o.as_default) {
            this.shippingAddresses.map((element) => {
                if (element.id !== o.id)
                    element.as_default = false;
                return element;
            });
        }
    }

    removeShippingAddress = (arr) => {
        const filtered = this.shippingAddresses.filter(element => !_.contains(arr, element.id));
        this.shippingAddresses = filtered;
    }

    addHistory(n) {
        this.historyList.unshift(n);
    }

    clearStorage() {
        // Clear user store
        this.setValues({
            isSignedIn: false,
            uid: null,
            fullName: '',
            profileImage: null,
            profileImageBase64: null,
            userProfile: null,
            language: null,
            updateTime: null,
            especiallyProducts: [],
            isShippingAddressesLoaded: false,
            shippingAddresses: [],
            isHistoryLoaded: false,
            historyList: [],
            historySelectedDate: null
        });
        // Clear cart store
        this.rootStore.cartStore.setValues({
            isCartLoaded: false,
            cartItems: [],
            selectedCartItems: [],
            selectedSellers: [],
            isCheckedAllSelected: false,
            updateTime: null
        });
    }

    setValues = (vs) => {
        for (let prop in vs) {
            if (this.hasOwnProperty(prop))
                this[prop] = vs[prop];
        }
    }

    get historyListData() {
        const data = _.chain(this.historyList)
            .filter((item) => {
                if (_.isNull(this.historySelectedDate) || DateHelper.isToday(this.historySelectedDate))
                    return true;
                else {
                    const itemDate = item.creation_date.toDate();
                    return DateHelper.isSameDay(this.historySelectedDate, itemDate);
                }
            })
            .groupBy((item) => {
                const momentDate = moment(item.creation_date.toDate()).format("DD/MM/YYYY");
                return momentDate;
            })
            .sortBy(group => this.historyList.indexOf(group[0]))
            .map((data, i) => {
                const date = _.isObject(data[0]) ? data[0].creation_date.toDate() : new Date();
                return {
                    title: date,
                    data
                }
            })
            .value();
        return _.isArray(data) ? data : [];
    }

    get historyAvailableDates() {
        const dates = _.chain(this.historyList)
            .map((item) => {
                return moment(item.creation_date.toDate(), "DD/MM/YYYY");
            })
            .uniq()
            .map((item) => {
                return item.toDate();
            })
            .value();
        return _.isArray(dates) ? dates : [];
    }

    get historyListLength() {
        return this.historyList.length;
    }
}

export default UserStore;