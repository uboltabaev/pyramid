import React, { useReducer, useEffect, useState, useRef, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, Text, TouchableOpacity, SectionList, Image, Animated } from 'react-native';
import { observer, inject } from 'mobx-react';
import { useDispatch } from "react-redux";
import i18n from 'i18n-js';
import moment from 'moment';
import _ from 'underscore';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons'; 
import Swiper from 'react-native-swiper';
import { Surface } from 'react-native-paper';
import { SCREEN_WIDTH, APP_MAIN_COLOR } from '../../constants/app';
import { SET_FLASH_MESSAGE } from '../../redux/constants/action-types';
import Storage from '../../firebase/storage';
import CssHelper from "../../helpers/css_helper";
import DarkPage from "../../components/misc/dark_page";
import UserHistoryDb from '../../firebase/user_history';
import DateHelper from '../../helpers/date_helper';
import MiscHelper from '../../helpers/misc_helper';
import { Position } from '../../components/ui/flash_message';

const MODE = Object.freeze({
    WEEK: 'week',
    MONTH: 'month'
});
const DAY_TYPE = Object.freeze({
    NEXT_MONTH: 'nextMonth',
    CURRENT_MONTH: 'currentMonth',
    PREV_MONTH: 'prevMonth'
});
const MONTH_TYPE = Object.freeze({
    PREV_MONTH: 'prevMonth',
    CURRENT_MONTH: 'currentMonth'
});
const CELL_WIDTH = (SCREEN_WIDTH - 30) / 7;
const MIN_HEIGHT = CELL_WIDTH + 76;
const MAX_HEIGHT = (CELL_WIDTH * 6) + 76;

const GenerateMonth = (month = MONTH_TYPE.CURRENT_MONTH) => {
    const today = month === MONTH_TYPE.PREV_MONTH ? moment().subtract(1, 'months') : moment(),
        daysInMonth = today.daysInMonth(),
        dates = []

    let startOfMonth = today.startOf('month').day(),
        startOfMonthCounter = startOfMonth,
        nextMonthCounter = 1,
        rowIndex = 0

    for (let x = 0; x < 42; x++) {
        let date = null,
            type = null
        
        // Prev month days
        if (startOfMonthCounter > 1) {
            for (let y = 0; y <= (startOfMonthCounter - 1); y++) {
                date = moment(today).subtract(y, 'days')
                type = DAY_TYPE.PREV_MONTH
            }
            startOfMonthCounter --;
        } else {
            const y = x - (startOfMonth - 1);
            if (y < daysInMonth) {
                
                // Current month days
                date = today.toDate()
                date.setDate(y + 1)
                if (DateHelper.isToday(date))
                    rowIndex = Math.ceil((y + 1) / 7)
                date = moment(date)
                type = DAY_TYPE.CURRENT_MONTH
            } else {
                
                // Next month dates
                date = today.toDate()
                date.setDate(nextMonthCounter)
                date.setMonth(date.getMonth() + 1)
                date = moment(date)
                type = DAY_TYPE.NEXT_MONTH
                nextMonthCounter ++
            }
        }
        dates.push({
            type,
            obj: date.toDate(),
            moment: date
        })
    }

    return {
        rowIndex,
        dates
    }
}

const GetCurrentWeek = () => {
    const currentDate = moment(),
        weekStart = currentDate.clone().startOf('week'),
        days = []
    for (let i = 0; i <= 6; i++) {
        const date = moment(weekStart).add(i, 'days'),
            data = {
                obj: date.toDate(),
                moment: date
            }
        days.push(data)
    }
    return days
}

const CalculateTranslateY = (month) => {
    const today = new Date()
    let nth = 0
    _.each(month, (date, i) => {
        if (DateHelper.isSameDay(today, date.obj))
            nth = i
    })
    nth ++
    const row = Math.ceil(nth / 7)
    let y = 0;

    if (row > 1) {
        const a = row - 1;
        y = (Math.ceil(CELL_WIDTH) * (a * 3)) / -2
    }
    return y;
}

