import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableWithoutFeedback } from 'react-native';
import PropTypes from 'prop-types';
import Ripple from 'react-native-material-ripple';
import i18n from 'i18n-js';
import _ from 'underscore';
import PopupMenu, {Position} from './popup_menu';
import CssHelper from '../../helpers/css_helper';
import DropDownIcon from '../icons/drop_down_icon';
import MyRipple from '../ui/ripple';

export const MODE_DEFAULT = 'default';
export const MODE_DROPDOWN = 'dropdown';

export const STATUS_ENABLED = 'enabled';
export const STATUS_DISABLED = 'disabled';

class DropDownMenu extends Component {
    constructor(props){
        super(props);
        this.state = {
            sort: this.props.sort,
            sortOpened: false
        };
        this.sortRef = React.createRef();
        this.sortMenuRef = null;
        this._onMenuHidden = this._onMenuHidden.bind(this);
        this._setMenuRef = this._setMenuRef.bind(this);
    }
    _setMenuRef(ref) {
        this.sortMenuRef = ref;
    }
    _showMenu() {
        const {mode, status} = this.props;
        if (status === STATUS_DISABLED)
            return null;
        this.setState({
            sortOpened: true
        }, () => {
            let stick = Position.BOTTOM_LEFT;
            if (mode === MODE_DROPDOWN)
                stick = Position.TOP_LEFT;
            this.sortMenuRef.show(this.sortRef.current, stick);
        });
    }
    _onMenuHidden() {
        this.setState({
            sortOpened: false
        });
    }
    _hideMenuAndSort(id, value) {
        this.setState({
            sort: id
        });
        this.sortMenuRef.hide();
        const {onSelect} = this.props;
        if (_.isFunction(onSelect))
            onSelect(id, value);
    }
    _getSort(id) {
        const {sortItems} = this.props,
        sort = _.find(sortItems, function(o) {
            return o.id === id;
        });
        if (_.isObject(sort))
            return i18n.t(sort.i18n, {defaultValue: sort.defaultText})
    }
    render() {
        const {sort, sortOpened} = this.state,
            {sortItems, textStyle, optionStyle, triggerStyle, iconColor, popupWidth, display, mode} = this.props;
        const displayStyle = display === 'flex' ? {flex: 1} : {};
        return (
            <View style={displayStyle}>
                {((m) => {
                    const i = (<View style={[CssHelper['flexRowCentered'], triggerStyle]} ref={this.sortRef} collapsable={false}>
                                <View style={displayStyle}>
                                    <Text style={[styles.sortText, textStyle]} numberOfLines={1}>
                                        {this._getSort(sort)}
                                    </Text>
                                </View>
                                <View style={(sortOpened && mode === MODE_DEFAULT) && ({transform: [{ rotate: "180deg" }]})}>
                                    <DropDownIcon width={12} height={12} color={iconColor}/>
                                </View>
                            </View>);
                    switch(m) {
                        case MODE_DEFAULT:
                            return(
                                <MyRipple style={styles.sortDropDown} pressColor="rgba(0, 0, 0, 0.08)" borderless={false} onPress={() => this._showMenu()}>
                                    {i}
                                </MyRipple>
                            );
                        case MODE_DROPDOWN: 
                            return(
                                <TouchableWithoutFeedback onPress={() => this._showMenu()}>
                                    {i}
                                </TouchableWithoutFeedback>
                            );
                    }
                })(mode)}
                <PopupMenu ref={this._setMenuRef} style={[{width: popupWidth}, mode === MODE_DEFAULT && ({marginTop: 13, marginLeft: -10})]} onHidden={this._onMenuHidden} mode={mode}>
                    <View style={CssHelper['popupmenu.container']}>
                        { sortItems.map((item, index) =>
                            <Ripple key={index} rippleCentered={false} rippleSequential={true} rippleFades={false} rippleOpacity={0.08} rippleDuration={200} onPress={() => this._hideMenuAndSort(item.id, item.defaultText)}>
                                <View style={[CssHelper["menu.button.products_list"]]}>
                                    <Text style={optionStyle}>
                                        {i18n.t(item.i18n, {defaultValue: item.defaultText})}
                                    </Text>
                                </View>
                            </Ripple>
                        )}
                    </View>
                </PopupMenu>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    sortDropDown: {
        paddingTop: 15,
        paddingBottom: 15,
        paddingLeft: 15,
        paddingRight: 10,
        flex: 1
    },
    sortText: {
        paddingRight: 10,
        fontSize: 14,
        height: 20
    }
});

DropDownMenu.propTypes = {
    sort: PropTypes.number,
    sortItems: PropTypes.array.isRequired,
    textStyle: PropTypes.object,
    optionStyle: PropTypes.object,
    triggerStyle: PropTypes.object,
    iconColor: PropTypes.string,
    popupWidth: PropTypes.number,
    display: PropTypes.string,
    mode: PropTypes.string,
    status: PropTypes.string,
    onSelect: PropTypes.func
}

DropDownMenu.defaultProps = {
    sort: 1,
    sortItems: [],
    textStyle: {
        color: '#000'
    },
    iconColor: '#000',
    popupWidth: 290,
    display: 'inline',
    mode: MODE_DEFAULT,
    status: STATUS_ENABLED
}

export default DropDownMenu;