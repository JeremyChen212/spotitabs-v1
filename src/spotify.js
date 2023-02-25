import axios from 'axios';


// Map for localStorage keys
const LOCALSTORAGE_KEYS = {
    accessToken: 'spotify_access_token',
    refreshToken: 'spotify_refresh_token',
    expireTime: 'spotify_token_expire_time',
    timestamp: 'spotify_token_timestamp',
}

// Map to retrieve localStorage values
const LOCALSTORAGE_VALUES = {
    accessToken: window.localStorage.getItem(LOCALSTORAGE_KEYS.accessToken),
    refreshToken: window.localStorage.getItem(LOCALSTORAGE_KEYS.refreshToken),
    expireTime: window.localStorage.getItem(LOCALSTORAGE_KEYS.expireTime),
    timestamp: window.localStorage.getItem(LOCALSTORAGE_KEYS.timestamp),
};
const refreshToken = async () => {
    try {
        if(!LOCALSTORAGE_KEYS.refreshToken || !LOCALSTORAGE_KEYS.refreshToken === 'undefined' || 
        (Date.now() - Number(LOCALSTORAGE_KEYS.timestamp) / 10000)  < 1000
        ) {
            console.error('No refresh token found');
            logout();
        }

        // Use '/refresh_token' endpoint from our Node app
        const {data} = await axios.get(`/refresh_token?refresh_token=${LOCALSTORAGE_KEYS.refreshToken}`);

        // Update local storage values
        window.localStorage.setItem(LOCALSTORAGE_KEYS.accessToken, data.access_token);
        window.localStorage.setItem(LOCALSTORAGE_KEYS.timestamp, Date.now());

        window.location.reload();
    } catch (error) {
        console.log(error);
    }
}
export const logout = () => {
    for (const property in LOCALSTORAGE_KEYS) {
        window.localStorage.removeItem(LOCALSTORAGE_KEYS[property]);
    }
    // Navigate to homepage
    window.location = window.location.origin;
}
const hasTokenExpired = () => {
    const { accessToken, timestamp, expireTime } = LOCALSTORAGE_VALUES;
    if (!accessToken || !timestamp) {
      return false;
    }
    const millisecondsElapsed = Date.now() - Number(timestamp);
    return (millisecondsElapsed / 1000) > Number(expireTime);
};


const getAccessToken = () => {
    console.log(Date.now())

    const queryString = window.location.search; // Gets text after url ("/")
    console.log(queryString) 
    const urlParams = new URLSearchParams(queryString); // Converts text to object with individual values paramaters
    const queryParams = {
        // Assigns corresponding urlParams to the local storage keys.
        [LOCALSTORAGE_KEYS.accessToken]: urlParams.get('access_token'),
        [LOCALSTORAGE_KEYS.refreshToken]: urlParams.get('refresh_token'),
        [LOCALSTORAGE_KEYS.expireTime]: urlParams.get('expires_in'),
    }
    const hasError = urlParams.get('error');

    // If there is an error or expired token in local storage, refresh the token.
    if(hasError || hasTokenExpired()) {
        refreshToken();
    }

    // If there is an access token in local storage, return it
    if(LOCALSTORAGE_VALUES.accessToken && LOCALSTORAGE_VALUES.accessToken !== 'undefined') {
        return LOCALSTORAGE_KEYS.accessToken;
    }

     // If there is a token in the URL query params, user is logging in for the first time
    if (queryParams[LOCALSTORAGE_KEYS.accessToken]) {
    // Store the query params in localStorage
        for (const property in queryParams) {
            window.localStorage.setItem(property, queryParams[property]);
        }
        // Set timestamp
        window.localStorage.setItem(LOCALSTORAGE_KEYS.timestamp, Date.now());
        // Return access token from query params
        return queryParams[LOCALSTORAGE_KEYS.accessToken];
    }
    
    return false; 
}



export const accessToken = getAccessToken();

axios.defaults.baseURL = 'https://api.spotify.com/v1';
axios.defaults.headers['Authorization'] = `Bearer ${accessToken}`;
axios.defaults.headers['Content-Type'] = 'application/json';
export const getCurrentUserProfile = () => axios.get('/me');

