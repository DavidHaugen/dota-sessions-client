import React, { Component } from 'react';
import UserContext from '../../contexts/UserContext';
import config from '../../config';
import moment from 'moment';
import TokenService from '../../services/token-service';

export default class Dashboard extends Component {
  state = {
    notesComplete: false,
    matchesComplete: false,
    recentMatches: [],
    happy: '',
    matchNotes: {}
  }

  static contextType = UserContext;

  componentDidMount(){
    this.context.getSteamId()
      .then(() => {
        this.fetchRecentMatches();  
      });
    this.fetchMatchNotes();
  }

  fetchRecentMatches = () => {
    fetch(`${config.API_ENDPOINT}/proxy/${this.context.steamId}`)
      .then(res => res.json())
      .then(res => this.setState({recentMatches: res, matchesComplete: true}));
  }

  fetchMatchNotes = () => {
    fetch(`${config.API_ENDPOINT}/match`, {
      headers: {
        'content-type': 'application/json',
        'authorization': `bearer ${TokenService.getAuthToken()}`
      } 
    })
      .then(res => res.json())
      .then(res => {
        const arr = res.map(match => {
          const result = {[match.match_id]: match};
          return result;
        });
        arr.forEach(match => {
          this.setState({matchNotes: {...this.state.matchNotes, ...match}, notesComplete: true});
        });
      });
  }

  sendMatchNotes = (event, matchId) => {
    event.preventDefault();
    const match = this.state.matchNotes[matchId];
    const method = this.matchHasFeedback(match) ? 'POST' : 'Patch';
    fetch(`${config.API_ENDPOINT}/match`, {
      headers: {
        'content-type': 'application/json',
        'authorization': `bearer ${TokenService.getAuthToken()}`
      },
      method: method,
      body: JSON.stringify({
        matchId: matchId,
        happy: match.happy,
        work: match.work,
        question: match.question,
        notes: match.notes
      })
    })
      .then(res => res.json())
      .then(res => console.log(res));
  }


  updateHappy = (event, matchId) => {
    this.setState({matchNotes: {...this.state.matchNotes, [matchId]: {...this.state.matchNotes[matchId], happy: `${event.target.value}`}}});
  }

  updateWork = (event, matchId) => {
    this.setState({matchNotes: {...this.state.matchNotes, [matchId]: {...this.state.matchNotes[matchId], work: `${event.target.value}`}}});
  }

  updateQuestion = (event, matchId) => {
    this.setState({matchNotes: {...this.state.matchNotes, [matchId]: {...this.state.matchNotes[matchId], question: `${event.target.value}`}}});
  }

  updateNotes = (event, matchId) => {
    this.setState({matchNotes: {...this.state.matchNotes, [matchId]: {...this.state.matchNotes[matchId], notes: `${event.target.value}`}}});
  }

  enableEditing = (matchId, e) => {
    e.preventDefault();
    const inputs = document.getElementsByClassName(`${matchId}-input`);
    const labels = document.getElementsByClassName(`${matchId}-label`);
    const submitButton = document.getElementsByClassName(`${matchId}-submit-button`);
    for(let i = 0; i < inputs.length; i++){
      inputs[i].classList.remove('hidden');
      labels[i].classList.remove('hidden');
    }
    
    submitButton[0].classList.remove('hidden');

    const paragraphs = document.getElementsByClassName(`${matchId}-paragraph`);
    for(let i = 0; i < paragraphs.length; i++){
      paragraphs[i].classList.add('hidden');
    }

    document.getElementById(`${matchId}-cancel-button`).classList.remove('hidden');
  }

  disableEditing = (matchId, e) => {
    e.preventDefault();
    const inputs = document.getElementsByClassName(`${matchId}-input`);
    const labels = document.getElementsByClassName(`${matchId}-label`);
    const submitButton = document.getElementsByClassName(`${matchId}-submit-button`);

    for(let i = 0; i < inputs.length; i++){
      inputs[i].classList.add('hidden');
      labels[i].classList.add('hidden');
    }
    submitButton[0].classList.add('hidden');

    const paragraphs = document.getElementsByClassName(`${matchId}-paragraph`);
    for(let i = 0; i < paragraphs.length; i++){
      paragraphs[i].classList.remove('hidden');
    }

    document.getElementById(`${matchId}-cancel-button`).classList.add('hidden');
  }

