export const environment = {
  production: false,
  baseUrl: "http://localhost:1337/",
  cognito: {
    UserPoolId: "ap-southeast-1_bH7CI5MHi",
    ClientId: "nkgtmqaoagu2n3q8pnkicdfqc",
    domain:
      "https://ap-southeast-1bh7ci5mhi.auth.ap-southeast-1.amazoncognito.com",
    redirectSignIn: "http://localhost:4200/",
    redirectSignOut: "http://localhost:4200/",
    responseType: "code",
  },
};
