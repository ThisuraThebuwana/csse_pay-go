import React, { Component } from "react";
import QrReader from "react-qr-reader";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import MenuIcon from '@material-ui/icons/Menu';
import Button from "@material-ui/core/Button";
import axios from "axios";

class QRReader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            delay: 300,
            result: null,
            passengerAvailableBalance:0
        };
        this.handleScan = this.handleScan.bind(this);
    }
    handleScan(data) {
        if (data) {
            console.log(data)
            const obj= JSON.parse(data);
            this.setState({
                result: obj
            });
        }
    }
    handleError(err) {
        console.error(err);
    }

    endRide=()=>{
        // console.log("res-->"+this.state.result)
        //
        // console.log("pid-->"+this.state.result.passengerId)

        this.getPassengerAvailableAmount();


    };
    getPassengerAvailableAmount=()=>{
        // let pid = this.state.result.passengerId;
        let pid = "P0001";
        axios.get('http://localhost:3002/passengers/'+pid)
            .then(res => {
                console.log("passenger data: "+ res.data[0].availableAmount)
                this.setState({
                    passengerAvailableBalance: res.data[0].availableAmount
                });
            }).then(()=>this.reducePassengerAvailableAmount());


    }

    reducePassengerAvailableAmount=()=>{
        console.log("avlbAmount-->"+this.state.passengerAvailableBalance)

        axios.patch('http://localhost:3002/passengers/'+this.state.result.passengerId, {
            availableAmount: this.state.passengerAvailableBalance-this.state.result.ticketAmount
        })
            .then((response) => {
                console.log(response);
                alert("Successfully ended the ride");
            }, (error) => {
                console.log(error);
                alert("Error on ending the ride");
            });
    }

    render() {
        return (
            <div>
                <AppBar position="static">
                    <Toolbar variant="dense">
                        <IconButton edge="start" color="inherit" aria-label="menu">
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="h6" color="inherit">
                            Pay & Go
                        </Typography>
                    </Toolbar>
                </AppBar>
                <h4>QR Code Scanner</h4>
                <QrReader
                    delay={this.state.delay}
                    onError={this.handleError}
                    onScan={this.handleScan}
                    style={{  margin :10}}
                />
                {(this.state.result!==null)?<div>
                    <p>Route : {this.state.result.routeId}</p>
                    <p>Date : {this.state.result.date}</p>
                    <p>Start Point : {this.state.result.startPoint}</p>
                    <p>End Point : {this.state.result.endPoint}</p>
                    <p>Ticket Amount : {this.state.result.ticketAmount}</p>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={this.endRide}
                        style={{marginBottom: 20}}
                    >
                        End Ride
                    </Button>
                </div>:<p>Scan QR code inside the passenger ticket</p>}

            </div>
        );
    }
}

export default QRReader;
