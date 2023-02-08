import React, { useState, useEffect, useRef, useReducer } from 'react';
import { StyleSheet, View, Text, ScrollView, ActivityIndicator } from 'react-native';
import i18n from 'i18n-js';
import Ripple from 'react-native-material-ripple';
import { reaction } from 'mobx';
import { observer, inject } from 'mobx-react';
import _ from 'underscore';
import CategoriesDb from '../firebase/categories';
import SubCategoriesDb, { SUB_CATEGORIES_TYPE } from '../firebase/sub_categories';
import CssHelper from "../helpers/css_helper";
import { SCREEN_WIDTH, SCREEN_HEIGHT, APP_MAIN_COLOR } from '../constants/app';
import LightHeader from "../components/misc/light_header";
import Collapsible from '../components/ui/collapsible';
import TouchableOpacity from '../components/ui/touchable_highlight';
import ImageStorage from '../components/ui/image_storage';
import RefreshPage from '../components/ui/refresh_page';
import FileHelper from '../helpers/file_helper';
import StarIcon from '../components/icons/categories/star_icon';
import WomanDressIcon from '../components/icons/categories/woman_dress_icon';
import ManDressIcon from '../components/icons/categories/man_dress_icon';
import SmartphoneIcon from '../components/icons/categories/smartphone_icon';
import BabyBottleIcon from '../components/icons/categories/baby_bottle_icon';
import WheelIcon from '../components/icons/categories/wheel_icon';
import DiamondRingIcon from '../components/icons/categories/diamond_ring_icon';
import WathIcon from '../components/icons/categories/watch_icon';
import NotebookIcon from '../components/icons/categories/notebook_icon';
import BagIcon from '../components/icons/categories/bag_icon';
import FlowerIcon from '../components/icons/categories/flower_icon';
import CameraIcon from '../components/icons/categories/camera_icon';
import MirrorIcon from '../components/icons/categories/mirror_icon';
import BallIcon from '../components/icons/categories/ball_icon';
import ShoeIcon from '../components/icons/categories/shoe_icon';
import LightIcon from '../components/icons/categories/light_icon';
import BearIcon from '../components/icons/categories/bear_icon';
import WeddingCoupleIcon from '../components/icons/categories/wedding_couple_icon';
import SofaIcon from '../components/icons/categories/sofa_icon';
import PlugIcon from '../components/icons/categories/plug_icon';
import HamburgerIcon from '../components/icons/categories/hamburger_icon';
import CalculatorIcon from '../components/icons/categories/calculator_icon';
import JuicerIcon from '../components/icons/categories/juicer_icon';
import SocketIcon from '../components/icons/categories/socket_icon';
import CarnivalMaskIcon from '../components/icons/categories/carnival_mask_icon';
import WigIcon from '../components/icons/categories/wig_icon';
import DrillIcon from '../components/icons/categories/drill_icon';
import CctvIcon from '../components/icons/categories/cctv_icon';
import HatIcon from '../components/icons/categories/hat_icon';
import BraIcon from '../components/icons/categories/bra_icon';

const IMAGE_WIDTH = (SCREEN_WIDTH - 125) / 3;

