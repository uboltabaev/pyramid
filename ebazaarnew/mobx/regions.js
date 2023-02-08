import { makeAutoObservable, observable, computed } from 'mobx';
import _ from 'underscore';

class RegionsStore {
    regionsLoaded = false;
    regions = [];
    selectedRegionId = null;
    selectedSubRegionId = null;
    tabIndex = 0;
    isVisible = false;

    constructor(rootStore) {
        this.rootStore = rootStore;

        makeAutoObservable(this, {
            regionsLoaded: observable,
            regions: observable,
            selectedRegionId: observable,
            selectedSubRegionId: observable,
            tabIndex: observable,
            isVisible: observable,
            selectedRegionArr: computed,
            selectedRegion: computed,
            selectedRegionData: computed,
            selectedSubRegion: computed
        });
    }

    setValues = (vs) => {
        for (let prop in vs) {
            if (this.hasOwnProperty(prop))
                this[prop] = vs[prop];
        }
    }

    setTabIndex = (v) => {
        this.tabIndex = v;
    }
    
    get selectedRegionArr() {
        if (this.selectedRegionId === null) {
            return this.regions;
        } else {
            const arr = [],
                selectedRegion = this.regions.find(r => r.id === this.selectedRegionId);
            if (selectedRegion)
                arr.push(selectedRegion);
            return arr;
        }
    }

    get selectedRegion() {
        return this.regions.find(r => r.id === this.selectedRegionId);
    }

    get selectedRegionData() {
        const selectedRegion = this.selectedRegion;
        return {
            id: selectedRegion.id,
            ru: selectedRegion.ru,
            uz: selectedRegion.uz,
            uz_latin: selectedRegion.uz_latin
        };
    }

    get selectedSubRegion() {
        const selectedRegion = this.selectedRegion;
        if (selectedRegion)
            return selectedRegion['sub_regions'].find(s => s.id === this.selectedSubRegionId);
        else 
            null;
    }
}

export default RegionsStore;