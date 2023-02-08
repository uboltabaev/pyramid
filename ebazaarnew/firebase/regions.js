import firestore from '@react-native-firebase/firestore';
import _ from 'underscore';
import SubRegionsDb from './sub_regions';

class Region {
    id = null;
    ru = null;
    uz = null;
    uz_latin = null;
    sub_regions = null;
    constructor(data) {
        this.setValues(data);
    }
    setValues(data) {
        for (let prop in data) {
            if (this.hasOwnProperty(prop))
                this[prop] = data[prop];
        }
    }
    getId() {
        return this.id;
    }
    getRu() {
        return this.ru;
    }
    getUz() {
        return this.uz;
    }
    getUzLatin() {
        return this.uz_latin;
    }
    getSubRegions() {
        return this.sub_regions;
    }
    setSubRegions(subRegions) {
        this.sub_regions = subRegions;
    }
    addSubRegion(subRegion) {
        if (this.sub_regions === null)
            this.sub_regions = [];
        this.sub_regions.push(subRegion);
    }
}

class RegionsDb {
    /**
     * Gets regions
     * @returns Promise
     */
    static getRegions() {
        return new Promise(async (resolve, reject) => {
            try {
                const collection = await firestore()
                    .collection('regions')
                    .orderBy("sort")
                    .get()

                const regions = []
                collection.forEach((documentSnapshot) => {
                    const region = new Region(documentSnapshot.data())
                    regions.push(region)
                })

                resolve(regions)
            } catch (error) {
                reject(error)
            }
        });
    }
    /**
     * Gets regions and sub-regions
     * @returns Promise
     */
    static getRegionsWithSubRegions() {
        return new Promise(async (resolve, reject) => {
            try {
                const regions = await RegionsDb.getRegions(),
                    subRegions = await SubRegionsDb.getSubRegions();
                if (_.isArray(regions)) {
                    _.map(regions, (region) => {
                        if (_.isArray(subRegions)) {
                            _.each(subRegions, (subRegion) => {
                                if (region.id === subRegion.region_id)
                                    region.addSubRegion(subRegion);
                            });
                        }
                        return region;
                    });
                }
                resolve(regions);
            } catch (error) {
                reject(error);
            }
        })
    }
}

export default RegionsDb;