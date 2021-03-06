import React from 'react';

import Router from 'next/router'

import Button from "./stateless/Button"

import MapContainer from './MapContainer';
import AddressInputWrapper from './AddressInputWrapper';

class GoogleContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            isAdd: this.props.isAdd,
            isPreviewing: false,
            mapCenterLat: 40.691332,
            mapCenterLng: -73.985059,
            userInfo: [],
            social: false,
            tech: false,
            stay: false
        };
    }

    async componentDidMount() {
        const userInfo = await this.fetchData()
        this.setState({
            userInfo: userInfo
        })
    }

    updateGoogleContainer = (latitude, longitude) => {
        this.setState({
            mapCenterLat: latitude,
            mapCenterLng: longitude
        })
    }

    previewLocation = (latitude, longitude) => {
        this.setState({
            mapCenterLat: latitude,
            mapCenterLng: longitude,
            isPreviewing: true
        })
    }

    addUserInfo = async () => {
        try {            
            const result = await fetch("http://localhost:4000/api/user_info",{
                method: "POST",
                body: JSON.stringify({
                    email: this.props.email,
                    first_name: this.props.firstName,
                    last_name: this.props.lastName,
                    batches: this.props.batches,
                    social: this.state.social, 
                    tech: this.state.tech,
                    stay: this.state.stay,
                    latitude: this.state.mapCenterLat, 
                    longitude: this.state.mapCenterLng,
                }),
                headers: {
                    'Accept': "application",
                    'Content-Type' : "application/json"
                }
            })
            console.log(result)
            Router.push('/')

        } catch(err) {
            console.log(err)
        }
    }

    fetchData = () => {
        return new Promise((resolve, reject) => {
          fetch("http://localhost:4000/api/user_info")
		     .then(async resp => {
                const data = await resp.json()
                resolve(data)
            }).catch((err) => { 
                console.log(err); 
                reject(err) })
        })
    }

    renderSearch = () => { 
        return (
            <MapContainer
                mapCenterLat = {this.state.mapCenterLat}
                mapCenterLng = {this.state.mapCenterLng}
                userInfo = {this.state.userInfo} >
                <AddressInputWrapper
                    isAdd = {this.state.isAdd}
                    updateGoogleContainer = {this.updateGoogleContainer.bind(this)}
                />
            </MapContainer>
        );
    }

    renderPreview = () => {
        let userInfo;
        if (this.state.isPreviewing) {
            userInfo = [{
                latitude : this.state.mapCenterLat,
                longitude : this.state.mapCenterLng,
                firstName : this.props.firstName,
                lastName : this.props.lastName
                }];
        } else {
            userInfo = [];
        }

        const addButton =
            userInfo.length === 1 ?
            <Button type = "submit" onClick = {() => {this.addUserInfo()}} title = "Add Address"/> :
            <div></div>

        return (
        <div>
            <p>How may other Recursers contact you?</p>

            <input type="checkbox" id="Social" name="Social" onClick={()=>{this.setState({social: true})}}/><label htmlFor="Social">Social</label>
            <input type="checkbox" id="Tech" name="Tech" onClick={()=>{this.setState({tech: true})}}/><label htmlFor="Tech">Tech</label>
            <input type="checkbox" id="Stay" name="Stay" onClick={()=>{this.setState({stay: true})}}/><label htmlFor="Stay">Stay</label>
        
            <MapContainer
                userInfo = {userInfo}
                mapCenterLat = {this.state.mapCenterLat}
                mapCenterLng = {this.state.mapCenterLng} >
                <AddressInputWrapper
                    isAdd = {this.state.isAdd}
                    updateGoogleContainer = {(latitude, longitude) => {
                    this.previewLocation(latitude, longitude);
                    }}
                />
                {addButton}
            </MapContainer>
       </div>);
    }


    render() {
        return this.state.isAdd ? this.renderPreview() : this.renderSearch();
    }
}

export default GoogleContainer