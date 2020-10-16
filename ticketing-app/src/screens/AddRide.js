import React, {Component} from 'react';

import axios from 'axios';
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import MenuIcon from '@material-ui/icons/Menu';
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormHelperText from "@material-ui/core/FormHelperText";

class AddRide extends Component {
    state = {
        passengerData:null,
        isQrLoaded: false,
        rideId: "R0004",
        startPoint: "",
        endPoint: "",
        ticketAmount: 0,
        passengerID: "",
        date: "",
        routeId: "",
        qrId: "QR0003",
        RoutIdList: ['154','100'],
        busStops: [],
        busStopsLoaded:false,
        passengerAvailableBalance: 0,
    };

    datee;

    constructor(props) {
        super(props);
        // this.handleRideIDChange = this.handleRideIDChange.bind(this);
        this.handlestartPointIDChange = this.handlestartPointIDChange.bind(this);
        this.handleendPointIDChange = this.handleendPointIDChange.bind(this);
        this.handleticketAmountIDChange = this.handleticketAmountIDChange.bind(this);
        // this.handlepassengerIDIDChange = this.handlepassengerIDIDChange.bind(this);
        // this.handledateChange = this.handledateChange.bind(this);
        this.handlerouteIdIDChange = this.handlerouteIdIDChange.bind(this);
        this.setDate = this.setDate.bind(this);

        this.setDate();
        this.loadPassengerDetails();

    }

    loadPassengerDetails = () =>{
        let pid = 'P0001';
        axios.get('http://localhost:3002/passengers/'+pid)
            .then(res => {
                console.log("passenger data: "+ res.data[0].availableAmount)
                this.setState({
                    passengerData: res.data[0],
                    passengerID: pid,
                    passengerAvailableBalance: res.data[0].availableAmount
                });
            });
    }

    setDate = ()=> {
        console.log("date");
        let date_ob = new Date();
        let date = ("0" + date_ob.getDate()).slice(-2);
        let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
        let year = date_ob.getFullYear();


        let curDate = date + "/" + month + "/" + year;
        console.log(curDate)
        this.setState({
                date: curDate
            })
        this.datee = curDate;

    };

    handlestartPointIDChange(event) {
        this.setState({
            startPoint: event.target.value
        });
    }
    handleendPointIDChange(event) {
        this.setState({
            endPoint: event.target.value
        });
        this.generateTicketAMount();
    }

    generateTicketAMount=()=>{
        console.log(this.datee)
        let start = this.state.startPoint;
        let end = this.state.endPoint;
        let sIndex, eIndex, price, priceGap = 0;
        let arrayy = this.state.busStops;
        if(start!==null && start!=="" && end!==null && end!==""){
            // this.state.busStops.map(item => (
            //     <MenuItem key={item} value={item}>{item}</MenuItem>
            // ));
            for (let i =0 ; i<arrayy.length; i++){
                if(arrayy[i]===start){
                    sIndex = i;
                }
                if(arrayy[i]===end){
                    eIndex = i;
                }
            }
            priceGap = eIndex - sIndex;
            if(priceGap<0){
                priceGap = priceGap*(-1);
            }
            price= priceGap*3+10;

            this.setState({
                ticketAmount: price
            })
        }
    };

    handleticketAmountIDChange(event) {
        this.setState({
            ticketAmount: event.target.value
        });
    }

    handlerouteIdIDChange(event) {
        // console.log(event.target.value)
        this.setState({
            routeId: event.target.value
        });

        axios.get('http://localhost:3002/routes/'+event.target.value)
            .then(res => {
                this.setState({
                    busStops: res.data[0].busStops,
                    busStopsLoaded: true
                })
            });

    }

    generateQR = () => {
        //generate qr & save it to db
        axios.post('http://localhost:3002/qr/generateqr', {
            rideId: this.state.rideId,
            startPoint: this.state.startPoint,
            endPoint: this.state.endPoint,
            ticketAmount: this.state.ticketAmount,
            passengerID: this.state.passengerID,
            date: this.datee,
            routeId: this.state.routeId,
            qrId: this.state.qrId,
        })
            .then((response) => {
                console.log(response);
                this.setState({
                    imgData:response.data.qrUrl,
                    isQrLoaded: true
                })
            }, (error) => {
                console.log(error);
            });


        //save ride details to db
        axios.post('http://localhost:3002/rides', {
            rideId: this.state.rideId,
            startPoint: this.state.startPoint,
            endPoint: this.state.endPoint,
            ticketAmount: this.state.ticketAmount,
            passengerID: this.state.passengerID,
            date: this.datee,
            routeId: this.state.routeId
        })
            .then((response) => {
                console.log(response);
                this.setState({
                    imgData:response.data.qrUrl,
                    isQrLoaded: true
                })
            }, (error) => {
                console.log(error);
            });
    }

