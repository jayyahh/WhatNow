import React from 'react';
import Home from './screens/Home';
import City from './screens/City';
import Explore from './screens/Explore';
import {View, StyleSheet} from 'react-native';
import Navigator from './routes/AppNavigator'

const App = () => {
	return (
		<Navigator/>
	);
}

export default App;