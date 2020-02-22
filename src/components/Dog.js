import React, { useEffect, useRef, useCallback } from 'react';
import { View, ActivityIndicator, Image, Text } from 'react-native';
import { isAndroid, DIMENSIONS, Label, Row, TitleAnswer } from '../styles';

const calculateBackground = (status) => {   
	switch(status) {
		case 'geadopteerd': return 'grey';
		case 'beschikbaar': return 'green';
		case 'in optie': return 'pink';
		case 'nieuw!': return 'orange';
		case 'gereserveerd': return 'red';
		default: return '#EFEFEF';
	}
}

const Dog = ({ d, i, length }) => {

	const bg = calculateBackground(d.status);

	return (
	<View style={{
		flexGrow: 1
	}}>
		<Image source={{ uri: d.image }} style={{ 
			width: DIMENSIONS.width, 
			height: (DIMENSIONS.width / 4) * 3}} 
		/>
		<View style={{
			backgroundColor: '#EFEFEF',
			flexDirection: 'row',
			alignItems: 'center',
			height: 50
		}}>
			<Text style={{
				fontSize: 26,
				paddingLeft: 16,
				flexGrow: 1,
				fontFamily: 'Itim-Regular'
			}}>{ d.name }</Text>
			<Text style={{
				paddingHorizontal: 16,
				paddingVertical: 8,
				fontSize: 14,
				fontFamily: 'Roboto-Thin'
			}}>{ `${ i + 1 } / ${ length }` }</Text>
			<Text style={{
				paddingHorizontal: 16, 
				height: 50,
				lineHeight: 50,
				fontSize: 18,
				color: 'white',
				backgroundColor: bg,
				textAlign: 'right',
				fontFamily: 'Roboto-Medium'
			}}>{ d.status }</Text>
		</View>
		<View style={{
			paddingHorizontal: 16,
			paddingVertical: 8
		}}>
			<Row>
				<Label>Geslacht:</Label>
				<TitleAnswer>{ d.gender }</TitleAnswer>
			</Row>
			<Row>
				<Label>Ras/Type:</Label>
				<TitleAnswer>{ d.type }</TitleAnswer>
			</Row>
			<Row>
				<Label>Leeftijd:</Label>
				<TitleAnswer>{ d.age }</TitleAnswer>
			</Row>
			<Row>
				<Label>Hoogte:</Label>
				<TitleAnswer>{ d.height }</TitleAnswer>
			</Row>
			<Row>
				<Label>Gecastreerd:</Label>
				<TitleAnswer>{ d.castrated }</TitleAnswer>
			</Row>
			<Row>
				<Label>Land van Herkomst:</Label>
				<TitleAnswer>{ d.origin }</TitleAnswer>
			</Row>
			<Row>
				<Label>Huidige verblijfplaats</Label>
				<TitleAnswer>{ d.location }</TitleAnswer>
			</Row>
			<Row>
				<Label>Vergoeding:</Label>
				<TitleAnswer>{ d.fee }</TitleAnswer>
			</Row>
		</View>
	</View>
	);
}

export default Dog;