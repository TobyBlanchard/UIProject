import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import {Route, Link} from 'react-router-dom'
import Signup from './Signup';
import axios from 'axios';
import Login from './components/Login';
import WorkShop from './components/WorkShop';
import storeData from './data';
import workShopData from './workshopData';
import MapContainer from './components/MapContainer';
import WorkShopContainer from './components/WorkshopContainer';
import MyWorkshop from './components/MyWorkshop';
import NavigationBar from './components/NavigationBar';
import Home from './components/Header';
import MyWorkshops from './components/MyWorkShops';
const url = "http://localhost:3001";
/* Set to true if using data from local json file  */
const useLocalData = false;

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      storeData: useLocalData ? storeData 
                              : [],
      workshopData: useLocalData ? workShopData 
                                 : [],
      favorites: [],
      isAuth: false                                                      
      }
  }

  componentDidMount() {
    if (!useLocalData) {
      axios.get(`${url}/api/stores`)
           .then(res => res.data)
           .then(
             (storeRecords) => {
               this.setState({
                  storeData: storeRecords
                });
              },
              (error) => {
                this.setState({
                  error
                })
              }
            )

            axios.get(`${url}/api/workshops`)
            .then(res => res.data)
            .then(
              (workshopRecords) => {
                this.setState({
                  workshopData: workshopRecords
                 });
               },
               (error) => {
                 this.setState({
                   error
                 })
               }
             )
      }
      axios.post(`${url}/api/favorites`, {
        token: localStorage.getItem('token')
    })
         .then(res => res.data)
         .then(
           (favorites) => {
             this.setState({
                 favorites: favorites
              });
            },
            (error) => {
              this.setState({
                error
              })
            }
          )    
      }


  _isAuthHandler = (auth=true) => {
    this.setState({
      isAuth: auth
    })
  }    
      
      
      
  render() {
    return (
      <div className="container">
        <Route path="/" component={(props) => <Home props={props} isAuth={this.state.isAuth} _isAuthHandler={this._isAuthHandler} />}/>
        <Route exact path="/" component={() => <MapContainer storeRecords={this.state.storeData} markerClickHandler={this._markerClickHandler} />}  />
        <Route path='/signup' component={(props) => <Signup props={props} _isAuthHandler={this._isAuthHandler} />} />
        <Route path='/login' component={(props) => <Login props={props} _isAuthHandler={this._isAuthHandler} /> }/>
        <Route path="/stores/:id" component={(props) => <WorkShopContainer workshopRecords={this.state.workshopData} props={props} _updateFavorites={this._updateFavorites} />}/>
        <Route path="/myworkshops" component={(props) => <MyWorkshops props={props} workShopRecords={this.state.favorites} />}/>
      </div>
    );
  }
}

export default App;