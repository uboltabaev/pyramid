import React from 'react';
import PropTypes from 'prop-types';
import Svg, { Path, G, Circle, LinearGradient, Stop } from 'react-native-svg';

const InstagramIcon = React.memo(({width, height}) => {
    return (
        <Svg height={height} width={width} viewBox="0 0 512 512">
            <LinearGradient id="a" gradientTransform="matrix(0 -1.982 -1.844 0 -132.522 -51.077)" gradientUnits="userSpaceOnUse" x1="0" x2="75" y1="0" y2="-100">
                <Stop offset={"0"} stopColor="#ffd153"/>
                <Stop offset={"0.25"} stopColor="#ff9348"/>
                <Stop offset={"0.5"} stopColor="#ff563e"/>
                <Stop offset={"0.75"} stopColor="#e44672"/>
                <Stop offset={"1"} stopColor="#cb39a4"/>
            </LinearGradient>
            <Circle fill="url(#a)" cx="256" cy="256" r="256"/>
            <G>
                <Path fill="#FFFFFF" d="M315.227,109.468H196.772c-48.14,0-87.304,39.164-87.304,87.304v118.455
                    c0,48.138,39.164,87.305,87.305,87.305h118.455c48.138,0,87.305-39.165,87.305-87.305V196.772
                    C402.532,148.632,363.367,109.468,315.227,109.468L315.227,109.468z M373.05,315.228c0,31.934-25.888,57.822-57.822,57.822H196.773
                    c-31.934,0-57.822-25.888-57.822-57.822V196.773c0-31.934,25.888-57.823,57.822-57.823h118.455
                    c31.934,0,57.822,25.89,57.822,57.823V315.228z"/>
                <Path fill="#FFFFFF" d="M256,180.202c-41.794,0-75.798,34.004-75.798,75.798c0,41.791,34.004,75.795,75.798,75.795
                    s75.795-34.001,75.795-75.795S297.794,180.202,256,180.202L256,180.202z M256,302.313c-25.579,0-46.316-20.733-46.316-46.313
                    s20.737-46.316,46.316-46.316s46.313,20.735,46.313,46.316C302.313,281.579,281.579,302.313,256,302.313L256,302.313z"/>
            </G>
            <G>
                <Path fill="#fff" d="M350.103,180.774c0,10.03-8.132,18.163-18.163,18.163c-10.03,0-18.163-8.133-18.163-18.163
                    c0-10.031,8.133-18.163,18.163-18.163C341.973,162.611,350.103,170.741,350.103,180.774L350.103,180.774z"/>
            </G>
        </Svg>
    )
})

InstagramIcon.propTypes = {
    width: PropTypes.number,
    height: PropTypes.number,
}

export default InstagramIcon;