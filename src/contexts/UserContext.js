import React, { Component } from 'react';
import AuthApiService from '../services/auth-api-service';
import TokenService from '../services/token-service';
import IdleService from '../services/idle-service';
import config from '../config';

const UserContext = React.createContext({
  user: {},
  error: null,
  steamId: null,
  heroes: [],
  setError: () => {},
  clearError: () => {},
  setUser: () => {},
  processLogin: () => {},
  processLogout: () => {},
  getSteamId: () => {},
});

export default UserContext;

export class UserProvider extends Component {
  constructor(props) {
    super(props);
    const state = { user: {}, error: null, 
      heroes: [
        {
          id: 1,
          name: 'Anti-Mage',
          legs: 2
        },
        {
          id: 2,
          name: 'Axe',
          legs: 2
        },
        {
          id: 3,
          name: 'Bane',
          legs: 4
        },
        {
          id: 4,
          name: 'Bloodseeker',
          legs: 2
        },
        {
          id: 5,
          name: 'Crystal Maiden',
          legs: 2
        },
        {
          id: 6,
          name: 'Drow Ranger',
          legs: 2
        },
        {
          id: 7,
          name: 'Earthshaker',
          legs: 2
        },
        {
          id: 8,
          name: 'Juggernaut',
          legs: 2
        },
        {
          id: 9,
          name: 'Mirana',
          legs: 2
        },
        {
          id: 10,
          name: 'Morphling',
          legs: 0
        },
        {
          id: 11,
          name: 'Shadow Fiend',
          legs: 0
        },
        {
          id: 12,
          name: 'Phantom Lancer',
          legs: 2
        },
        {
          id: 13,
          name: 'Puck',
          legs: 2
        },
        {
          id: 14,
          name: 'Pudge',
          legs: 2
        },
        {
          id: 15,
          name: 'Razor',
          legs: 0
        },
        {
          id: 16,
          name: 'Sand King',
          legs: 6
        },
        {
          id: 17,
          name: 'Storm Spirit',
          legs: 2
        },
        {
          id: 18,
          name: 'Sven',
          legs: 2
        },
        {
          id: 19,
          name: 'Tiny',
          legs: 2
        },
        {
          id: 20,
          name: 'Vengeful Spirit',
          legs: 2
        },
        {
          id: 21,
          name: 'Windranger',
          legs: 2
        },
        {
          id: 22,
          name: 'Zeus',
          legs: 2
        },
        {
          id: 23,
          name: 'Kunkka',
          legs: 2
        },
        {
          id: 25,
          name: 'Lina',
          legs: 2
        },
        {
          id: 26,
          name: 'Lion',
          legs: 2
        },
        {
          id: 27,
          name: 'Shadow Shaman',
          legs: 2
        },
        {
          id: 28,
          name: 'Slardar',
          legs: 0
        },
        {
          id: 29,
          name: 'Tidehunter',
          legs: 2
        },
        {
          id: 30,
          name: 'Witch Doctor',
          legs: 2
        },
        {
          id: 31,
          name: 'Lich',
          legs: 2
        },
        {
          id: 32,
          name: 'Riki',
          legs: 2
        },
        {
          id: 33,
          name: 'Enigma',
          legs: 0
        },
        {
          id: 34,
          name: 'Tinker',
          legs: 2
        },
        {
          id: 35,
          name: 'Sniper',
          legs: 2
        },
        {
          id: 36,
          name: 'Necrophos',
          legs: 2
        },
        {
          id: 37,
          name: 'Warlock',
          legs: 2
        },
        {
          id: 38,
          name: 'Beastmaster',
          legs: 2
        },
        {
          id: 39,
          name: 'Queen of Pain',
          legs: 2
        },
        {
          id: 40,
          name: 'Venomancer',
          legs: 0
        },
        {
          id: 41,
          name: 'Faceless Void',
          legs: 2
        },
        {
          id: 42,
          name: 'Wraith King',
          legs: 2
        },
        {
          id: 43,
          name: 'Death Prophet',
          legs: 2
        },
        {
          id: 44,
          name: 'Phantom Assassin',
          legs: 2
        },
        {
          id: 45,
          name: 'Pugna',
          legs: 2
        },
        {
          id: 46,
          name: 'Templar Assassin',
          legs: 2
        },
        {
          id: 47,
          name: 'Viper',
          legs: 0
        },
        {
          id: 48,
          name: 'Luna',
          legs: 2
        },
        {
          id: 49,
          name: 'Dragon Knight',
          legs: 2
        },
        {
          id: 50,
          name: 'Dazzle',
          legs: 2
        },
        {
          id: 51,
          name: 'Clockwerk',
          legs: 2
        },
        {
          id: 52,
          name: 'Leshrac',
          legs: 4
        },
        {
          id: 53,
          name: 'Nature\'s Prophet',
          legs: 2
        },
        {
          id: 54,
          name: 'Lifestealer',
          legs: 2
        },
        {
          id: 55,
          name: 'Dark Seer',
          legs: 2
        },
        {
          id: 56,
          name: 'Clinkz',
          legs: 2
        },
        {
          id: 57,
          name: 'Omniknight',
          legs: 2
        },
        {
          id: 58,
          name: 'Enchantress',
          legs: 4
        },
        {
          id: 59,
          name: 'Huskar',
          legs: 2
        },
        {
          id: 60,
          name: 'Night Stalker',
          legs: 2
        },
        {
          id: 61,
          name: 'Broodmother',
          legs: 8
        },
        {
          id: 62,
          name: 'Bounty Hunter',
          legs: 2
        },
        {
          id: 63,
          name: 'Weaver',
          legs: 4
        },
        {
          id: 64,
          name: 'Jakiro',
          legs: 2
        },
        {
          id: 65,
          name: 'Batrider',
          legs: 2
        },
        {
          id: 66,
          name: 'Chen',
          legs: 2
        },
        {
          id: 67,
          name: 'Spectre',
          legs: 0
        },
        {
          id: 68,
          name: 'Ancient Apparition',
          legs: 2
        },
        {
          id: 69,
          name: 'Doom',
          legs: 2
        },
        {
          id: 70,
          name: 'Ursa',
          legs: 2
        },
        {
          id: 71,
          name: 'Spirit Breaker',
          legs: 2
        },
        {
          id: 72,
          name: 'Gyrocopter',
          legs: 2
        },
        {
          id: 73,
          name: 'Alchemist',
          legs: 2
        },
        {
          id: 74,
          name: 'Invoker',
          legs: 2
        },
        {
          id: 75,
          name: 'Silencer',
          legs: 2
        },
        {
          id: 76,
          name: 'Outworld Devourer',
          legs: 4
        },
        {
          id: 77,
          name: 'Lycan',
          legs: 2
        },
        {
          id: 78,
          name: 'Brewmaster',
          legs: 2
        },
        {
          id: 79,
          name: 'Shadow Demon',
          legs: 2
        },
        {
          id: 80,
          name: 'Lone Druid',
          legs: 2
        },
        {
          id: 81,
          name: 'Chaos Knight',
          legs: 2
        },
        {
          id: 82,
          name: 'Meepo',
          legs: 2
        },
        {
          id: 83,
          name: 'Treant Protector',
          legs: 2
        },
        {
          id: 84,
          name: 'Ogre Magi',
          legs: 2
        },
        {
          id: 85,
          name: 'Undying',
          legs: 2
        },
        {
          id: 86,
          name: 'Rubick',
          legs: 2
        },
        {
          id: 87,
          name: 'Disruptor',
          legs: 2
        },
        {
          id: 88,
          name: 'Nyx Assassin',
          legs: 6
        },
        {
          id: 89,
          name: 'Naga Siren',
          legs: 0
        },
        {
          id: 90,
          name: 'Keeper of the Light',
          legs: 2
        },
        {
          id: 91,
          name: 'Io',
          legs: 0
        },
        {
          id: 92,
          name: 'Visage',
          legs: 2
        },
        {
          id: 93,
          name: 'Slark',
          legs: 2
        },
        {
          id: 94,
          name: 'Medusa',
          legs: 0
        },
        {
          id: 95,
          name: 'Troll Warlord',
          legs: 2
        },
        {
          id: 96,
          name: 'Centaur Warrunner',
          legs: 4
        },
        {
          id: 97,
          name: 'Magnus',
          legs: 4
        },
        {
          id: 98,
          name: 'Timbersaw',
          legs: 2
        },
        {
          id: 99,
          name: 'Bristleback',
          legs: 2
        },
        {
          id: 100,
          name: 'Tusk',
          legs: 2
        },
        {
          id: 101,
          name: 'Skywrath Mage',
          legs: 2
        },
        {
          id: 102,
          name: 'Abaddon',
          legs: 2
        },
        {
          id: 103,
          name: 'Elder Titan',
          legs: 2
        },
        {
          id: 104,
          name: 'Legion Commander',
          legs: 2
        },
        {
          id: 105,
          name: 'Techies',
          legs: 6
        },
        {
          id: 106,
          name: 'Ember Spirit',
          legs: 2
        },
        {
          id: 107,
          name: 'Earth Spirit',
          legs: 2
        },
        {
          id: 108,
          name: 'Underlord',
          legs: 2
        },
        {
          id: 109,
          name: 'Terrorblade',
          legs: 2
        },
        {
          id: 110,
          name: 'Phoenix',
          legs: 2
        },
        {
          id: 111,
          name: 'Oracle',
          legs: 2
        },
        {
          id: 112,
          name: 'Winter Wyvern',
          legs: 2
        },
        {
          id: 113,
          name: 'Arc Warden',
          legs: 2
        },
        {
          id: 114,
          name: 'Monkey King',
          legs: 2
        },
        {
          id: 119,
          name: 'Dark Willow',
          legs: 2
        },
        {
          id: 120,
          name: 'Pangolier',
          legs: 2
        },
        {
          id: 121,
          name: 'Grimstroke',
          legs: 2
        },
        {
          id: 129,
          name: 'Mars',
          legs: 2
        }
      ] 
    };

    const jwtPayload = TokenService.parseAuthToken();

    if (jwtPayload)
      state.user = {
        id: jwtPayload.user_id,
        name: jwtPayload.name,
        username: jwtPayload.sub,
      };

    this.state = state;
    IdleService.setIdleCallback(this.logoutBecauseIdle);
  }

