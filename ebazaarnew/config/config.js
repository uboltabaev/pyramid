const CONFIG = Object.freeze({
    APP_NAME: 'eBazaar',
    APP_DESC: 'Online ecommmerce platform for small businesses and entrepreneurs',
    ADMINISTRATOR_EMAIL: 'umid.boltabaev@gmail.com',
    SENDGRID: {
        API_KEY: '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',
        URL: 'https://api.sendgrid.com/v3/mail/send'    
    },
    FIREBASE: {
        apiKey: "AIzaSyB0ay4p454awhzQExi8RYLWzf1KZXDE8_s",
        authDomain: "ebazaar-78afa.firebaseapp.com",
        databaseURL: "https://ebazaar-78afa.firebaseio.com/",
        projectId: "ebazaar-78afa",
        storageBucket: "ebazaar-78afa.appspot.com"
    },
    SQLITE: {
        dbName: "db.ebazaar"
    },
    FACEBOOK: {
        appID: "646549269223745",
        appSecret: "67d017163965c6ff101b513091de6a96"
    },
    OAuth2: {
        googleExpoClientID: "316500527895-ari54qiio1va7gtge7n10n1n8pt0rfua.apps.googleusercontent.com",
        iOSExpoClientID: "316500527895-7d8s0l2ulpsofa08isloi987c2u4auoh.apps.googleusercontent.com"
    }
});

export default CONFIG;