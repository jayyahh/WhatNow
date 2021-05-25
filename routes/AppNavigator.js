import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from '../screens/Home';
import City from '../screens/City';
import Explore from '../screens/Explore';

const Stack = createStackNavigator();

export default Navigator = () => {
	return(
		<NavigationContainer initialRouteName='Home'>
			<Stack.Navigator>
				<Stack.Screen name='Home' component={Home} options={{ title: 'Home' }} />
        		<Stack.Screen name='City' component={City} options={{ title: 'Location' }} />
				<Stack.Screen name='Explore' component={Explore} options={{ title: 'Explore' }} />
			</Stack.Navigator>
		</NavigationContainer>
	)
}