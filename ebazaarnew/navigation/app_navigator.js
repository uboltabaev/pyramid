import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import BottomTabs from './bottom_nav';
import CategoriesContainer from '../containers/categories_container';
import ProductsList from '../containers/products_list_container';
import ProductContainer from '../containers/product_container';
import AddCartContainer from '../containers/add_cart_container';
import FeedbacksContainer from '../containers/feedbacks_container';
import ProductFAQ from '../containers/product_faq_container';
import ContactUsContainer from '../containers/contact_us_container';
import FavoritesContainer from '../containers/profile/favorites_container';
import SubscriptionsContainer from '../containers/profile/subscriptions_container';
import HistoryContainer from '../containers/profile/history_container';
import WaitingShipmentContainer from '../containers/profile/waiting_shipment_container';
import SentContainer from '../containers/profile/sent_container';
import ShippingAddressesContainer from '../containers/settings/shipping_addresses_container';
import ShippingAddressFormContainer from '../containers/settings/shipping_address_form_container';
import ProfileContainer from '../containers/settings/profile_container';
import InviteFriendsContainer from '../containers/profile/invite_friends_container';
import FaqContainer from '../containers/profile/faq_container';
import SettingsContainer from '../containers/settings/settings_container';
import AccountContainer from '../containers/settings/account_container';
import BirthdayContainer from '../containers/settings/birthday_container';
import AuthIndex from '../containers/auth/index_container';
import Signup from '../containers/auth/signup_container';
import Signin from '../containers/auth/signin_container';
import PhoneAuth from '../containers/auth/phone_auth_container';
import PasswordRecovery from '../containers/auth/password_recovery_container';

const Stack = createStackNavigator();

function AppNavigator() {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name="BottomTabs" component={BottomTabs} options={{header: () => null}}/>
                <Stack.Screen name="Categories" component={CategoriesContainer} options={{header: () => null}}/>
                <Stack.Screen name="ProductsList" component={ProductsList} options={{header: () => null}}/>
                <Stack.Screen name="Product" component={ProductContainer} options={{header: () => null}}/>
                <Stack.Screen name="AddCart" component={AddCartContainer} options={{header: () => null}}/>
                <Stack.Screen name="Feedbacks" component={FeedbacksContainer} options={{header: () => null}}/>
                <Stack.Screen name="ProductFaq" component={ProductFAQ} options={{header: () => null}}/>
                <Stack.Screen name="ContactUs" component={ContactUsContainer} options={{header: () => null}}/>
                <Stack.Screen name="Favorites" component={FavoritesContainer} options={{header: () => null}}/>
                <Stack.Screen name="Subscriptions" component={SubscriptionsContainer} options={{header: () => null}}/>
                <Stack.Screen name="History" component={HistoryContainer} options={{header: () => null}}/>
                <Stack.Screen name="WaitingShipment" component={WaitingShipmentContainer} options={{header: () => null}}/>
                <Stack.Screen name="Sent" component={SentContainer} options={{header: () => null}}/>
                <Stack.Screen name="SettingsShippingAddresses" component={ShippingAddressesContainer} options={{header: () => null}}/>
                <Stack.Screen name="SettingsShippingAddressForm" component={ShippingAddressFormContainer} options={{header: () => null}}/>
                <Stack.Screen name="SettingsProfile" component={ProfileContainer} options={{header: () => null}}/>
                <Stack.Screen name="SettingsAccount" component={AccountContainer} options={{header: () => null}}/>
                <Stack.Screen name="SettingsBirthday" component={BirthdayContainer} options={{header: () => null}}/>
                <Stack.Screen name="InviteFriends" component={InviteFriendsContainer} options={{header: () => null}}/>
                <Stack.Screen name="Faq" component={FaqContainer} options={{header: () => null}}/>
                <Stack.Screen name="Settings" component={SettingsContainer} options={{header: () => null}}/>
                <Stack.Screen name="AuthIndex" component={AuthIndex} options={{header: () => null}}/>
                <Stack.Screen name="Signup" component={Signup} options={{header: () => null}}/>
                <Stack.Screen name="Signin" component={Signin} options={{header: () => null}}/>
                <Stack.Screen name="PhoneAuth" component={PhoneAuth} options={{header: () => null}}/>
                <Stack.Screen name="PasswordRecovery" component={PasswordRecovery} options={{header: () => null}}/>
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default AppNavigator;