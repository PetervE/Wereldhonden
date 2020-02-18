import React, { useEffect, useRef, useCallback } from 'react';
import { View, ActivityIndicator } from 'react-native';

export default Loader = () => {
    return (
    <View style={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#222222" />
    </View>
    );
}