import { makeAutoObservable, observable, computed } from 'mobx';
import _ from 'underscore';

class CategoriesStore {
    categoriesLoaded = false;
    subCategoiresLoading = false;
    categoriesErrorLoading = false;
    subCategoriesErrorLoading = false;
    categories = [];
    subCategories = [];
    selectedTab = {
        id: 1,
        name: 'Popular categories'
    };

    constructor(rootStore) {
        this.rootStore = rootStore;

        makeAutoObservable(this, {
            categoriesLoaded: observable,
            subCategoiresLoading: observable,
            categoriesErrorLoading: observable,
            subCategoriesErrorLoading: observable,
            categories: observable,
            subCategories: observable,
            selectedTab: observable,
            isSubCategoriesLoaded: computed,
            selectedSubCategories: computed,
            selectedPopularCategories: computed,
            selectedBrands: computed
        });
    }
    
    addSubCategory = (subCategory) => {
        this.subCategories.push(subCategory);
        this.subCategoiresLoading = false;
    }

    subCategoryExist(categoryId) {
        const l = this.subCategories.find(v => v.categoryId === categoryId);
        return _.isUndefined(l) ? false : true;
    }

    setValues = (vs) => {
        for (let prop in vs) {
            if (this.hasOwnProperty(prop))
                this[prop] = vs[prop];
        }
    }

    get isSubCategoriesLoaded() {
        return this.subCategories.length > 0;
    }

    get selectedSubCategories() {
        const categoryId = this.selectedTab.id,
            s = this.subCategories.find(v => v.categoryId === categoryId);
        return _.isUndefined(s) ? [] : s.data.categories;
    }

    get selectedPopularCategories() {
        const categoryId = this.selectedTab.id,
            s = this.subCategories.find(v => v.categoryId === categoryId);
        return _.isUndefined(s) ? [] : s.data.popularCategories;
    }

    get selectedBrands() {
        const categoryId = this.selectedTab.id,
            s = this.subCategories.find(v => v.categoryId === categoryId);
        return _.isUndefined(s) ? [] : s.data.brands;
    }
}

export default CategoriesStore;