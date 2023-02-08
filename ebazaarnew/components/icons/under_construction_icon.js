import React from 'react';
import PropTypes from 'prop-types';
import Svg, { Path, G } from 'react-native-svg';

const UnderConstructionIcon = React.memo(({width, height, color}) => {
    return (
        <Svg height={height} width={width} viewBox="0 0 464 464" fill={color}>
            <Path d="m360 400-320-216-16 24 320 216zm0 0" fill="#d6d6d4"/>
            <Path d="m440 424c0-13.253906-10.746094-24-24-24h-8c0-13.253906-10.746094-24-24-24s-24 10.746094-24 24h-8c-13.253906 0-24 10.746094-24 24-13.253906 0-24 10.746094-24 24v16h160v-16c0-13.253906-10.746094-24-24-24zm0 0" fill="#803f37"/>
            <Path d="m352 424h16v16h-16zm0 0" fill="#662c26"/>
            <Path d="m384 416h16v16h-16zm0 0" fill="#662c26"/>
            <G fill="#ffb531">
                <Path d="m280 48c0 26.507812-21.492188 48-48 48s-48-21.492188-48-48 21.492188-48 48-48 48 21.492188 48 48zm0 0"/>
                <Path d="m248 144-128-64h-120v144h40v-96h64l-48 128v88l-56 120h56l56-112v-72l56 72v112h56v-128l-56-80 32-80v72l24 88h40l-16-104zm0 0"/>
            </G>
        </Svg>
    );
});

UnderConstructionIcon.propTypes = {
    width: PropTypes.number,
    height: PropTypes.number,
    color: PropTypes.string
}

UnderConstructionIcon.defaultProps = {
    color: "#000"
}

export default UnderConstructionIcon;