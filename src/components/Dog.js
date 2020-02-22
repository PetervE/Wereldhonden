import React, { useEffect, useRef, useCallback } from 'react';
import { View, ActivityIndicator, Image, Text } from 'react-native';
import { isAndroid, DIMENSIONS, Label, Row, TitleAnswer } from '../styles';

const Dog = ({ d }) => {
    return (
    <View style={{
			flexGrow: 1
		}}>
			<Image source={{ uri: d.image }} style={{ width: DIMENSIONS.width, height: (DIMENSIONS.width / 4) * 3}} />
			<View style={{
				paddingHorizontal: 16,
				paddingVertical: 16
			}}>
				<Row>
					<Label>Name</Label>
					<TitleAnswer>{ d.name }</TitleAnswer>
				</Row>
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
					<Label>Gesteriliseerd:</Label>
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