import React, { useReducer } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import PropTypes from 'prop-types';
import ArrowDownIcon from "../icons/arrow_down_icon";
import CssHelper from "../../helpers/css_helper";
import TouchableHighlight from '../ui/touchable_highlight';

function Collapsible({ wrapperStyle, titleContainerStyle, contentStyle, title, preCollapsed, titleStyle, singleLineText, touchableHighlight, arrowColor, children }) {
    const [state, setState] = useReducer(
        (state, newState) => ({...state, ...newState}),
        {
            collapsed: preCollapsed,
            collapsedOnce: preCollapsed
        }
    )

    const { collapsed, collapsedOnce } = state

    const toggle = () => {
        const s = {
                collapsed: !collapsed
            }
        if (!collapsed && !collapsedOnce)
            s.collapsedOnce = true
        setState(s)
    }

    return (
        <View style={wrapperStyle}>
            <View style={[CssHelper['flex']]}>
                {((bool) => {
                    let content = <View style={CssHelper['flexRowCentered']}>
                        <View style={CssHelper['flex']}>
                            <Text numberOfLines={singleLineText ? 1 : null} style={titleStyle} textBreakStrategy="simple">{title}</Text>
                        </View>
                        <View style={collapsed && ({transform: [{ rotate: "180deg" }]})}>
                            <View>
                                <ArrowDownIcon width={12} height={12} color={arrowColor}/>
                            </View>
                        </View>
                    </View>;
                    if (bool) {
                        return (
                            <TouchableHighlight style={StyleSheet.flatten([titleContainerStyle, CssHelper['flex']])} onPress={toggle}>
                                {content}
                            </TouchableHighlight>
                        );
                    } else {
                        return (
                            <TouchableOpacity style={StyleSheet.flatten([titleContainerStyle, CssHelper['flex']])} onPress={toggle} activeOpacity={1.0}>
                                {content}
                            </TouchableOpacity>
                        );
                    }
                })(touchableHighlight)}
            </View>
            <View style={[CssHelper['flex']]}>
                { collapsedOnce &&
                    <View style={[contentStyle, {height: collapsed ? 'auto' : 0, overflow: 'hidden'}]}>
                        {React.Children.toArray(children)
                            .map((item, index) => (
                                <View key={index}>{item}</View>
                            ))}
                    </View>
                }
            </View>
        </View>
    )
}

Collapsible.propTypes = {
    children: PropTypes.node,
    wrapperStyle: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.array
    ]),
    titleContainerStyle: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.array
    ]),
    contentStyle: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.array
    ]),
    title: PropTypes.string,
    titleStyle: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.array
    ]),
    singleLineText: PropTypes.bool,
    touchableHighlight: PropTypes.bool,
    arrowColor: PropTypes.string
}

Collapsible.defaultProps = {
    title: "",
    preCollapsed: false,
    singleLineText: false,
    touchableHighlight: false,
    arrowColor: '#33495e'
}

export default Collapsible;