const Calendar = inject('mobxStore')(observer(({ mobxStore, availableDates }) => {
    const dateHelper = new DateHelper(i18n.locale);
    const { weekdays, weekDates, currentMonth, prevMonth } = useMemo(() => ({
        weekdays: dateHelper.getDayNamesShort(),
        weekDates: GetCurrentWeek(),
        currentMonth: GenerateMonth(),
        prevMonth: GenerateMonth(MONTH_TYPE.PREV_MONTH),
    }))
    
    const { slides, translateY } = useMemo(() => ({
        slides: [
            prevMonth['dates'],
            currentMonth['dates']
        ],
        translateY: CalculateTranslateY(currentMonth['dates'])
    }))

    const [state, setState] = useReducer(
        (state, newState) => ({...state, ...newState}),
        {
            mode: MODE.WEEK,
            height: new Animated.Value(MIN_HEIGHT),
            opacity: new Animated.Value(0),
            currentSlide: 1
        }
    )
    
    const { mode, height, opacity, currentSlide } = state
    const selectedDate = mobxStore.userStore.historySelectedDate
    let timeout = null
    
    const swiperRef = useRef(null),
        dispatch = useDispatch()

    useEffect(() => {
        timeout = setTimeout(() => {
            Animated.timing(opacity, {
                useNativeDriver: true,
                toValue: 1,
                duration: 100
            }).start()
        }, 100)
        return () => {
            clearTimeout(timeout);
        }
    }, [])

    const expand = () => {
        Animated.spring(height, {
            useNativeDriver: false,
            toValue: mode === MODE.WEEK ? MAX_HEIGHT : MIN_HEIGHT,
            duration: 300,
            bounciness: 0,
            speed: 300
        }).start(() => {
            setState({
                mode: mode === MODE.WEEK ? MODE.MONTH : MODE.WEEK
            })
        })
        if (mode === MODE.MONTH && currentSlide === 0) {
            timeout = setTimeout(() => {
                swiperRef.current.scrollBy(1, false);
            }, 50);
        }
    }

    const flashMessage = (message) => {
        dispatch({
            type: SET_FLASH_MESSAGE,
            payload: {
                text: message,
                position: Position.BOTTOM
            }
        })
    }

    const setSelected = (val) => {
        const today = new Date(),
            past = moment().subtract(30, 'days').toDate()
        if (today < val || past > val) {
            const error = i18n.t("errors:last30Days", {defaultValue: "За последние 30 дней"})
            flashMessage(error)
        } else if (!DateHelper.isSameDay(today, val) && !DateHelper.isDateInArray(val, availableDates)) {
            const error = i18n.t("errors:nothingFound", {defaultValue: "Ничего не найдено"})
            flashMessage(error)
        } else {
            mobxStore.userStore.setValues({
                historySelectedDate: val
            })    
        }
    }

    const onIndexChanged = (index) => {
        setTimeout(() => {
            setState({
                currentSlide: index
            })
        }, 1)
    }

    const cell = (date, i, type = null) => {
        return (
            <TouchableOpacity key={i} style={calStyles.cell} activeOpacity={1.0} onPress={() => setSelected(date.obj)}>
                <View style={[CssHelper['flexSingleCentered'], DateHelper.isSameDay(selectedDate, date.obj) && (calStyles.selectedContainer)]}>
                    { DateHelper.isDateInArray(date.obj, availableDates) &&
                        <View style={[calStyles.marker, {backgroundColor: DateHelper.isSameDay(selectedDate, date.obj) ? '#fff' : APP_MAIN_COLOR}]}/>
                    }
                    <Text style={[calStyles.date, (type === DAY_TYPE.PREV_MONTH || type === DAY_TYPE.NEXT_MONTH) && (calStyles.anotherMonth), DateHelper.isToday(date.obj) && (calStyles.todayText), DateHelper.isSameDay(selectedDate, date.obj) && (calStyles.selectedText)]}>
                        {date.moment.format("D")}
                    </Text>
                </View>
            </TouchableOpacity>
        )
    }

    return (
        <Animated.View style={[calStyles.container, {height}]}>
            <View style={[CssHelper['flex']]}>
                <View style={[calStyles.header]}>
                    <View style={[CssHelper['flexRowCentered']]}>
                        { weekDates.map((day, i) => 
                            <View key={i} style={calStyles.cell}>
                                <View style={CssHelper['flexSingleCentered']}>
                                    <Text style={calStyles.dayName}>{weekdays[day.obj.getDay()]}</Text>
                                </View>
                            </View>
                        )}
                    </View>
                </View>
                <Animated.View style={[CssHelper['flex'], {overflow: 'hidden', opacity}]}>
                    <Animated.View style={[calStyles.monthContent, {transform: [{translateY: height.interpolate({
                        inputRange: [0, MAX_HEIGHT],
                        outputRange: [translateY, 0],
                    })}]}]}>
                        <Swiper showsPagination={false}
                            showsButtons={false} 
                            loop={false} 
                            autoplay={false}
                            index={1} 
                            scrollEnabled={mode === MODE.WEEK ? false : true}
                            ref={swiperRef}
                            onIndexChanged={onIndexChanged}
                        >
                            { slides.map((slide, index) => {
                                return (
                                    <View key={index} style={[CssHelper['flexRowCentered'], calStyles.monthContentInner]}>
                                        { slide.map((date, i) => 
                                            cell(date, i, date.type)
                                        )}
                                    </View>
                                );
                            })}
                        </Swiper>
                    </Animated.View>
                </Animated.View>
                <TouchableOpacity onPress={expand} activeOpacity={1}>
                    <Animated.View style={[calStyles.collapse, {transform: [{rotate: height.interpolate({
                        inputRange: [MIN_HEIGHT, MAX_HEIGHT],
                        outputRange: ['0deg', '180deg'],
                        extrapolate: 'clamp'
                    })}]}]}>
                        <View style={[CssHelper['flexSingleCentered'], calStyles.collapseButton]}>
                            <SimpleLineIcons name={"arrow-down"} size={16} color="#c2c2c2"/>
                        </View>
                    </Animated.View>
                </TouchableOpacity>
            </View>
        </Animated.View>
    )
}))

