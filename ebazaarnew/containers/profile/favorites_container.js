import React from 'react';
import { StyleSheet, Text, ScrollView } from 'react-native';
import CssHelper from "../../helpers/css_helper";
import DarkPage from "../../components/misc/dark_page";

function FavoritesContainer({ navigation }) {
    return (
        <DarkPage i18nKey="favorites" defaultText="Избранное" navigation={navigation}>
            <ScrollView style={[CssHelper['frontend.content'], styles.content]}>
                <Text>This is favorites screen...</Text>
            </ScrollView>
        </DarkPage>
    )
}

const styles = StyleSheet.create({
    content: {
        backgroundColor: '#f5f5f5'
    }
});

export default FavoritesContainer;