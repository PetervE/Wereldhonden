import { Text, View } from 'react-native';
import { Dimensions } from 'react-native';
import styled from 'styled-components';

const { width, height } = Dimensions.get('window');

export const DIMENSIONS = { width, height };

export const isAndroid = Platform.OS == 'android';

export const Row = styled(View)`
    flex-direction: row;
    align-items: center;
    padding-vertical: 4px;
`

export const Label = styled(Text)`
    font-family: Roboto-Thin;
    width: 150px;
    font-size: 14px;
`

export const TitleAnswer = styled(Text)`
    font-family: Roboto-Bold;
    font-size: 20px;
`;