Calendar.propTypes = {
    availableDates: PropTypes.array
}

Calendar.defaultProps = {
    availableDates: []
}

const calStyles = StyleSheet.create({
    container: {
        paddingHorizontal: 5,
        backgroundColor: '#fff',
    },
    marker: {
        position: 'absolute', 
        bottom: 7, 
        width: 4, 
        height: 4, 
        borderRadius: 2
    },
    header: {
        height: 40
    },
    weekContent: {
        width: '100%',
        height: CELL_WIDTH,
        position: 'absolute',
        backgroundColor: '#fff',
    },  
    monthContent: {
        height: CELL_WIDTH * 6
    },
    monthContentInner: {
        flexWrap: 'wrap'
    },
    cell: {
        width: CELL_WIDTH,
        height: CELL_WIDTH,
    },
    dayName: {
        color: '#757575'
    },
    date: {
        color: '#131313'
    },
    todayText: {
        color: APP_MAIN_COLOR
    },
    anotherMonth: {
        color: '#cdcdcd'
    },
    selectedText: {
        color: '#fff'
    },
    selectedContainer: {
        backgroundColor: APP_MAIN_COLOR,
        borderRadius: CELL_WIDTH / 2
    },
    collapse: {
        height: 36,
    },
    collapseButton: {
        zIndex: 999999
    }
});

const IMAGE_WIDTH = (SCREEN_WIDTH - 40) / 3;

const Item = React.memo(({ product, navigation }) => {
    const imageSource = Storage.makeStoragePublicUrl(product.image_200x200);

    return (
        <View style={styles.item}>
            <TouchableOpacity style={styles.imageContainer} activeOpacity={1} onPress={() => navigation.navigate('Product', {product_id: product.product_id})}>
                <Image source={{uri: imageSource}} style={[CssHelper['image'], styles.image]} resizeMode="cover" fadeDuration={0}/>
            </TouchableOpacity>
            <Text style={styles.price} numberOfLines={1}>
                {MiscHelper.price(product.price)}
            </Text>
        </View>
    )
})

