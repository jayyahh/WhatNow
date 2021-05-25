import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Linking } from 'react-native';

const Explore = ({ route }) => {
	const businessesLoaded = useRef(false);
	const [activity, setActivity] = useState(route.params.activity);
	const [city, setCity] = useState(route.params.location.city);
	const [latitude, setLatitude] = useState(route.params.location.latitude);
	const [longitude, setLongitude] = useState(route.params.location.longitude);
	const [businesses, setBusinesses] = useState([]);
	const [business, setBusiness] = useState({
		image: 'https://drive.google.com/file/d/1CVyOtmCwowhutX4vKaTMEDpmj0t1jywe/view?usp=sharing',
		name: 'loading...',
		number: 'loading...',
		address: 'loading...',
		details: ''
	});

	const apiUrl = 'https://api.yelp.com/v3/businesses/search?limit=50&radius=30000';

	const showNextAdventure = () => {
		if (businesses.length === 0) {
			// alert users there is NOTHING
		}
		const randomIndex = Math.floor(Math.random() * businesses.length);
		console.log(randomIndex);
		const result = businesses[randomIndex];
		setBusiness({
			image: result.image_url,
			name: result.name,
			number: result.display_phone,
			address: result.location.display_address,
			details: result.url
		});
	};

	const getBusinessesFromYelp = () => {
		// fetch from yelp's API just once on load up and then store all 50 businesses, because there's a daily limit of 5000 calls.
		let loc = `location=${city}`;
		if (latitude !== 0 || longitude !== 0) {
			loc = `latitude=${latitude}&longitude=${longitude}`;
		}

		let categories = 'categories=active,arts';
		if (activity === 'food') {
			categories = 'categories=food,restaurants';
		}

		const apiObj = {
			method: 'GET',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'Authorization': 'Bearer bW6xY2jXwzez-CUs0vpqjjOUQW7fjPiRLpNGx109MceTxHB2eqs_GXDQnVCSv2lY-lReEyhzC7bBB-Y8pddOsKwG5VF6efYfJ9d8pJB_Ir-96tgDnVdA3o925fuTX3Yx'
			}
		}
		fetch(`${apiUrl}&${loc}&${categories}`, apiObj)
			.then((res) => res.json())
			.then((data) => {
				setBusinesses(data.businesses);
				businessesLoaded.current = true;
			}).catch((err) => console.log(err));
	}

	useEffect(() => {
		getBusinessesFromYelp();
	}, []);

	useEffect(() => {
		if (businessesLoaded.current) {
			showNextAdventure();
		}
		// this effect will run after initial render of component plus any time businesses change. 
		// So we need to use the busineesesLoaded ref to check if businesses have loaded
	}, [businesses]);

	return (
		<View style={styles.container}>
			<Image source={businessesLoaded ? { uri: `${business.image}` } : { uri: `${business.image}` }} style={styles.img} />
			<View style={styles.info}>
				<Text style={styles.name}>{business.name}</Text>
				<Text style={styles.number}>{business.number}</Text>
				<Text style={styles.address}>{business.address}</Text>
				<Text style={styles.more} onPress={() => Linking.openURL(business.details)}>view more</Text>
			</View>
			<TouchableOpacity style={styles.button} onPress={() => showNextAdventure()}>
				<Text style={styles.buttonText}>next adventure</Text>
			</TouchableOpacity>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'flex-start',
		alignItems: 'center',
		marginVertical: 40
	},
	img: {
		width: 350,
		height: 250,
		borderRadius: 5
	},
	info: {
		marginTop: 20,
		width: 350,
	},
	name: {
		textAlign: 'center',
		fontSize: 35,
		fontWeight: '500'
	},
	number: {
		textAlign: 'center',
		fontSize: 15,
		fontWeight: '300',
		marginTop: 25
	},
	address: {
		textAlign: 'center',
		fontSize: 15,
		fontWeight: '300',
		marginTop: 5
	},
	more: {
		textAlign: 'center',
		fontSize: 15,
		fontWeight: '300',
		marginTop: 5,
		textDecorationLine: 'underline'
	},
	button: {
		paddingVertical: 15,
		width: 190,
		backgroundColor: '#03a5fc',
		borderRadius: 10,
		backgroundColor: '#fff',
		position: 'absolute',
		bottom: 50
	},
	buttonText: {
		fontSize: 20,
		fontWeight: '300',
		color: '#000',
		textAlign: 'center'
	}
});

export default Explore;