import React, { useEffect, useReducer } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { Surface } from 'react-native-paper';
import i18n from 'i18n-js';
import { APP_MAIN_COLOR, TEXT_SHADOW, APP_MAIN_COLOR_OPACITY_70, TOAST_BG_COLOR } from '../../constants/app';
import CssHelper from "../../helpers/css_helper";
import BorderShadow, { POSITION_TOP } from '../misc/border_shadow';
import XIcon from '../icons/x2_icon';
import Toasty from '../ui/toasty';

const TOAST_DURATION = 5000;

const PostBox = React.memo(() => {
    const [state, setState] = useReducer(
        (state, newState) => ({...state, ...newState}),
        {
            question: '',
            questionInputGotFocus: false,
            displayClearButton: false,
            emptyTextError: false,
            sending: false,
            questionSent: false
        }
    )

    const { question, questionInputGotFocus, displayClearButton, emptyTextError, sending, questionSent } = state

    useEffect(() => {
        if (sending) {
            setTimeout(() => {
                setState({
                    sending: false,
                    questionSent: true,
                    question: '',
                    displayClearButton: false
                })
            }, 2000)
        }
    }, [sending])
    
    const onFocus = () => {
        setState({
            questionInputGotFocus: true
        })
    }

    const onBlur = () => {
        setState({
            questionInputGotFocus: false
        })
    }

    const onChangeText = (text) => {
        let a = false;
        if (text.length > 0)
            a = true;
        setState({
            question: text,
            displayClearButton: a
        })
    }

    const clearInput = () => {
        setState({
            question: '',
            displayClearButton: false
        })
    }

    const submit = () => {
        if (sending)
            return;
        if (question.length === 0) {
            setState({
                emptyTextError: true
            });
        } else {
            setState({
                sending: true
            })
        }
    }

    const placeholder = i18n.t("ask_question", {defaultValue: "Задать вопрос о товаре"})

    return (
        <View style={styles.postBox}>
            <BorderShadow style={styles.postBoxInner} position={POSITION_TOP} border={4}>
                <View style={styles.postBoxShadowInner}>
                    <View style={CssHelper['flexRowCentered']}>
                        <View style={styles.inputContainer}>
                            <View style={styles.textInputOuter}>
                                <Surface style={[CssHelper['flex'], {width: 'auto'}]} elevation={1}>
                                    <TextInput
                                        style={[styles.textInput, questionInputGotFocus && (styles.textInputFocused)]} 
                                        placeholder={placeholder} 
                                        value={question}
                                        onChangeText={onChangeText}
                                        onFocus={onFocus}
                                        onBlur={onBlur}
                                        selectionColor={APP_MAIN_COLOR}
                                        multiline={true}
                                        editable={sending ? false : true}
                                    />
                                    { (displayClearButton && !sending) &&
                                        <View style={styles.clearInput}>
                                            <TouchableOpacity style={CssHelper['flexSingleCentered']} activeOpacity={1} onPress={clearInput}>
                                                <View style={[CssHelper['flexSingleCentered'], {marginLeft: -1}]}>
                                                    <XIcon width={9} height={9} color={"#fff"}/>
                                                </View>
                                            </TouchableOpacity>
                                        </View>
                                    }
                                </Surface>
                            </View>
                        </View>
                        <TouchableOpacity style={styles.submitButton} activeOpacity={1} onPress={submit}>
                            <View style={CssHelper['flexSingleCentered']}>
                                { sending ? (
                                    <ActivityIndicator size="small" color="#fff"/>
                                ) : (
                                    <Text style={[styles.submitText, TEXT_SHADOW]}>
                                        {i18n.t("ask", {defaultValue: "Спросить"})}
                                    </Text>
                                )}
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </BorderShadow>
            <Toasty isVisible={emptyTextError} backgroundColor={TOAST_BG_COLOR} duration={TOAST_DURATION} onHide={() => setState({emptyTextError: false})}>
                <Text style={styles.toastText}>
                    {i18n.t("errors:emptyText", {defaultValue: "содержание не может быть пустым!"})}
                </Text>
            </Toasty>
            <Toasty isVisible={questionSent} backgroundColor={TOAST_BG_COLOR} duration={TOAST_DURATION} onHide={() => setState({questionSent: false})}>
                <Text style={styles.toastSentText}>
                    {i18n.t("messages:question_sent", {defaultValue: "Ваш вопрос отправлен тем, кто уже купил этот товар."})}
                </Text>
            </Toasty>
        </View>
    )
})

const styles = StyleSheet.create({
    postBox: {
        height: 55,
        position: 'absolute',
        width: '100%',
        bottom: 0,
    },
    postBoxInner: {
        flex: 1,
        backgroundColor: '#ebebeb',
    },
    postBoxShadowInner: {
        flex: 1,
        paddingHorizontal: 10
    },
    inputContainer: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#333',
        borderRightWidth: 0,
        height: 45,
        borderTopLeftRadius: 3,
        borderBottomLeftRadius: 3,
        backgroundColor: '#fff',
    },
    submitButton: {
        backgroundColor: APP_MAIN_COLOR,
        height: 45,
        width: 90,
        paddingHorizontal: 5,
        borderTopRightRadius: 3,
        borderBottomRightRadius: 3
    },
    submitText: {
        textTransform: 'uppercase',
        color: '#fff',
        textAlign: 'center'
    },
    textInput: {
        flex: 1,
        borderBottomWidth: 0.5,
        borderBottomColor: '#333',
        paddingRight: 30
    },
    textInputFocused: {
        borderBottomWidth: 1.5,
        borderBottomColor: APP_MAIN_COLOR_OPACITY_70(),
    },
    textInputOuter: {
        overflow: 'hidden',
        flex: 1,
        marginHorizontal: 5,
        marginTop: 3,
        paddingBottom: 3,
    },
    clearInput: {
        position: 'absolute',
        top: 6,
        right: 3,
        zIndex: 99999,
        backgroundColor: '#b2b3b8',
        width: 22,
        height: 22,
        borderRadius: 11
    },
    toastText: {
        color: '#fff'
    },
    toastSentText: {
        color: '#fff',
        padding: 7
    }
});

export default PostBox;