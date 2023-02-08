import React, { Component } from 'react';
import { StyleSheet, View, Modal, TouchableWithoutFeedback, ViewPropTypes, Platform } from 'react-native';
import PropTypes from 'prop-types';
import posed from 'react-native-pose';
import _ from 'underscore';
import {SCREEN_WIDTH, SCREEN_HEIGHT} from '../../constants/app';

const cardProps = {
    backgroundColor: '#ffffff',
    elevation: 10,
    cornerRadius: 2,
    opacity: .2
};

const cardStyle = Platform.select({
    ios: () => 
      StyleSheet.create({
        container: {
          shadowRadius: cardProps.elevation, 
          shadowOpacity: cardProps.opacity, 
          shadowOffset:{ width: 0, height: cardProps.elevation },
          borderRadius: cardProps.cornerRadius,
          backgroundColor: cardProps.backgroundColor,
          width: SCREEN_WIDTH.width - 40,
        }
    }),
    android: () => 
      StyleSheet.create({
        container: {
          elevation: cardProps.elevation,
          borderRadius: cardProps.cornerRadius, 
          backgroundColor: cardProps.backgroundColor,
          width: SCREEN_WIDTH.width - 40,
        }
    })
})();

const STATES = {
    MEASURING: 'MEASURING',
    CALCULATING: 'CALCULATING',
    SHOWN: 'SHOWN',
    HIDDEN: 'HIDDEN'
};

const SCREEN_INDENT = 8;

export const Position = Object.freeze({
    TOP_LEFT: "TOP_LEFT",
    TOP_RIGHT: "TOP_RIGHT",
    TOP_CENTER: "TOP_CENTER",
    BOTTOM_LEFT: "BOTTOM_LEFT",
    BOTTOM_RIGHT: "BOTTOM_RIGHT",
    BOTTOM_CENTER: "BOTTOM_CENTER",
    CENTER_CENTER: "CENTER_CENTER"
});

export const MENU_MODE_DEFAULT = 'default';
export const MENU_MODE_DROPDOWN = 'dropdown';
export const MENU_MODE_AGRESSIVE = 'agressive';

const normalizeOffset = (extraOffset) => {
    const reducer = ({left, top}, [prop, value]) => {
      if (prop === "left") {
          left += value;
      } else if (prop === "right") {
          left -= value;
      } else if (prop === "top") {
          top += value;
      } else if (prop === "bottom") {
          top -= value;
      }
      return {left, top};
    }  
    return Object.entries(extraOffset).reduce(reducer, {left: 0, top: 0});
};

const getSummarizedOffset = (offsetList) => {
    const reducer = (acc, {left, top}) => {
        return { left: acc.left + left, top: acc.top + top};
    }
    return offsetList.reduce(reducer, {left: 0, top: 0});
  };
  
const getMenuOffset = (stickTo, component, menu) => {
    if (stickTo === Position.TOP_RIGHT) {
        const left = component.left + (component.width - menu.width);
        const top = component.top;
        return {left, top};
    } else if (stickTo === Position.CENTER_CENTER) {
        const left = component.left + (component.width / 2) - menu.width;
        const top = component.top + (component.height / 2) - 5;
        return {left, top};        
    } else if (stickTo === Position.BOTTOM_LEFT) {
        const left = component.left;
        const top = component.top + component.height;
        return {left, top};
    } else if (stickTo === Position.BOTTOM_RIGHT) {
        const left = component.left + (component.width - menu.width);
        const top = component.top + component.height;
        return {left, top};
    } else if (stickTo === Position.TOP_LEFT) {
        const left = component.left;
        const top = component.top;
        return {left, top};
    } else if ((stickTo === Position.TOP_CENTER)) {
        const left = component.left + Math.round((component.width - menu.width) / 2);
        const top = component.top;
        return {left, top};
    } else if ((stickTo === Position.BOTTOM_CENTER)) {
        const left = component.left + Math.round((component.width - menu.width) / 2);
        const top = component.top + component.height;
        return {left, top};
    }
    return null;
};  

const getComputedOffset = (func, left, top, width, height) => {
    if (func) {
        const extraOffset = func(left, top, width, height);
        return normalizeOffset(extraOffset);
    }
    return null;
}

