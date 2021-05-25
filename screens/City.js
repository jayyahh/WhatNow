import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import Location from 'react-native-location';

const City = ({ navigation, route }) => {
	const [activity, setActivity] = useState(route.params.activity);
	const [cityFromLatLon, setCityFromLatLon] = useState('');
	const [city, setCity] = useState('');
	const [latitude, setLatitude] = useState(0);
	const [longitude, setLongitude] = useState(0);
	const [location, setLocation] = useState({ city, cityFromLatLon, latitude, longitude });

	const getLocation = () => {
		Location.requestPermission({
			ios: 'whenInUse',
			android: {
				detail: 'coarse'
			}
		}).then(granted => {
			if (granted) {
				Location.getLatestLocation({ timeout: 60000 }).then(location => {
					setLatitude(location.latitude);
					setLongitude(location.longitude);
					getCityFromLatLon(location.longitude, location.latitude);
				});
			};
		});
	};

	const getCityFromLatLon = (lon, lat) => {
		const api = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`;
		fetch(api).then((res) => res.json()).then((data) => {
			setCity(data.city);
			setCityFromLatLon(data.city);
		}).catch((err) => console.log(err));
	};

	// adding [] as second param here is basically the same as saying ComponentDidMount
	useEffect(() => {
		getLocation();
	}, []);

	useEffect(() => {
		const loc = {
			city,
			cityFromLatLon,
			latitude,
			longitude
		}
		setLocation(loc);
	}, [city, latitude, longitude])

	return (
		<View style={styles.container}>
			<Text style={styles.question}>What city are you in?</Text>
			<TextInput placeholder='city' style={styles.textInput} value={city} onChangeText={(t) => { setCity(t) }}>
			</TextInput>
			<TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Explore', { activity, location })}>
				<Text style={styles.buttonText}>explore</Text>
			</TouchableOpacity>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'flex-start',
		alignItems: 'center',
		marginVertical: 250
	},
	question: {
		fontSize: 35,
		fontWeight: '200',
	},
	textInput: {
		marginVertical: 40,
		height: 40,
		margin: 12,
		fontSize: 30,
		fontWeight: '200'
	},
	button: {
		marginTop: 20,
		paddingVertical: 15,
		width: 120,
		backgroundColor: '#fff',
		borderRadius: 10
	},
	buttonText: {
		fontSize: 20,
		fontWeight: '300',
		color: '#000',
		textAlign: 'center'
	}
});

export default City;