const categorySvg = (name) => {
    switch(name) {
        case 'Popular categories':
            return <StarIcon width={23} height={23} color="#000"/>
        case 'Women wear':
            return <WomanDressIcon width={29} height={29} color="#000"/>
        case 'Men wear':
            return <ManDressIcon width={24} height={24} color="#000"/>
        case 'Smartphones and accessories':
            return <SmartphoneIcon width={24} height={24} color="#000"/>
        case 'Mother and baby':
            return <BabyBottleIcon width={26} height={26} color="#000"/>
        case 'Auto and moto goods':
            return <WheelIcon width={24} height={24} color="#000"/>
        case 'Jewelery and accessories':
            return <DiamondRingIcon width={24} height={24} color="#000"/>    
        case 'Wrist watch':
            return <WathIcon width={28} height={28} color="#000"/>
        case 'Computers and office':
            return <NotebookIcon width={32} height={32} color="#000"/>
        case 'Bags and suitcases':
            return <BagIcon width={25} height={25} color="#000"/>
        case 'House and pet supplies':
            return <FlowerIcon width={30} height={30} color="#000"/>
        case 'Electronics':
            return <CameraIcon width={23} height={23} color="#333"/>
        case 'Health and beauty':
            return <MirrorIcon width={30} height={30} color="#000"/>
        case 'Sports and entertainment':
            return <BallIcon width={23} height={23} color="#333"/>
        case 'Shoes':
            return <ShoeIcon width={27} height={27} color="#000"/>
        case 'Lighting':
            return <LightIcon width={26} height={26} color="#000"/>
        case 'Toys and hobbies':
            return <BearIcon width={28} height={28} color="#000"/>
        case 'Everything for weddings and accessories':
            return <WeddingCoupleIcon width={30} height={30} color="#000"/>
        case 'Furniture':
            return <SofaIcon width={25} height={25} color="#000"/>
        case 'Electronic components and equipment':
            return <PlugIcon width={28} height={28} color="#000"/>
        case 'Food':
            return <HamburgerIcon width={23} height={23} color="#000"/>
        case 'Stationery':
            return <CalculatorIcon width={25} height={25} color="#000"/>
        case 'Appliances':
            return <JuicerIcon width={27} height={27} color="#000"/>
        case 'Repair and arrangement':
            return <SocketIcon width={28} height={28} color="#000"/>
        case 'Thematic clothing and accessories':
            return <CarnivalMaskIcon width={27} height={27} color="#333"/>
        case 'Stands and wigs':
            return <WigIcon width={26} height={26} color="#000"/>
        case 'Instruments':
            return <DrillIcon width={29} height={29} color="#333"/>
        case 'Security':
            return <CctvIcon width={28} height={28} color="#000"/>
        case 'Clothing accessories':
            return <HatIcon width={30} height={30} color="#333"/>
        case 'Underwear and pajamas':
            return <BraIcon width={26} height={26} color="#000"/>            
        default: 
            return null;    
    }
}

const splitSubCategories = (subCategories) => {
    const categories = [],
        popularCategories = [],
        brands = [];
    _.each(subCategories, (subCategory) => {
        switch(subCategory.type) {
            case SUB_CATEGORIES_TYPE.POPULAR_CATEGORY:
                popularCategories.push(subCategory);
                break;
            case SUB_CATEGORIES_TYPE.BRAND:
                brands.push(subCategory);
                break;
            default:
                categories.push(subCategory);
        }
    });
    return {
        categories,
        popularCategories,
        brands
    };
}

const CategoryBox = React.memo(({ category, i, locale, navigation }) => {
    const imageStorageUri = FileHelper.getImageStorage200x200(category.image_storage_uri);
    const navigateToList = () => {
        navigation.navigate('ProductsList');
    }

    return (
        <View key={category.image_storage_uri} style={styles.categoryBox}>
            <Ripple style={CssHelper['flex']} rippleDuration={300} rippleOpacity={0.12} rippleFades={false} onPress={navigateToList}>
                <View style={styles.categoryImageBox}>
                    <ImageStorage storageUri={imageStorageUri} imageStyle={{borderRadius: 5}} brightness={true}/>
                </View>
                <Text style={styles.categoryTitle} numberOfLines={2} textBreakStrategy="simple">
                    {category[locale]}
                </Text>
            </Ripple>
        </View>
    );
})

const BrandBox = React.memo(({ category }) => {
    const navigateToList = () => {
        navigation.navigate('ProductsList');
    }

    return (
        <View key={category.getImageStorageUri()} style={styles.brandBox}>
            <Ripple style={CssHelper['flex']} rippleDuration={300} rippleOpacity={0.12} rippleFades={false} onPress={navigateToList}>
                <View style={styles.brandImageBox}>
                    <ImageStorage storageUri={category.getImageStorageUri()}/>
                </View>
            </Ripple>
        </View>
    );
})


