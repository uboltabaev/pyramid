import firestore from '@react-native-firebase/firestore';
import _ from 'underscore';

class SubRegion {
    id = null;
    ru = null;
    uz = null;
    uz_latin = null;
    region_id = null;
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
    getRegionId() {
        return this.region_id;
    }
}

class SubRegionsDb {
    /**
     * Gets sub-regions
     * @returns Promise
     */
    static getSubRegions() {
        return new Promise(async (resolve, reject) => {
            try {
                const collection = await firestore()
                    .collection('sub_regions')
                    .orderBy("sort")
                    .get()

                const subRegions = []
                collection.forEach((documentSnapshot) => {
                    const subRegion = new SubRegion(documentSnapshot.data())
                    subRegions.push(subRegion)
                })

                resolve(subRegions)
            } catch (error) {
                reject(error);
            }
        });
    }
}

export default SubRegionsDb;