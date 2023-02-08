import React, { useState, useEffect } from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import ArrowDownIcon from "../icons/arrow_down_icon";
import CssHelper from "../../helpers/css_helper";

export default function CollapsibleList({ numberOfVisibleItems, buttonContent, wrapperStyle, onToggle, children }) {
    const [collapsed, setCollapsed] = useState(false)

    useEffect(() => {
        if (onToggle) {
            onToggle(collapsed);
        }
    }, [collapsed])

    const toggle = () => {
        setCollapsed(status => !status)
    }

    return (
        <View style={wrapperStyle}>
            {numberOfVisibleItems < React.Children.count(children) && (
                <View style={{flex: 1}}>
                    <TouchableOpacity style={[CssHelper['flexRowCentered'], styles.title]} onPress={toggle} activeOpacity={1.0}>
                        <View style={{flex: 1}}>
                            {buttonContent}
                        </View>
                        <View style={collapsed && ({transform: [{ rotate: "180deg" }]})}>
                            <View>
                                <ArrowDownIcon width={12} height={12} color="#33495e"/>
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>
            )}
            { numberOfVisibleItems >= React.Children.count(children) && (
                <View style={[{flex: 1}, styles.title]}>
                    {buttonContent}
                </View>
            )}
            <View>
                <View>
                    {React.Children.toArray(children).slice(0, numberOfVisibleItems)}
                </View>
                { collapsed &&
                    <View>
                        {React.Children.toArray(children)
                            .slice(numberOfVisibleItems)
                            .map((item, index) => (
                                <View key={index}>{item}</View>
                            ))}
                    </View>
                }
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    title: {
        paddingTop: 10,
        paddingBottom: 15, 
        paddingRight: 10
    }
});