const Menu = posed.View({
    open: { 
        opacity: 1,
        y: ({ yPos }) => (yPos),
        x: ({ xPos }) => (xPos),
        transition: { 
            opacity: {duration: 50},
            x: {duration: 170},
            y: {duration: 170},
            useNativeDriver: true
        },
        //delayChildren: ({xDelayChildren}) => (xDelayChildren ? 150 : 0),
        //staggerChildren: 25
     },
     closed: { 
        opacity: 0,
        y: ({ yPos, flipY, xMode }) => (flipY ? (yPos + (xMode === MENU_MODE_AGRESSIVE ? 120 : 60)) : (yPos - (xMode === MENU_MODE_AGRESSIVE ? 120 : 60))),
        x: ({ xPos, position }) => (position === Position.BOTTOM_LEFT ? (xPos - 30) : (xPos + 30)),
        transition: { 
            useNativeDriver: true
         }
    }
});

const MenuItem = posed.View({
    open: {
        x: 0,
        y: 0, 
        opacity: 1,
        transition: ({ index }) => ({
            opacity: {duration: (index > 2 ? index * 150 : 0)},
            x: {duration: 200},
            y: {duration: (index > 1 ? index * 40 : 0)},
            useNativeDriver: true
        })
    },
    closed: { 
        x: 0,
        y: ({ index }) => (index > 1 ? ((index * 5) - 5) : 0), 
        opacity: 0,
        transition: {
            useNativeDriver: true
        }
    }
});

const DropdownMenu = posed.View({
    open: {
        y: 0,
        transition: {
            y: {duration: 150},
            useNativeDriver: true
        }
    },
    closed: {
        y: ({xHeight}) => -(xHeight),
        transition: {
            useNativeDriver: true
        }
    }
});

