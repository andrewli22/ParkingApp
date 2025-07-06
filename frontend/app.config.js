import 'dotenv/config';

export default {
  expo: {
    owner: 'b3ef',
    name: 'parkingapp',
    slug: 'parkingapp',
    scheme: 'parkingapp',
    version: '1.0.0',
    extra: {
      apiBaseUrl: process.env.API_BASE_URL,
      eas: {
        projectId: '5780fbe1-0b2b-4887-a5ce-4498e6703f2b'
      }
    },
    updates: {
      url: 'https://u.expo.dev/5780fbe1-0b2b-4887-a5ce-4498e6703f2b'
    },
    runtimeVersion: {
      policy: 'appVersion'
    }
  },
};