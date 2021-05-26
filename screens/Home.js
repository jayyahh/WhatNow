import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';

const Home = ({ navigation }) => {

	useEffect(() => {
		StatusBar.setBarStyle('dark-content');
	});

	return (
		<View style={styles.container}>
			<Text style={styles.question}>Are you looking for ...</Text>
			<View style={styles.options} >
				<TouchableOpacity style={styles.button} onPress={() => navigation.navigate('City', { activity: 'food' })}>
					<Text style={styles.buttonText}>food</Text>
				</TouchableOpacity>
				<TouchableOpacity style={styles.button} onPress={() => navigation.navigate('City', { activity: 'fun' })}>
					<Text style={styles.buttonText}>fun</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'flex-start',
		alignItems: 'center',
		marginTop: 250
	},
	options: {
		flexDirection: 'row',
		marginTop: 50,
		width: 300,
		justifyContent: 'space-around'
	},
	question: {
		fontSize: 35,
		fontWeight: '200',
	},
	button: {
		paddingVertical: 15,
		width: 120,
		backgroundColor: '#03a5fc',
		borderRadius: 10,
		backgroundColor: '#fff',
	},
	buttonText: {
		fontSize: 20,
		fontWeight: '300',
		color: '#000',
		textAlign: 'center'
	}
})

export default Home;