class PopupMenu extends Component {
    constructor(props) {
        super(props);
        this.state = {
            menuState: STATES.HIDDEN,
            stickTo: Position.TOP_LEFT,
            flipY: false,
            component: {
                left: 0,
                top: 0,
                width: 0,
                height: 0
            },
            menu: {
                left: 0,
                top: 0,
                width: 0,
                height: 0
            },
            offsets: {
              staticOffset: {
                  left: 0,
                  top: 0
              },
              computedOffset: {
                  left: 0,
                  top: 0
              }
            },
            isPoseOpened: false
        }
        this.hide = this.hide.bind(this);
        this._onDismiss = this._onDismiss.bind(this);
    }
    componentDidUpdate() {
        const { menuState, menu } = this.state;

        if (menuState === STATES.CALCULATING) {
            const { stickTo, component, offsets } = this.state;
        
            const baseOffset = getMenuOffset(stickTo, component, menu);            
            const allOffsets = [baseOffset, offsets.staticOffset, offsets.computedOffset];
            const finalOffset = getSummarizedOffset(allOffsets);

            /* Flip by Y axis if menu hits bottom screen border */
            let flipY = false;
            if (finalOffset.top > (SCREEN_HEIGHT - menu.height - SCREEN_INDENT)) {
                finalOffset.top = Math.min(
                    SCREEN_HEIGHT - SCREEN_INDENT,
                    finalOffset.top - menu.height,
                );
                flipY = true;
            }

            /* Flip by X axis if menu hits right screen border */
            if (menu.left > (SCREEN_WIDTH - menu.width - SCREEN_INDENT)) {
                /*
                menu.left = Math.min(
                    SCREEN_WIDTH - SCREEN_INDENT,
                    menu.left + component.width,
                );
                */
            }

            this.setState({
                menuState: STATES.SHOWN,
                flipY,
                menu: {
                    ...menu,
                    left: finalOffset.left,
                    top: finalOffset.top
                }
            }, () => {
                this.setState({
                    isPoseOpened: true
                });
            });
        }
    }
    _onMenuLayout(event) {
        const { width, height } = event.nativeEvent.layout;
        const { menuState, menu } = this.state;
        if (menuState === STATES.MEASURING) {
            this.setState({menuState: STATES.CALCULATING,
                menu: {
                    ...menu,
                    width,
                    height
                }
            });
        }
    }
    _onDismiss() {
        const { onHidden } = this.props;
        if (_.isFunction(onHidden)) {
            onHidden();
        }
    }
    show(componentRef, stickTo = null, extraOffset = null, computeOffset = null) {
        if (componentRef) {
            componentRef.measureInWindow((x, y, width, height) => {
                const top = Math.max(SCREEN_INDENT, y);
                const left = Math.max(SCREEN_INDENT, x);

                const computedOffset = getComputedOffset(computeOffset, left, top, width, height);
                const oldOffsets = {...this.state.offsets};
                const newState = {
                    menuState: STATES.MEASURING,
                    component: { left, top, width, height },
                    offsets: {
                    ...oldOffsets,
                    ...( extraOffset ? {staticOffset: extraOffset} : {}),
                    ...( computedOffset ? {computedOffset: computedOffset} : {})
                    },
                    ...( stickTo ? {stickTo: stickTo} : {})
                }
                this.setState(newState);
            });
        }        
    }
    hide() {
        this.setState({
            isPoseOpened: false,
            menuState: STATES.HIDDEN
        });
        /* Invoke onHidden callback if defined */
        const { onHidden } = this.props;
        if (Platform.OS !== 'ios' && _.isFunction(onHidden)) {
            onHidden();
        }
    }
    render() {
        const { menu } = this.state;
        const { menuState, isPoseOpened, flipY, stickTo } = this.state;

        const modalVisible = ((menuState === STATES.MEASURING) || 
                             (menuState === STATES.CALCULATING) || 
                             (menuState === STATES.SHOWN));
    
        const { testID, style, delayChildren, mode, children } = this.props;
        return (
            <View collapsable={false} testID={testID}>
                <Modal
                    hardwareAccelerated={true} 
                    visible={modalVisible}
                    onRequestClose={this.hide}
                    supportedOrientations={[
                        'portrait',
                        'portrait-upside-down',
                        'landscape',
                        'landscape-left',
                        'landscape-right',
                    ]}
                    transparent={true}
                    onDismiss={this._onDismiss}
                >
                    <TouchableWithoutFeedback onPress={this.hide}>
                        <View style={StyleSheet.absoluteFill}>
                            <View {...({onLayout: (e) => {this._onMenuLayout(e)}})} style={[styles.container, style, {position: 'absolute', top: -1000, left: -1000}]}>
                                { React.Children.map(children, (c, i) => {
                                    return(
                                        <View index={(i + 1)}>{c}</View>
                                    );
                                })}
                            </View>
                            { (menuState === STATES.SHOWN && (mode === MENU_MODE_DEFAULT || mode === MENU_MODE_AGRESSIVE)) &&
                                <Menu style={[styles.container, cardStyle.container, style]} 
                                    xPos={menu.left} 
                                    yPos={menu.top} 
                                    xDelayChildren={delayChildren} 
                                    position={stickTo} 
                                    flipY={flipY}
                                    xMode={mode}
                                    pose={isPoseOpened ? "open" : "closed"}
                                >
                                    { React.Children.map(children, (c, i) => {
                                        return(
                                            <MenuItem index={(i + 1)}>{c}</MenuItem>
                                        );
                                    })}
                                </Menu>
                            }
                            { (menuState === STATES.SHOWN && mode === MENU_MODE_DROPDOWN) &&
                                <View style={[styles.container, styles.dropDownContainer, {top: (menu.top - 10), left: (menu.left - 10)}]}>
                                    <DropdownMenu style={[cardStyle.container, {borderRadius: 2}, style]} xHeight={menu.height}  pose={isPoseOpened ? "open" : "closed"}>
                                        { React.Children.map(children, (c, i) => {
                                            return (
                                                <View>{c}</View>
                                            );
                                        })}
                                    </DropdownMenu>
                                </View>
                            }
                        </View>
                    </TouchableWithoutFeedback>
                </Modal>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        backgroundColor: "#fbfbfb",
        overflow: 'hidden',
        padding: 1,
    },
    dropDownContainer: {
        padding: 10, 
        backgroundColor: 'transparent', 
        overflow: 'hidden'
    }
});

PopupMenu.propTypes = {
    children: PropTypes.node.isRequired,
    onHidden: PropTypes.func,
    style: ViewPropTypes.style,
    testID: ViewPropTypes.testID,
    delayChildren: PropTypes.bool,
    mode: PropTypes.string
}

PopupMenu.defaultProps = {
    delayChildren: true,
    mode: MENU_MODE_DEFAULT
}

export default PopupMenu;