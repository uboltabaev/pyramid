import React from 'react';
import PropTypes from 'prop-types';
import Svg, { Path, G } from 'react-native-svg';

const FlowerIcon = React.memo(({width, height, color}) => {
    return (
        <Svg height={height} width={width} viewBox="0 0 512 512" fill={color}>
            <G>
                <G>
                    <Path d="M408.54,219.189c-0.447-0.957-1.071-1.772-1.814-2.431c-0.03-0.027-0.063-0.05-0.093-0.076
                        c-0.157-0.135-0.317-0.265-0.483-0.386c-0.062-0.045-0.128-0.085-0.192-0.128c-0.139-0.094-0.279-0.188-0.424-0.273
                        c-0.087-0.051-0.177-0.095-0.266-0.143c-0.128-0.068-0.256-0.137-0.388-0.197c-0.101-0.047-0.205-0.087-0.308-0.129
                        c-0.127-0.052-0.254-0.103-0.384-0.148c-0.038-0.013-0.074-0.031-0.113-0.043c-2.22-0.726-54.841-17.563-94.53,0.976
                        c-25.303,11.819-33.25,28.549-35.46,40.503c-1.258,6.804-0.844,12.762-0.112,17.054L263.5,278.66v-68.74
                        c10.154-2.074,21.588-9.39,21.588-31.84c0-0.854-0.019-1.742-0.052-2.653c0.621,0.668,1.235,1.309,1.839,1.913
                        c7.798,7.799,15.753,11.751,23.65,11.751c0.072,0,0.146,0,0.217-0.001c6.996-0.064,13.635-3.188,19.733-9.286
                        c7.682-7.682,17.576-23.561-2.463-43.601c-0.604-0.604-1.245-1.218-1.912-1.839c0.911,0.033,1.799,0.052,2.652,0.052
                        c28.341,0,32.573-18.225,32.573-29.088c0-10.863-4.232-29.089-32.573-29.089c-0.854,0-1.741,0.019-2.652,0.052
                        c0.668-0.621,1.309-1.235,1.912-1.839c20.04-20.04,10.145-35.919,2.463-43.601c-6.097-6.098-12.736-9.222-19.733-9.287
                        c-7.941-0.042-15.998,3.88-23.868,11.75c-0.604,0.604-1.218,1.245-1.839,1.913c0.033-0.911,0.052-1.799,0.052-2.653
                        C285.088,4.231,266.864,0,256,0c-10.864,0-29.088,4.231-29.088,32.572c0,0.854,0.019,1.742,0.052,2.653
                        c-0.621-0.668-1.235-1.309-1.839-1.913c-7.799-7.799-15.753-11.751-23.65-11.751c-0.072,0-0.146,0-0.217,0.001
                        c-6.997,0.064-13.636,3.189-19.733,9.287c-7.682,7.682-17.576,23.561,2.464,43.601c0.604,0.604,1.245,1.218,1.912,1.839
                        c-0.911-0.033-1.799-0.052-2.653-0.052c-28.341,0-32.573,18.225-32.573,29.089s4.232,29.088,32.573,29.088
                        c0.854,0,1.741-0.019,2.653-0.052c-0.668,0.621-1.309,1.235-1.912,1.839c-20.04,20.04-10.146,35.919-2.464,43.601
                        c6.098,6.098,12.737,9.222,19.733,9.286c0.072,0.001,0.145,0.001,0.217,0.001c7.896,0,15.853-3.953,23.65-11.751
                        c0.604-0.604,1.218-1.245,1.839-1.913c-0.033,0.911-0.052,1.799-0.052,2.653c0,22.45,11.434,29.766,21.588,31.84v68.74
                        l-10.473-4.892c0.732-4.292,1.146-10.25-0.112-17.054c-2.21-11.954-10.157-28.684-35.46-40.503
                        c-39.69-18.539-92.31-1.701-94.53-0.976c-0.039,0.013-0.076,0.031-0.114,0.044c-0.127,0.044-0.252,0.094-0.377,0.145
                        c-0.106,0.043-0.212,0.084-0.316,0.132c-0.128,0.059-0.252,0.125-0.376,0.191c-0.093,0.05-0.188,0.096-0.279,0.149
                        c-0.139,0.081-0.272,0.171-0.405,0.261c-0.07,0.047-0.143,0.091-0.211,0.141c-0.159,0.115-0.31,0.24-0.46,0.368
                        c-0.038,0.032-0.079,0.062-0.116,0.095c-0.181,0.161-0.356,0.332-0.522,0.512c-0.004,0.004-0.008,0.007-0.011,0.011
                        c-0.509,0.552-0.943,1.19-1.278,1.906c-0.447,0.957-0.672,1.959-0.701,2.952c-0.001,0.037,0.002,0.074,0.001,0.112
                        c-0.003,0.21,0,0.419,0.014,0.628c0.005,0.074,0.017,0.147,0.024,0.22c0.017,0.171,0.035,0.341,0.064,0.51
                        c0.016,0.095,0.039,0.189,0.059,0.283c0.031,0.147,0.061,0.293,0.101,0.438c0.028,0.103,0.062,0.204,0.095,0.306
                        c0.043,0.136,0.087,0.271,0.138,0.404c0.014,0.036,0.023,0.073,0.037,0.109c0.869,2.168,21.728,53.327,61.418,71.866
                        c11.475,5.359,21.43,7.333,29.875,7.333c10.177,0,18.159-2.869,23.944-6.135c6.025-3.402,10.328-7.543,13.15-10.859l16.821,7.857
                        v34.815H145.051c-6.961,0-12.625,5.663-12.625,12.625v26.559c0,6.961,5.664,12.625,12.625,12.625h13.826l10.312,51.087
                        c0.004,0.019,0.008,0.039,0.012,0.058l13.15,65.143c1.623,8.041,8.754,13.876,16.957,13.876h113.385
                        c8.203,0,15.333-5.835,16.957-13.876l23.474-116.288h13.826c6.961,0,12.625-5.663,12.625-12.625v-26.559
                        c0-6.961-5.664-12.625-12.625-12.625H263.5v-34.815l16.821-7.856c2.821,3.316,7.125,7.457,13.15,10.859
                        c5.786,3.267,13.765,6.135,23.944,6.135c8.444,0,18.402-1.974,29.875-7.333c39.69-18.539,60.55-69.698,61.418-71.866
                        c0.014-0.036,0.024-0.073,0.037-0.109c0.051-0.133,0.095-0.268,0.138-0.404c0.032-0.102,0.067-0.203,0.095-0.306
                        c0.039-0.144,0.07-0.291,0.101-0.438c0.02-0.094,0.043-0.188,0.059-0.283c0.029-0.169,0.047-0.339,0.064-0.51
                        c0.007-0.074,0.019-0.147,0.024-0.22c0.015-0.208,0.017-0.418,0.014-0.628c-0.001-0.037,0.002-0.074,0.001-0.112
                        C409.212,221.149,408.987,220.146,408.54,219.189z M210.589,285.465c-10.837,5.837-24.137,5.152-39.531-2.039
                        c-20.237-9.453-35.28-29.841-44.248-45.053l90.513,42.278C215.535,282.292,213.299,284.005,210.589,285.465z M223.671,267.06
                        l-90.513-42.277c17.423-2.886,42.714-4.435,62.949,5.017c15.393,7.19,24.455,16.949,26.934,29.006
                        C223.661,261.822,223.782,264.637,223.671,267.06z M319.87,169.195c-3.266,3.266-6.296,4.866-9.264,4.894
                        c-0.026,0-0.053,0-0.079,0c-3.773,0-8.162-2.475-13.044-7.357c-7.772-7.772-17.772-22.656-22.127-34.388
                        c2.958-2.118,5.545-4.705,7.663-7.663c11.732,4.354,26.616,14.354,34.389,22.126C327.718,157.119,325.849,163.215,319.87,169.195z
                        M328.752,91.236c14.585,0,17.573,5.633,17.573,14.089c0,8.457-2.988,14.088-17.573,14.088c-10.991,0-28.584-3.453-39.959-8.669
                        c0.294-1.783,0.442-3.593,0.442-5.419c0-1.827-0.148-3.636-0.442-5.42C300.168,94.689,317.761,91.236,328.752,91.236z
                        M297.482,43.919c4.917-4.917,9.356-7.426,13.124-7.357c2.968,0.027,5.999,1.628,9.264,4.894
                        c5.979,5.979,7.849,12.075-2.463,22.388c-7.773,7.772-22.657,17.772-34.389,22.126c-2.118-2.958-4.705-5.544-7.663-7.663
                        C279.709,66.575,289.709,51.691,297.482,43.919z M256,15c8.457,0,14.088,2.988,14.088,17.572c0,10.992-3.453,28.585-8.669,39.959
                        c-1.784-0.294-3.593-0.442-5.419-0.442c-1.826,0-3.636,0.148-5.419,0.442c-5.216-11.375-8.669-28.968-8.669-39.959
                        C241.912,17.988,247.543,15,256,15z M192.13,41.456c3.266-3.266,6.296-4.866,9.264-4.894c0.026,0,0.053,0,0.079,0
                        c3.773,0,8.162,2.475,13.044,7.357c7.772,7.772,17.773,22.656,22.127,34.388c-2.958,2.118-5.545,4.705-7.663,7.663
                        c-11.732-4.354-26.616-14.354-34.388-22.126C184.282,53.531,186.151,47.435,192.13,41.456z M183.248,119.413
                        c-14.585,0.001-17.573-5.631-17.573-14.088c0-8.457,2.988-14.089,17.573-14.089c10.991,0,28.584,3.453,39.959,8.669
                        c-0.294,1.784-0.442,3.593-0.442,5.42c0,1.826,0.148,3.636,0.442,5.419C211.832,115.96,194.239,119.413,183.248,119.413z
                        M214.518,166.731c-4.883,4.883-9.271,7.358-13.044,7.357c-0.026,0-0.053,0-0.079,0c-2.968-0.027-5.999-1.628-9.264-4.894
                        c-5.979-5.98-7.849-12.076,2.464-22.388c7.772-7.772,22.656-17.772,34.388-22.126c2.118,2.958,4.705,5.545,7.663,7.663
                        C232.291,144.075,222.291,158.958,214.518,166.731z M239.126,112.308c-0.047-0.148-0.092-0.297-0.148-0.444
                        c-0.805-2.093-1.213-4.293-1.213-6.54c0-2.247,0.408-4.447,1.213-6.54c0.067-0.174,0.122-0.349,0.176-0.524
                        c0.059-0.116,0.13-0.222,0.184-0.342c1.84-4.129,5.127-7.417,9.257-9.256c0.146-0.065,0.286-0.139,0.426-0.213
                        c0.147-0.046,0.294-0.091,0.44-0.147c4.187-1.609,8.895-1.609,13.081,0c0.144,0.055,0.289,0.098,0.434,0.144
                        c0.142,0.074,0.284,0.15,0.432,0.216c4.13,1.839,7.417,5.127,9.257,9.256c0.053,0.12,0.125,0.226,0.184,0.342
                        c0.053,0.176,0.109,0.351,0.176,0.524c0.805,2.093,1.213,4.293,1.213,6.54c0,2.247-0.408,4.447-1.213,6.54
                        c-0.056,0.147-0.102,0.295-0.148,0.443c-0.073,0.139-0.147,0.278-0.211,0.423c-1.84,4.13-5.127,7.417-9.256,9.256
                        c-0.145,0.065-0.284,0.139-0.424,0.212c-0.148,0.047-0.297,0.092-0.444,0.149c-4.187,1.611-8.897,1.611-13.081,0.001
                        c-0.147-0.056-0.295-0.102-0.444-0.149c-0.14-0.073-0.279-0.147-0.424-0.212c-4.129-1.839-7.417-5.126-9.256-9.256
                        C239.272,112.586,239.198,112.447,239.126,112.308z M329.321,423.942h-76.598c-4.142,0-7.5,3.358-7.5,7.5
                        c0,4.142,3.358,7.5,7.5,7.5h73.57l-11.347,56.214c-0.216,1.068-1.164,1.844-2.253,1.844H199.308c-1.09,0-2.038-0.775-2.253-1.844
                        l-11.347-56.214h14.001c4.142,0,7.5-3.358,7.5-7.5c0-4.142-3.358-7.5-7.5-7.5H182.68l-8.499-42.106H337.82L329.321,423.942z
                        M364.573,345.028v21.808H147.427v-21.808H364.573z M256.001,195.65c-8.456,0-14.089-2.988-14.089-17.572
                        c0-10.991,3.453-28.584,8.669-39.959c3.566,0.589,7.272,0.589,10.839,0c5.216,11.375,8.669,28.968,8.669,39.959
                        C270.089,192.662,264.457,195.65,256.001,195.65z M288.315,267.066c-0.099-2.245,0.004-4.836,0.52-7.627
                        c2.283-12.348,11.387-22.32,27.058-29.64c20.237-9.452,45.528-7.904,62.949-5.017L288.315,267.066z M340.942,283.426
                        c-15.394,7.19-28.694,7.875-39.531,2.039c-2.711-1.46-4.947-3.173-6.734-4.814l90.546-42.293
                        C376.275,253.56,361.243,273.944,340.942,283.426z"/>
                </G>
            </G>
        </Svg>
    )
})

FlowerIcon.propTypes = {
    width: PropTypes.number,
    height: PropTypes.number,
    color: PropTypes.string
}

FlowerIcon.defaultProps = {
    color: "#000"
}

export default FlowerIcon;