  matchHasFeedback = (match) => {
    if(Object.keys(this.state.matchNotes).includes(match.match_id.toString())){
      return true;
    } else {
      return false;
    }
  }

  testFeedback = (match) => {
    if(this.matchHasFeedback(match)){
      console.log('should patch here');
    } else{
      console.log('should not patch, no feedback');
    }
  }

  generateFeedbackContent = (match) => {
    return <form className='match-feedback' onSubmit={(event, matchId) => this.sendMatchNotes(event, match.match_id)}>
      <label className={this.matchHasFeedback(match) ? `${match.match_id}-label hidden` : `${match.match_id}-label`}>Happy
        <p className={`${match.match_id}-paragraph`}>{this.matchHasFeedback(match) ? this.state.matchNotes[match.match_id].happy : null}</p>
        <input type='text' onChange={(event, matchId) => this.updateHappy(event, match.match_id)} className={`${match.match_id}-input hidden`} value={this.state.matchNotes[match.match_id] ? this.state.matchNotes[match.match_id].happy : ''}></input>
      </label>
      <br />
      <label className={this.matchHasFeedback(match) ? `${match.match_id}-label hidden` : `${match.match_id}-label`}>Work
        <p className={`${match.match_id}-paragraph`}>{this.state.matchNotes[match.match_id] ? this.state.matchNotes[match.match_id].work : null}</p>
        <input type='text' onChange={(event, matchId) => this.updateWork(event, match.match_id)} className={`${match.match_id}-input hidden`} value={this.state.matchNotes[match.match_id] ? this.state.matchNotes[match.match_id].work : ''}></input>
      </label>
      <br />
      <label className={this.matchHasFeedback(match) ? `${match.match_id}-label hidden` : `${match.match_id}-label`}>Question
        <p className={`${match.match_id}-paragraph`}>{this.state.matchNotes[match.match_id] ? this.state.matchNotes[match.match_id].question : null}</p>
        <input type='text' onChange={(event, matchId) => this.updateQuestion(event, match.match_id)} className={`${match.match_id}-input hidden`} value={this.state.matchNotes[match.match_id] ? this.state.matchNotes[match.match_id].question : ''}></input>
      </label>
      <br />
      <label className={this.matchHasFeedback(match) ? `${match.match_id}-label hidden` : `${match.match_id}-label`}>Notes
        <p className={`${match.match_id}-paragraph`}>{this.state.matchNotes[match.match_id] ? this.state.matchNotes[match.match_id].notes : null}</p>
        <input type='text' onChange={(event, matchId) => this.updateNotes(event, match.match_id)} className={`${match.match_id}-input hidden`} value={this.state.matchNotes[match.match_id] ? this.state.matchNotes[match.match_id].notes : ''}></input>
      </label>
      <button onClick={e => this.enableEditing(match.match_id, e)}>Edit</button>
      <button type='submit' className={`${match.match_id}-submit-button hidden`} >Submit</button>
      <button onClick={e => this.disableEditing(match.match_id, e)} className='hidden' id={`${match.match_id}-cancel-button`}>Cancel</button>
      <button onClick={e => this.testFeedback(match)}>TEST FEEDBACK</button>
    </form>;
  }

  paragraphHasContent = (matchId, field) => {
    if(this.state.matchNotes[matchId] && this.state.matchNotes[matchId][field]){
      return 'hidden';
    }
  }

  renderMatchHistory = () => {
    return (
      this.state.recentMatches.map((match, key) => 
        <div key={key} className="matchInfo">
          <p>{this.context.heroes.find(hero => hero.id === match.hero_id).name}</p>
          <p>{moment.unix(match.start_time).format('MMMM Do YYYY, h:mm:ss a')}</p>
          <p>kdr: {match.kills}/{match.deaths}/{match.assists}</p>
          <p>{(match.player_slot <= 127 && match.radiant_win) || (match.player_slot >= 128 && ! match.radiant_win) ? 'win' : 'loss'}</p>
          <p>Match Id: {match.match_id}</p>
          {this.generateFeedbackContent(match)}
        </div>
      )
    );
  }

  render(){
    return (
      <div className='center columnCenter'>
        <button onClick={this.fetchRecentMatches}>Refresh recent Matches</button>
        {this.state.recentMatches && this.state.notesComplete ? this.renderMatchHistory() : null}
      </div>
    );
  }
}