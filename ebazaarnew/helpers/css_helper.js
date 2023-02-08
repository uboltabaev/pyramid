import { StyleSheet } from 'react-native';

import { 
    APP_MAIN_COLOR, 
    APP_MAIN_COLOR_OPACITY_10, 
    LINK_COLOR,
    ERROR_TEXT_COLOR, 
    //STATUS_BAR_HEIGHT, 
    //SCREEN_HEIGHT,
    GET_RED_COLOR 
} from '../constants/app';

const STATUS_BAR_HEIGHT = 14;
const SCREEN_HEIGHT = 120;

export default StyleSheet.create({
    "bold": {
        fontWeight: "bold"
    },
    "image": {
        width: '100%',
        height: '100%'
    },
    "frontend.container": {
        flex: 1, 
        flexDirection: 'column', 
        justifyContent: "flex-start",
        backgroundColor: '#f5f5f5'
    },
    "frontend.content": {
        flex: 1,
        paddingLeft: 15,
        paddingRight: 15,
        paddingTop: 15,
        paddingBottom: 10
    },
    "frontend.header": {
        height: 72,
        backgroundColor: '#fff',
        zIndex: 999999,
    },
    "frontend.headerInner": {
        paddingTop: 35,
        paddingBottom: 6,
        paddingLeft: 20,
        paddingRight: 20
    },
    "frontend.title": {
        fontSize: 24,
        lineHeight: 26,
        fontWeight: "bold"
    },
    "frontend.titleSmall": {
        paddingTop: 4,
        fontSize: 18,
        fontWeight: "bold"
    },
    "tab": {
        flex: 1,
        flexDirection: "row",
        borderRadius: 5,
        backgroundColor: "#fff"
    },
    "tab.item": {
        paddingTop: 10,
        paddingBottom: 10,
        flex: 1,
        alignItems: 'center',
        flexWrap: "nowrap"
    },
    "tab.icon": {
        height: 28
    },
    "tab.item.text": {
        textAlign: "center",
        fontSize: 12,
        paddingTop: 3
    },
    "orders.title": {
        fontSize: 16,
        fontWeight: "bold",
        marginLeft: 12
    },
    "menu.button": {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        paddingTop: 15,
        paddingBottom: 15,
        paddingLeft: 15,
        paddingRight: 15,
        justifyContent: 'space-between'
    },
    "menu.button.text": {
        fontSize: 15,
        color: '#3b3e45'
    },
    "menu.button.text.value": {
        color: '#8a8a92',
        fontSize: 13
    },
    "menu.button.products_list": {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        paddingTop: 12,
        paddingBottom: 12,
        paddingLeft: 15,
        paddingRight: 15
    },
    "menu.icon_text": {
        marginLeft: 12,
        flex: 1
    },
    "section": {
        backgroundColor: '#fff',
        marginBottom: 10,
        width: '100%'
    },
    "error": {
        color: ERROR_TEXT_COLOR,
        fontSize: 12
    },
    "darkPage.container": {
        flex: 1, 
        flexDirection: 'column', 
        justifyContent: "flex-start",
        backgroundColor: '#fff'
    },
    "darkPage.header": {
        backgroundColor: "#000",
        paddingTop: 25,
        height: 80,
        width: '100%',
        position: 'relative',
        zIndex: 99999
    },
    "darkPage.innerHeader": {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        paddingRight: 20,
    },
    "darkPage.title": {
        marginLeft: 20,
        fontSize: 18,
        color: '#fff',
        paddingTop: 7,
        paddingBottom: 10,
        flex: 1
    },
    "backIcon": {
        padding: 15
    },
    "xIcon": {
        paddingHorizontal: 17,
        paddingVertical: 19
    },
    "backRipple": {
        paddingRight: 0,
        marginRight: 15, 
        paddingLeft: 10, 
        marginLeft: -10
    },
    "lightPage.container": {
        flex: 1, 
        flexDirection: 'column', 
        justifyContent: "flex-start",
        backgroundColor: '#fff'
    },
    "lightPage.header": {
        backgroundColor: "#fff",
        paddingTop: 25,
        height: 74,
        position: "relative",
        zIndex: 6666
    },
    "lightPage.innerHeader": {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
    },
    "lightPage.content": {
        flex: 1,
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 15,
        paddingBottom: 10
    },
    "empty.content": {
        flex: 1,
        backgroundColor: '#f5f5f5',
        paddingLeft: 20,
        paddingRight: 20,
        alignItems: "center",
        justifyContent: "center"
    },
    "empty.content.text": {
        textAlign: "center",
        color: "#999",
        fontSize: 16,
        marginTop: 10,
        width: "80%"
    },
    "top_section": {
        marginBottom: 20,
        flex: 1,
        flexDirection: "row",
        flexWrap: "wrap",
        paddingLeft: 3,
        paddingRight: 3
    },
    "subcategory.image": {
        width: 36,
        height: 36
    },
    "flexRowCentered": {
        flex: 1,
        flexDirection: "row",
        alignItems: 'center',
        justifyContent: "space-between"
    },
    "flexRowStart": {
        flex: 1,
        flexDirection: "row",
        alignItems: 'flex-start',
        justifyContent: "space-between"
    },
    "flexSingleCentered": {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    "overlay": {
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.2)'
    },
    "drawer": {
        marginTop: STATUS_BAR_HEIGHT,
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#fff'
    },
    "drawer.content": {
        height: SCREEN_HEIGHT - 50 - STATUS_BAR_HEIGHT,
        minHeight: SCREEN_HEIGHT - 50 - STATUS_BAR_HEIGHT,
        paddingLeft: 10,
        paddingRight: 10
    },
    "footer.buttons": {
        height: 50
    },
    "footer.buttons.inner": {
        flex: 1,
        flexDirection: "row"
    },
    "textInput": {
        flex: 1,
        borderWidth: 1,
        borderColor: "#e0e0e0",
        borderRadius: 3,
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 4,
        paddingBottom: 5
    },
    "verticalDivider": {
        width: 10
    },
    "horizontalDivider": {
        height: 10
    },
    "font12Centered": {
        fontSize: 12,
        textAlign: "center"
    },
    "flex": {
        flex: 1
    },
    "listLoading": {
        justifyContent: 'center', 
        backgroundColor: '#ebebeb', 
        height: 42,
        marginTop: 8
    },
    "listLoadingText": {
        color: '#9a9a9a', 
        textAlign: 'center', 
        fontSize: 12, 
        paddingBottom: 1
    },
    "productTitle": {
        fontSize: 11, 
        color: '#333'
    },
    "productPrice": {
        fontWeight: 'bold', 
        fontSize: 15,
    },
    "productDiscountBox": {
        paddingTop: 10, 
        justifyContent: "flex-start"
    },
    "productDiscountPrice": {
        color: '#9a9a9a', 
        fontSize: 11, 
        paddingRight: 3, 
        textDecorationStyle: 'solid', 
        textDecorationLine: 'line-through',
        textDecorationColor: APP_MAIN_COLOR
    },
    "productDiscountPercent": {
        fontSize: 12, 
        marginLeft: 5, 
        borderRadius: 3, 
        paddingRight: 5, 
        paddingLeft: 5, 
        backgroundColor: APP_MAIN_COLOR_OPACITY_10(), 
        color: APP_MAIN_COLOR
    },
    "ratingText": {
        fontSize: 10,
        paddingLeft: 5
    },
    "productSectionTitle": {
        fontSize: 15,
        fontWeight: 'bold',
        paddingBottom: 10
    },
    "productSectionTitle2": {
        fontSize: 15,
        fontWeight: 'bold',
        paddingTop: 10
    },
    "couponContainer": {
        paddingTop: 10,
        paddingLeft: 12,
        paddingRight: 12,
    },
    "couponInnerContainer": {
        paddingBottom: 15,
        borderBottomColor: "#ebebeb",
        borderBottomWidth: 1
    },
    "link": {
        fontSize: 12,
        color: LINK_COLOR,
        padding: 5
    },
    "link2": {
        fontSize: 14,
        color: LINK_COLOR,
        padding: 5,
        paddingLeft: 0
    },
    "link3": {
        fontSize: 12,
        color: LINK_COLOR,
        padding: 5,
        margin: -5,
        marginRight: 0
    },
    "standartLink": {
        fontSize: 14,
        color: LINK_COLOR,
        padding: 5,
        margin: -5
    },
    "standartLink2": {
        fontSize: 14,
        color: LINK_COLOR,
        padding: 10,
        margin: -10
    },
    "linkMargin": {
        padding: 5,
    },
    "modal": {
        flex: 1,
        backgroundColor: "#fff",
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10
    },
    "modalX": {
        position: 'absolute',
        top: 2,
        right: 15,
        padding: 5,
        zIndex: 9999999
    },
    "padding10": {
        padding: 10
    },
    "inline": {
        flexDirection:'row', 
        flexWrap:'wrap'
    },
    "questionBubbleText": {
        fontSize: 13, 
        left: 9, 
        top: 1
    },
    "answerBubbleText": {
        fontSize: 16,
        lineHeight: 16,
        left: 6, 
        top: -1
    },
    "badge": {
        position: 'absolute',
        zIndex: 9999,
        right: -5,
        top: -4,
        backgroundColor: GET_RED_COLOR(),
        borderRadius: 7.5,
        width: 15,
        height: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    "badgeText": {
        textAlign: 'center',
        color: 'white', 
        fontSize: 9,
        lineHeight: 12 
    },
    "cartBadge": {
        position: 'absolute',
        right: -7,
        top: 0,
        backgroundColor: GET_RED_COLOR(),
        borderRadius: 10,
        width: 20,
        height: 20,
        zIndex: 99999,
        justifyContent: 'center',
        alignItems: 'center'
    },
    "cartBadgeText": {
        textAlign: 'center',
        color: 'white', 
        fontSize: 11,
        lineHeight: 14 
    },
    "giftContainer": {
        position: 'absolute',
        bottom: 0,
        right: 6,
        width: 48, 
        height: 48,
        opacity: 0.9
    },
    "linkMargin5": {
        margin: -5,
        padding: 5
    },
    "SMSText": {
        color: LINK_COLOR,
        paddingVertical: 5,
        paddingHorizontal: 5
    },
    "SMSLinkContainer": {
        flex: 1,
        alignItems: 'flex-end',
        justifyContent: 'flex-end'
    },
    "uppercase": {
        textTransform: 'uppercase'
    },
    "shipmentDesc": {
        color: "#989898",
        fontSize: 12
    },
    "modalMenuContainer": {
        backgroundColor: '#fff', 
        width: '100%', 
        borderRadius: 3, 
        paddingVertical: 2
    },
    "modalMenuButton": {
        paddingTop: 15,
        paddingBottom: 15,
        paddingLeft: 25,
        paddingRight: 25
    },
    "modalMenuButtonText": {
        fontSize: 16
    }
});