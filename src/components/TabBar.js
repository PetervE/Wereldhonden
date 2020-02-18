
import * as React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

const TabBar = ({ state, descriptors, navigation }) => {
	return (
		<View key={String(Math.random())} style={{ flexDirection: 'row' }}>
			{state.routes.map((route, index) => {
				const { options } = descriptors[route.key];
				const label =
					options.tabBarLabel !== undefined
						? options.tabBarLabel
						: options.title !== undefined
						? options.title
						: route.name;

				const isFocused = state.index === index;

				const onPress = () => {
					const event = navigation.emit({
						type: 'tabPress',
						target: route.key,
					});

					if (!isFocused && !event.defaultPrevented) {
						navigation.navigate(route.name);
					}
				};

				const onLongPress = () => {
					navigation.emit({
						type: 'tabLongPress',
						target: route.key,
					});
				};

				return (
					<TouchableOpacity
						key={String(Math.random())}
						accessibilityRole="button"
						accessibilityStates={isFocused ? ['selected'] : []}
						accessibilityLabel={options.tabBarAccessibilityLabel}
						testID={options.tabBarTestID}
						onPress={onPress}
						onLongPress={onLongPress}
						style={{ flex: 1, height: 100, justifyContent: 'center', alignItems: 'center' }}
					>
						<Text style={{ 
							color: isFocused ? '#673ab7' : '#222',
							fontFamily: 'Roboto-Bold',
							textTransform: 'uppercase',
							fontSize: 12,
						}}>
							{label}
						</Text>
					</TouchableOpacity>
				);
			})}
		</View>
	);
}

export default TabBar;