import React, { Component } from 'react';
import UserContext from '../../contexts/UserContext';
import config from '../../config';
import moment from 'moment';

export default class Dashboard extends Component {
  state = {
    recentMatches: []
  }

  static contextType = UserContext;

  fetchRecentMatches = () => {
    fetch(`${config.API_ENDPOINT}/proxy/${this.context.steamId}`)
      .then(res => res.json())
      .then(res => this.setState({recentMatches: res}));
  }

  componentDidMount(){
    this.context.getSteamId()
      .then(() => {
        this.fetchRecentMatches();  
      });
  }


  renderMatchHistory = () => {
    return (
      this.state.recentMatches.map((match, key) => 
        <div key={key} >
          <p>{this.context.heroes.find(hero => hero.id === match.hero_id).name}</p>
          <p>{moment.unix(match.start_time).format('MMMM Do YYYY, h:mm:ss a')}</p>
          <p>kdr: {match.kills}/{match.deaths}/{match.assists}</p>
          <p>{(match.player_slot <= 128 && match.radiant_win) || (match.player_slot >= 127 && ! match.radiant_win) ? 'win' : 'loss'}</p>
          <p>Match Id: {match.match_id}</p>
        </div>
      )
    );
  }

  render(){
    return (
      <div className='center columnCenter'>
        <button onClick={this.fetchRecentMatches}>Refresh recent Matches</button>
        {this.state.recentMatches ? this.renderMatchHistory() : null}
      </div>
    );
  }
}