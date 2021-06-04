import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Linking, Modal, StatusBar } from 'react-native';
import { API_KEY } from '@env';

const Explore = ({ route, navigation }) => {
	const businessesLoaded = useRef(false);
	const usedIndex = useRef(new Set());
	const offset = useRef(0);
	const [errorWindow, setErrorWindow] = useState(false);
	const [activity, setActivity] = useState(route.params.activity);
	const [city, setCity] = useState(route.params.location.city);
	const [latitude, setLatitude] = useState(route.params.location.latitude);
	const [longitude, setLongitude] = useState(route.params.location.longitude);
	const [businesses, setBusinesses] = useState([]);
	const [business, setBusiness] = useState({
		image: 'https://i.ibb.co/S6SKfxh/no-pic.jpg',
		name: 'loading...',
		number: 'loading...',
		address: 'loading...',
		details: ''
	});

	const showNextAdventure = () => {
		if (businesses.length !== 0) {
			// once the user has circled through all businesses
			if (usedIndex.current.size === businesses.length) {
				usedIndex.current.clear();
				offset.current += businesses.length;
				getBusinessesFromYelp();
				return;
			}
			let randomIndex = Math.floor(Math.random() * businesses.length);
			// pick an index that the user hasn't got yet
			while (usedIndex.current.has(randomIndex)) {
				randomIndex = Math.floor(Math.random() * businesses.length);
			}

			usedIndex.current.add(randomIndex);
			const result = businesses[randomIndex];
			setBusiness({
				image: result.image_url ? result.image_url : 'https://i.ibb.co/S6SKfxh/no-pic.jpg',
				name: result.name,
				number: result.display_phone,
				address: result.location.display_address,
				details: result.url
			});
		} else {
			setErrorWindow(true);
		}
	};

	const getBusinessesFromYelp = () => {
		// fetch from yelp's API just once on load up and then store all 50 businesses, because there's a daily limit of 5000 calls.
		let loc = `location=${city}`;

		// use location from lat and lon
		if ((latitude !== 0 || longitude !== 0) && route.params.location.cityFromLatLon === city) {
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
				'Authorization': `Bearer ${API_KEY}`
			}
		}

		let sortBy = '';
		switch (Math.floor(Math.random() * 3)) {
			case 0:
				sortBy = 'distance';
				break;
			case 1:
				sortBy = 'rating';
				break;
			case 2:
				sortBy = 'review_count';
				break;
		}

		const apiUrl = `https://api.yelp.com/v3/businesses/search?limit=50&radius=30000&offset=${offset.current}&sort_by=${sortBy}`;
		fetch(`${apiUrl}&${loc}&${categories}`, apiObj)
			.then((res) => res.json())
			.then((data) => {
				setBusinesses(data.businesses ? data.businesses : []);
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

	useEffect(() => {
		StatusBar.setBarStyle('dark-content');
	});

	return (
		<View style={styles.container}>
			<Modal
				animationType='slide'
				transparent={true}
				visible={errorWindow}>
				<View style={styles.errorWindow}>
					<Text style={styles.errorText}>Unable to find any adventure near you...</Text>
					<TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Home')}>
						<Text style={styles.buttonText}>try again</Text>
					</TouchableOpacity>
				</View>
			</Modal>
			<Image source={{ uri: `${business.image}` }} style={styles.img} />
			<View style={styles.info}>
				<Text style={styles.name}>{business.name}</Text>
				<Text style={styles.number} onPress={() => Linking.openURL(`tel:${business.number}`)}>{business.number}</Text>
				<Text style={styles.address} onPress={() => Linking.openURL(`https://maps.google.com/?q=${business.address}`)}>{business.address}</Text>
				<Text style={styles.more} onPress={() => { if (business.details) { Linking.openURL(business.details) } }}>view more</Text>
			</View>
			<TouchableOpacity style={styles.button} onPress={() => showNextAdventure()}>
				<Text style={styles.buttonText}>next adventure</Text>
			</TouchableOpacity>
		</View >
	);
};

const styles = StyleSheet.create({
	errorWindow: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: "white",
	},
	errorText: {
		fontSize: 20,
		textAlign: 'center'
	},
	container: {
		flex: 1,
		justifyContent: 'flex-start',
		alignItems: 'center',
		marginTop: 40
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
		bottom: 40
	},
	buttonText: {
		fontSize: 20,
		fontWeight: '300',
		color: '#000',
		textAlign: 'center'
	}
});

export default Explore;