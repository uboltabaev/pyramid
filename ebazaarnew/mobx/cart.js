import { makeAutoObservable, observable, computed } from 'mobx';
import _ from 'underscore';
import { UserCart } from '../firebase/user_cart';

class CartStore {
    isCartLoaded = false;
    cartItems = [];
    selectedCartItems = [];
    selectedSellers = [];
    isCheckedAllSelected = false;
    updateTime = null;
    
    constructor(rootStore) {
        this.rootStore = rootStore;

        makeAutoObservable(this, {
            isCartLoaded: observable,
            cartItems: observable,
            selectedCartItems: observable,
            selectedSellers: observable,
            isCheckedAllSelected: observable,
            updateTime: observable,
            cartItemsNum: computed,
            cartItemsList: computed,
            selectedCartItemsNum: computed,
            selectedCartItemsSum: computed,
            selectedCartItemsShipmentSum: computed,
            selectedCartItemsTotalSum: computed
        });
    }

    addSelectedItem(n) {
        this.selectedCartItems.push(n);
    }

    removeSelectedItem(n) {
        const filtered = _.filter(this.selectedCartItems, (r) => {return r !== n;});
        this.selectedCartItems = filtered;
    }

    selectItem(n) {
        const isSelected = this.isSelected(n),
            s = n.getSellerId(),
            sIsSelected = this.isSellerSelected(s);
        if (isSelected) {
            const filtered = _.reject(this.selectedCartItems, (r) => { 
                return r.getProductId() === n.getProductId() && r.getProductModel() === n.getProductModel() && r.getProductColor() === n.getProductColor(); 
            });
            this.selectedCartItems = filtered;
            const sNum = this.sellerSelectedItemsNum(s);
            if (sNum.itemsNum > sNum.selectedNum && sIsSelected)
                this.removeSelectedSeller(s);
        } else {
            this.selectedCartItems.push(n);
            const sNum = this.sellerSelectedItemsNum(s);
            if (sNum.itemsNum === sNum.selectedNum && !sIsSelected)
                this.addSelectedSeller(s);
        }
    }

    isSelected(n) {
        const sel = this.selectedCartItems.find(r => r.getProductId() === n.getProductId() && r.getProductModel() === n.getProductModel() && r.getProductColor() === n.getProductColor());
        return _.isObject(sel);
    }

    addSelectedSeller(n) {
        this.selectedSellers.push(n);
    }

    removeSelectedSeller(n) {
        const filtered = _.filter(this.selectedSellers, (r) => {return r !== n;});
        this.selectedSellers = filtered;
    }

    selectSeller(n) {
        const isSelected = this.isSellerSelected(n);
        if (isSelected) {
            const filtered = _.filter(this.selectedSellers, (r) => {return r !== n;});
            this.selectedSellers = filtered;
            _.each(this.cartItems, (i) => {
                const isSelected = this.isSelected(i);
                if (i.getSellerId() === n && isSelected)
                    this.removeSelectedItem(i);
            });
        } else {
            this.selectedSellers.push(n);
            _.each(this.cartItems, (i) => {
                const isSelected = this.isSelected(i);
                if (i.getSellerId() === n && !isSelected)
                    this.addSelectedItem(i);
            });
        }
    }

    isSellerSelected(n) {
        const sel = this.selectedSellers.find(r => r === n);
        return !_.isUndefined(sel);
    }

    sellerSelectedItemsNum(n) {
        let num = {
            itemsNum: 0,
            selectedNum: 0
        };
        _.each(this.cartItems, (i) => {
            if (i.getSellerId() === n)
                num.itemsNum ++;
        });
        _.each(this.selectedCartItems, (i) => {
            const isSelected = this.isSelected(i);
            if (i.getSellerId() === n && isSelected)
                num.selectedNum ++;
        });
        return num;
    }

    checkAll() {
        if (this.isCheckedAllSelected) {
            this.setValues({
                selectedSellers: [],
                selectedCartItems: [],
                isCheckedAllSelected: false
            });
            this.selectedSellers = [];
            this.selectedCartItems = [];            
        } else {
            let s = [],
                p = [];
            _.each(this.cartItems, (i) => {
                s.push(i.getSellerId());
                p.push(i);
            });
            s = _.uniq(s);
            this.setValues({
                selectedSellers: s,
                selectedCartItems: p,
                isCheckedAllSelected: true
            });
        }
    }

    updateAmount(id, quantity) {
        // Update selected cart items
        if (this.selectedCartItems.length > 0) {
            const i = this.selectedCartItems.findIndex(k => k.getId() === id)
            const obj = this.selectedCartItems[i]
            if (obj) {
                obj.setQuantity(quantity)
                this.selectedCartItems[i] = new UserCart(Object.assign({}, obj))
            }
        }
        // Update cart items
        if (this.cartItems.length) {
            const j = this.cartItems.findIndex(m => m.getId() === id)
                obj2 = this.cartItems[j]
            if (obj2) {
                obj2.setQuantity(quantity)
                this.cartItems[j] = new UserCart(Object.assign({}, obj2))
            }
        }
        // Update time
        this.updateTime = new Date();
    }

    setValues = (vs) => {
        for (let prop in vs) {
            if (this.hasOwnProperty(prop))
                this[prop] = vs[prop];
        }
    }

    get cartItemsNum() {
        return this.cartItems.length;
    }

    get cartItemsList() {
        const data = _.chain(this.cartItems)
            .groupBy((item) => {
                return item.getSellerId();
            })
            .sortBy(group => this.cartItems.indexOf(group[0]))
            .map((data) => {
                const title = _.isObject(data[0]) ? {
                    sellerId: data[0].getSellerId(),
                    sellerName: data[0].getSellerName()
                } : {
                    sellerId: '',
                    sellerName: ''
                };
                return {
                    title,
                    data
                }
            })
            .value();
        return _.isArray(data) ? data : [];
    }

    get selectedCartItemsNum() {
        return this.selectedCartItems.length;
    }

    get selectedCartItemsSum() {
        let sum = 0;
        _.each(this.selectedCartItems, (i) => {
            sum += i.getProductPrice() * i.getQuantity();
        });
        return sum;
    }

    get selectedCartItemsShipmentSum() {
        let sum = 0;
        _.each(this.selectedCartItems, (i) => {
            if (!i.isFreeShipment())
                sum += i.getShipmentPrice();
        });
        return sum;
    }

    get selectedCartItemsTotalSum() {
        return this.selectedCartItemsSum + this.selectedCartItemsShipmentSum;
    }
}

export default CartStore;