const RenderItem = React.memo(({ section, index, numColumns, navigation }) => {
    if (index % numColumns !== 0) 
        return null
    const items = []
    for (let i = index; i < index + numColumns; i++) {
        if (i >= section.data.length) {
            break
        }
        items.push(<Item key={index} product={section.data[i]} navigation={navigation}/>)
    }
    return (
        <View
            style={{
                flexDirection: "row",
                justifyContent: "flex-start"
            }}
        >
            {items}
        </View>
    )
})

const HistoryContainer = inject('mobxStore')(observer(({ mobxStore, navigation }) => {
    const [errorLoading, setErrorLoading] = useState(false)
    const { uid, isHistoryLoaded, historyAvailableDates, historyListData, historyListLength } = mobxStore.userStore

    const numColumns = 3,
        dateHelper = new DateHelper(i18n.locale)

    let timeout = null

    useEffect(() => {
        mobxStore.userStore.setValues({
            historySelectedDate: new Date()
        })
        loadData()
        return () => {
            clearTimeout(timeout)
        }
    }, [])

    const loadData = () => {
        if (!isHistoryLoaded) {
            UserHistoryDb.getHistory(uid).then((historyList) => {
                setTimeout(() => {
                    mobxStore.userStore.setValues({
                        isHistoryLoaded: true,
                        historyList
                    })    
                }, 500)
            }, (error) => {
                console.log(error)
                setErrorLoading(true)
            });
        }
    }

    const refreshPage = () => {
        setErrorLoading(false)
        timeout = setTimeout(() => {
            loadData()
        }, 800)
    }

    return (
        <DarkPage i18nKey="history" 
            defaultText="История" 
            navigation={navigation}
            activityIndicator={!isHistoryLoaded && !errorLoading}
            refreshPage={errorLoading}
            refreshHandler={refreshPage}
            displayNoConnection={false}
            backgroundColor="#f5f5f5"
        >
            <View style={[styles.content]}>
                <Surface style={[styles.section, styles.calendar]}>
                    <Calendar availableDates={historyAvailableDates}/>
                </Surface>
                <View style={[styles.section, styles.items]}>
                    <SectionList contentContainerStyle={styles.sectionListContainer}
                        sections={historyListData}
                        keyExtractor={(item) => item.getId()}
                        extraData={historyListLength}
                        removeClippedSubviews={true}
                        initialNumToRender={10}
                        legacyImplementation={true}
                        renderItem={({ section, index }) => <RenderItem section={section} index={index} numColumns={numColumns} navigation={navigation}/>}
                        renderSectionHeader={({ section: { title } }) => (
                            <View style={styles.header}>
                                <Text style={styles.headerText} numberOfLines={1}>
                                    {dateHelper.getDateShort(title)}
                                </Text>
                            </View>
                        )}
                    />
                </View>
            </View>
        </DarkPage>
    )
}))

const styles = StyleSheet.create({
    content: {
        flex: 1,
        backgroundColor: '#f5f5f5'
    },
    section: {
        backgroundColor: '#fff'
    },
    calendar: {
        width: 'auto',
        minHeight: MIN_HEIGHT
    },
    sectionListContainer: {
        backgroundColor: '#fff',
    },
    price: {
        paddingTop: 4,
        fontWeight: 'bold',
        fontSize: 13,
        textAlign: 'center'
    },
    items: {
        flex: 1,
        backgroundColor: '#f5f5f5'
    },
    header: {
        borderTopWidth: 10,
        borderTopColor: '#f5f5f5',
        padding: 10,
        width: SCREEN_WIDTH
    },
    headerText: {
        fontSize: 13.5
    },
    item: {
        marginLeft: 10,
        marginBottom: 10
    },
    imageContainer: {
        width: IMAGE_WIDTH,
        height: IMAGE_WIDTH,
        borderRadius: 5
    },
    image: {
        borderRadius: 5
    }
});

export default HistoryContainer;