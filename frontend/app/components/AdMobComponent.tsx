import React, { useState, useEffect } from 'react';
import { View, Platform } from 'react-native';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';

// Define your ad unit IDs
const BANNER_AD_UNIT_ID = Platform.select({
  ios: 'ca-app-pub-8458641881172480~9035607678',
});

export default function AdMobComponent() {

  // Banner Ad Component
  const BannerAdComponent = () => (
    <BannerAd
      unitId={TestIds.BANNER}
      size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
      requestOptions={{
        requestNonPersonalizedAdsOnly: true,
        networkExtras: {
          collapsible: 'bottom'
        }
      }}
    />
  );

  return (
    <View style={[{ alignItems: 'center' }]}>
      <BannerAdComponent />
    </View>
  );
};