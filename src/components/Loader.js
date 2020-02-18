import React, { useEffect, useRef, useCallback } from 'react';
import { View, ActivityIndicator } from 'react-native';

const Loader = () => {
    return (
    <View style={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="small" color="#222222" />
    </View>
    );
}

export default Loader;