const CategoriesContainer = inject('mobxStore')(observer(({ mobxStore, navigation }) => {
    const [isReady, setIsReady] = useState(false)

    const selectedTab = mobxStore.categoriesStore.selectedTab
    const scrollViewRef = useRef(null)
    let timeout = null

    const [, forceUpdate] = useReducer(x => x + 1, 0)

    useEffect(() => {
        mobxStore.categoriesStore.setValues({
            selectedTab: {
                id: 1,
                name: 'Popular categories'
            }
        });
        loadData();
    }, [])

    useEffect(() => {
        if (_.isObject(selectedTab)) {
            const categoryId = selectedTab.id;
            // Before loading data from db, check if it is not loaded yet
            if (!mobxStore.categoriesStore.subCategoryExist(categoryId) && mobxStore.categoriesStore.categoriesLoaded)
                getSubCategories(categoryId);
        }
    }, [selectedTab])

    reaction(
        () => selectedTab,
        (selectedTab) => {
            if (_.isObject(selectedTab)) {
                const categoryId = selectedTab.id;
                // Before loading data from db, check if it is not loaded yet
                if (!mobxStore.categoriesStore.subCategoryExist(categoryId))
                    getSubCategories(categoryId);
            }
        }
    );

    const loadData = () => {
        const categoriesLoaded = mobxStore.categoriesStore.categoriesLoaded,
            isSubCategoriesLoaded = mobxStore.categoriesStore.isSubCategoriesLoaded;
        if (!categoriesLoaded && !isSubCategoriesLoaded) {
            CategoriesDb.getCategories().then((categories) => {
                const selectedTabId = mobxStore.categoriesStore.selectedTab.id || 0;
                SubCategoriesDb.getSubCategories(selectedTabId).then((subCategories) => {
                    const splitted = splitSubCategories(subCategories);
                    mobxStore.categoriesStore.setValues({
                        categories,
                        categoriesLoaded: true,
                        subCategories: [{categoryId: selectedTabId, data: splitted}],
                        subCategoiresLoading: false
                    });
                    setIsReady(true);
                }, (error) => {
                    mobxStore.categoriesStore.setValues({
                        categoriesErrorLoading: true
                    });
                });
            }, (error) => {
                mobxStore.categoriesStore.setValues({
                    categoriesErrorLoading: true
                });
            });    
        } else {
            setTimeout(() => {
                setIsReady(true)
            }, 1);
        }
    }

    const getSubCategories = (categoryId) => {
        SubCategoriesDb.getSubCategories(categoryId).then((subCategories) => {
            const splitted = splitSubCategories(subCategories);
            mobxStore.categoriesStore.addSubCategory({
                categoryId,
                data: splitted
            });
        }, (error) => {
            mobxStore.categoriesStore.setValues({
                subCategoriesErrorLoading: true
            });
        });
    }

    const refreshCategories = () => {
        mobxStore.categoriesStore.setValues({
            categoriesErrorLoading: false,
            categoriesLoaded: false
        });
        timeout = setTimeout(() => {
            loadData()
        }, 800);
    }

    const refreshSubCategories = () => {
        const e = mobxStore.categoriesStore.subCategoryExist(i.id);
        mobxStore.categoriesStore.setValues({
            subCategoriesErrorLoading: false,
            subCategoiresLoading: e ? false : true
        });
        timeout = setTimeout(() => {
            const selectedTabId = mobxStore.categoriesStore.selectedTab.id;
            getSubCategories(selectedTabId);
        }, 800);
    }

    const changeTab = (i) => {
        const e = mobxStore.categoriesStore.subCategoryExist(i.id);
        mobxStore.categoriesStore.setValues({
            selectedTab: i,
            subCategoiresLoading: true
        });
        setTimeout(() => {
            mobxStore.categoriesStore.setValues({
                subCategoiresLoading: e ? false : true
            });
            if (e) {
                scrollViewRef.current.scrollTo({x: 0, y: 0, animated: false});
            }    
        }, 0);
    }

    const locale = i18n.locale
    const categoriesNum = mobxStore.categoriesStore.categories.length

    return (
        <View style={CssHelper['flex']}>
            <View style={CssHelper['lightPage.container']}>
                <LightHeader navigation={navigation}/>
                <View style={styles.content}>
                    { mobxStore.categoriesStore.categoriesErrorLoading ? (
                        <RefreshPage refreshHandler={refreshCategories} backgroundColor="#fff"/>
                    ) : (
                        !isReady ? (
                            <View style={CssHelper['flexSingleCentered']}>
                                <ActivityIndicator size="large" color={APP_MAIN_COLOR}/>
                            </View>
                        ) : (
                            <View style={styles.content}>
                                <View style={styles.tabBar}>
                                    <ScrollView style={CssHelper['flex']} showsVerticalScrollIndicator={false} removeClippedSubviews={true}>
                                        <View style={CssHelper['flex']}>
                                            { mobxStore.categoriesStore.categories.map((category, i) =>
                                                <Ripple key={i} 
                                                    rippleDuration={400} 
                                                    rippleOpacity={0.30} 
                                                    rippleSize={200}
                                                    onPress={() => changeTab(category)}
                                                    style={(i + 1) === categoriesNum && ({marginBottom: 20})}
                                                >
                                                    <View style={[styles.tab, category.getId() === selectedTab.id && (styles.selectedTab)]}>
                                                        <View style={[CssHelper['flexSingleCentered'], styles.tabInner]}>
                                                            {categorySvg(category.getName())}
                                                            <Text style={styles.tabText} numberOfLines={2} textBreakStrategy="simple">
                                                                {category[locale]}
                                                            </Text>
                                                        </View>
                                                    </View>
                                                </Ripple>
                                            )}
                                        </View>
                                    </ScrollView>
                                </View>
                                <View style={styles.tabContent}>
                                    { mobxStore.categoriesStore.subCategoriesErrorLoading ? (
                                        <RefreshPage refreshHandler={refreshSubCategories} backgroundColor="#fff"/>
                                    ) : (
                                        mobxStore.categoriesStore.subCategoiresLoading ? (
                                            <View style={[CssHelper['flexSingleCentered'], {marginTop: -20}]}>
                                                <ActivityIndicator size="small" color={APP_MAIN_COLOR}/>
                                            </View>
                                        ) : (
                                            <ScrollView ref={scrollViewRef}
                                                style={CssHelper['flex']} 
                                                showsVerticalScrollIndicator={false}
                                                removeClippedSubviews={true}
                                            >
                                                <View style={[CssHelper['flex'], styles.innerScroll]}>
                                                    { mobxStore.categoriesStore.selectedPopularCategories.length > 0 &&
                                                        <View style={CssHelper['flex']}>
                                                            <View style={styles.title}>
                                                                <Text style={styles.titleText}>
                                                                    {i18n.t('category:popular_categories', {defaultValue: 'Популярные категории'})}
                                                                </Text>
                                                            </View>
                                                            <View style={[CssHelper['flexRowCentered'], styles.categoryBoxContainer]}>
                                                                { mobxStore.categoriesStore.selectedPopularCategories.map((popularCategory, i) =>
                                                                    <CategoryBox key={i} category={popularCategory} i={i} locale={locale} navigation={navigation}/>
                                                                )}
                                                            </View>
                                                        </View>
                                                    }
                                                    { mobxStore.categoriesStore.selectedPopularCategories.length > 0 && mobxStore.categoriesStore.selectedBrands.length > 0 &&
                                                        <View style={styles.divider}/>
                                                    }
                                                    { mobxStore.categoriesStore.selectedBrands.length > 0 &&
                                                        <View style={CssHelper['flex']}>
                                                            <View style={styles.title}>
                                                                <Text style={styles.titleText}>
                                                                    {i18n.t('category:popular_brands', {defaultValue: 'Популярные бренды'})}
                                                                </Text>
                                                            </View>
                                                            <View style={[CssHelper['flexRowCentered'], styles.brandBoxContainer]}>
                                                                { mobxStore.categoriesStore.selectedBrands.map((brand, i) =>
                                                                    <BrandBox key={i} category={brand} navigation={navigation}/>
                                                                )}
                                                            </View> 
                                                        </View>
                                                    }
                                                    <View style={styles.categories}>
                                                        { mobxStore.categoriesStore.selectedSubCategories.map((subCategory, i) => {
                                                            if (subCategory.getSubSubCategories()) {
                                                                return (
                                                                    <Collapsible title={subCategory[locale]}
                                                                        preCollapsed={true}
                                                                        titleStyle={styles.categoryTitleCollapsible}
                                                                        singleLineText={true}
                                                                        contentStyle={[CssHelper['flexRowCentered'], styles.categoryBoxContainer]}
                                                                        titleContainerStyle={styles.section} 
                                                                        arrowColor="#363636" 
                                                                        touchableHighlight={true} 
                                                                        key={subCategory.getId()}
                                                                    >
                                                                        { subCategory.getSubSubCategories().map((subSubCategory, i) =>
                                                                            <CategoryBox key={i} category={subSubCategory} i={i} locale={locale} navigation={navigation}/>
                                                                        )}
                                                                    </Collapsible>        
                                                                );
                                                            } else {
                                                                return (
                                                                    <TouchableOpacity activeOpacity={1.0} key={subCategory.getId()}>
                                                                        <View style={styles.section}>
                                                                            <Text numberOfLines={1}>
                                                                                {subCategory[locale]}
                                                                            </Text>
                                                                        </View>
                                                                    </TouchableOpacity>    
                                                                );
                                                            }
                                                        })}
                                                    </View>
                                                </View>
                                            </ScrollView>
                                        )
                                    )}
                                </View>
                            </View>
                        )    
                    )}
                </View>
            </View>
        </View>
    );

}))