  componentDidMount() {
    if (TokenService.hasAuthToken()) {
      IdleService.regiserIdleTimerResets();
      TokenService.queueCallbackBeforeExpiry(() => {
        this.fetchRefreshToken();
      });
    }
  }

  componentWillUnmount() {
    IdleService.unRegisterIdleResets();
    TokenService.clearCallbackBeforeExpiry();
  }

  setError = error => {
    console.error(error);
    this.setState({ error });
  }

  clearError = () => {
    this.setState({ error: null });
  }

  setUser = user => {
    this.setState({ user });
  }

  processLogin = authToken => {
    TokenService.saveAuthToken(authToken);
    const jwtPayload = TokenService.parseAuthToken();
    this.setUser({
      id: jwtPayload.user_id,
      name: jwtPayload.name,
      username: jwtPayload.sub,
    });
    IdleService.regiserIdleTimerResets();
    TokenService.queueCallbackBeforeExpiry(() => {
      this.fetchRefreshToken();
    });
  }

  processLogout = () => {
    TokenService.clearAuthToken();
    TokenService.clearCallbackBeforeExpiry();
    IdleService.unRegisterIdleResets();
    this.setUser({});
  }

  logoutBecauseIdle = () => {
    TokenService.clearAuthToken();
    TokenService.clearCallbackBeforeExpiry();
    IdleService.unRegisterIdleResets();
    this.setUser({ idle: true });
  }

  fetchRefreshToken = () => {
    AuthApiService.refreshToken()
      .then(res => {
        TokenService.saveAuthToken(res.authToken);
        TokenService.queueCallbackBeforeExpiry(() => {
          this.fetchRefreshToken();
        });
      })
      .catch(err => {
        this.setError(err);
      });
  }

  getSteamId = () => {
    return fetch(`${config.API_ENDPOINT}/user`, {
      headers: {
        'authorization': `Bearer ${TokenService.getAuthToken()}`,
      }})
      .then(res => res.json())
      .then(res => this.setState({steamId: res[0].steamId})); 
  } 


  render() {
    const value = {
      user: this.state.user,
      error: this.state.error,
      steamId: this.state.steamId,
      heroes: this.state.heroes,
      setError: this.setError,
      clearError: this.clearError,
      setUser: this.setUser,
      processLogin: this.processLogin,
      processLogout: this.processLogout,
      getSteamId: this.getSteamId,
    };
    return (
      <UserContext.Provider value={value}>
        {this.props.children}
      </UserContext.Provider>
    );
  }
}