     routeMenuItems = this.state.RoutIdList.map(item => (
        <MenuItem key={item} value={item}>{item}</MenuItem>
    ));
    busStopsMenuItems;

    render() {
        let self = this.state;
        let routeList = this.state.RoutIdList;
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

                <Paper elevation={3} style={{margin: 10, padding: 10 }}>
                    <TextField
                        id="outlined-read-only-input"
                        label="Available Balance Credit"
                        value={self.passengerAvailableBalance}
                        InputProps={{
                            readOnly: true,
                        }}
                        variant="outlined"
                        style={{width:300, marginBottom: 10}}
                    />
                    <FormControl required  variant="filled" style={{width:300, marginBottom: 10}}>
                        <InputLabel id="demo-simple-select-filled-label">Route</InputLabel>
                        <Select
                            labelId="demo-simple-select-filled-label"
                            id="demo-simple-select-filled"
                            value={self.routeId}
                            onChange={(value)=>this.handlerouteIdIDChange(value)}

                        >
                            <MenuItem value="">
                                <em>None</em>
                            </MenuItem>
                            {this.routeMenuItems}
                        </Select>
                        <FormHelperText>Required</FormHelperText>
                    </FormControl>
                    <FormControl required variant="filled"  style={{width:300, marginBottom: 10}}>
                        <InputLabel id="demo-simple-select-filled-label">Start</InputLabel>
                        <Select
                            labelId="demo-simple-select-filled-label"
                            id="demo-simple-select-filled"
                            value={self.startPoint}
                            onChange={(value)=>this.handlestartPointIDChange(value)}
                        >
                            <MenuItem value="">
                                <em>None</em>
                            </MenuItem>

                            {(self.busStopsLoaded)?this.busStopsMenuItems = self.busStops.map(item => (
                            <MenuItem key={item} value={item}>{item}</MenuItem>
                        )):null}
                            {(self.busStopsLoaded)?this.busStopsMenuItems:null}

                        </Select>
                        <FormHelperText>Required</FormHelperText>
                    </FormControl>
                    <FormControl required variant="filled"  style={{width:300, marginBottom: 10}}>
                        <InputLabel id="demo-simple-select-filled-label">End</InputLabel>
                        <Select
                            labelId="demo-simple-select-filled-label"
                            id="demo-simple-select-filled"
                            value={self.endPoint}
                            onChange={(value)=>this.handleendPointIDChange(value)}
                        >
                            <MenuItem value="">
                                <em>None</em>
                            </MenuItem>

                            {(self.busStopsLoaded)?this.busStopsMenuItems = self.busStops.map((item,index) => (
                                <MenuItem key={item} value={item}>{item}</MenuItem>
                            )):null}
                            {(self.busStopsLoaded)?this.busStopsMenuItems:null}
                        </Select>
                        <FormHelperText>Required</FormHelperText>
                    </FormControl>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={this.generateTicketAMount}
                        style={{marginBottom: 20}}
                    >
                        Generate Price
                    </Button>
                    <TextField
                        id="outlined-read-only-input"
                        label="Ticket Amount"
                        value={self.ticketAmount}
                        InputProps={{
                            readOnly: true,
                        }}
                        variant="outlined"
                        style={{width:300, marginBottom: 10}}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={this.generateQR}
                    >
                        Book Now
                    </Button>
                </Paper>


                <div>
                    {(self.isQrLoaded)?
                        <Paper elevation={3} style={{margin: 10, padding: 10 }}>
                            <Typography variant="h6" color="inherit">
                                Generated Ticket
                            </Typography>
                            <p>Route : {this.state.routeId}</p>
                            <p>Date : {this.datee}</p>
                            <p>Start Point : {this.state.startPoint}</p>
                            <p>End Point : {this.state.endPoint}</p>
                            <p>Ticket Amount : {this.state.ticketAmount}</p>
                            <img src={this.state.imgData} alt="qr code"/>
                        </Paper>
                        :null}
                </div>
            </div>
        );
    }
}

export default AddRide;