const styles = StyleSheet.create({
    content: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#fff'
    },
    tabBar: {
        backgroundColor: '#fbfbfb',
        width: 90,
    },
    tabContent: {
        paddingLeft: 10,
        paddingRight: 5,
        flex: 1,
    },
    tab: {
        borderBottomColor: '#ebebeb',
        borderBottomWidth: 0.5,
        height: (SCREEN_HEIGHT - 74) / 8,
        borderLeftColor: '#fbfbfb',
        borderLeftWidth: 3
    },
    selectedTab: {
        backgroundColor: '#fff',
        borderLeftColor: '#000000',
        borderLeftWidth: 3
    },
    tabText: {
        textAlign: 'center',
        color: '#3d3d45',
        fontSize: 10.5,
        paddingTop: 5,
        paddingHorizontal: 5
    },
    innerScroll: {
        paddingTop: 10,
        paddingBottom: 5
    },
    title: {
        marginBottom: 16
    },
    titleText: {
        fontSize: 14,
    },
    categoryBoxContainer: {
        justifyContent: 'flex-start',
        alignItems: 'flex-start', 
        flexWrap: 'wrap'
    },
    brandBoxContainer: {
        justifyContent: 'flex-start',
        alignItems: 'flex-start', 
        flexWrap: 'wrap',
        paddingBottom: 5
    },
    categoryBox: {
        marginRight: 6.5,
        width: IMAGE_WIDTH,
        height: 120,
        marginBottom: 5
    },
    brandBox: {
        marginRight: 6.5,
        width: IMAGE_WIDTH,
        height: 45,
        marginBottom: 5
    },
    brandImageBox: {
        backgroundColor: '#f5f5f5',
        borderRadius: 5,
        width: IMAGE_WIDTH,
        height: 45,
        padding: 5
    },
    categoryImageBox: {
        backgroundColor: '#f5f5f5',
        borderRadius: 5,
        width: IMAGE_WIDTH,
        height: IMAGE_WIDTH
    },
    categoryTitle: {
        textAlign: 'center',
        fontSize: 10,
        lineHeight: 14,
        paddingVertical: 5
    },
    categoryTitleCollapsible: {
        paddingRight: 15
    },
    image: {
        width: '100%',
        height: '100%'
    },
    categories: {
        marginTop: 5
    },
    section: {
        borderTopWidth: 0.5,
        borderTopColor: '#ebebeb',
        flex: 1,
        justifyContent: 'center',
        paddingVertical: 15,
        paddingRight: 10,
        paddingLeft: 1
    },
    divider: {
        borderTopWidth: 0.5,
        borderTopColor: '#ebebeb',
        flex: 1,
        marginBottom: 15
    }
});

export default CategoriesContainer;