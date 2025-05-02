// src/aws-exports.js
const awsConfig = {
    Auth: {
      region:              process.env.REACT_APP_AWS_REGION,
      userPoolId:          process.env.REACT_APP_USER_POOL_ID,
      userPoolWebClientId: process.env.REACT_APP_USER_POOL_CLIENT_ID,
      oauth: {
        // build the full URL here
        domain:        `https://${process.env.REACT_APP_COGNITO_DOMAIN}`,
        scope:         ['email','openid','profile'],
        redirectSignIn:  process.env.REACT_APP_REDIRECT_URI,
        redirectSignOut: process.env.REACT_APP_REDIRECT_URI,
        responseType:    'code',
      },
    },
  };
  
  export default awsConfig;

/*
const awsConfig = {
    Auth: {
      region: process.env.REACT_APP_AWS_REGION,
      userPoolId: process.env.REACT_APP_USER_POOL_ID,
      userPoolWebClientId: process.env.REACT_APP_USER_POOL_CLIENT_ID,
      oauth: {
        domain: `${process.env.REACT_APP_COGNITO_DOMAIN}`,
        scope: ['email', 'openid', 'profile'],
        redirectSignIn: process.env.REACT_APP_REDIRECT_URI,
        redirectSignOut: process.env.REACT_APP_REDIRECT_URI,
        responseType: 'code',
      },
    },
  };
  
  export default awsConfig;
*/
