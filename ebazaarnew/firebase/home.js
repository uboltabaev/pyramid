import firestore from '@react-native-firebase/firestore';

class Home {
    slides = null;
    discount_categories = null;
    constructor(data) {
        this.setValues(data);
    }
    setValues(data) {
        for (let prop in data) {
            if (this.hasOwnProperty(prop))
                this[prop] = data[prop];
        }
    }
    getSlides() {
        return this.slides;
    }
    getDiscountCategories() {
        return this.discount_categories;
    }
}

class HomeDb {
    /**
     * Gets home data
     * @returns Promise
     */
    static getHome() {
        return new Promise(async (resolve, reject) => {
            try {
                const home = await firestore()
                    .collection('home')
                    .doc('DGnXkd2JOAYakz9ijdDT')
                    .get();

                let response = null;
                if (home.exists)
                    response = new Home(home.data())

                resolve(response);

            } catch (error) {
                reject(error);
            }
        });
    }
}

export default HomeDb;