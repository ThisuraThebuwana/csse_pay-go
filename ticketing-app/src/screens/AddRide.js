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
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import Divider from "@material-ui/core/Divider";
import Drawer from "@material-ui/core/Drawer";
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import DriveEtaIcon from '@material-ui/icons/DriveEta';
import HistoryIcon from '@material-ui/icons/History';
import CreditCardIcon from '@material-ui/icons/CreditCard';

class AddRide extends Component {
    state = {
        passengerData:null,
        isQrLoaded: false,
        rideId: "",
        startPoint: "",
        endPoint: "",
        ticketAmount: 0,
        passengerID: window.passengersId,
        date: "",
        routeId: "",
        qrId: "",
        RoutIdList: ['154','100'],
        busStops: [],
        busStopsLoaded:false,
        passengerAvailableBalance: 0,
        isExtending:false,
        errorMsg:''
    };

    datee;

    constructor(props) {
        super(props);
        this.handlestartPointIDChange = this.handlestartPointIDChange.bind(this);
        this.handleendPointIDChange = this.handleendPointIDChange.bind(this);
        this.handleticketAmountIDChange = this.handleticketAmountIDChange.bind(this);
        this.handlerouteIdIDChange = this.handlerouteIdIDChange.bind(this);
        this.setDate = this.setDate.bind(this);

        this.setDate();
        this.loadPassengerDetails();
    }

    //get passenger available amount
    loadPassengerDetails = () =>{
        let pid = this.state.passengerID;
        axios.get('http://localhost:3002/passengers/'+pid)
            .then(res => {
                this.setState({
                    passengerData: res.data[0],
                    passengerAvailableBalance: res.data[0].availableAmount
                });
            });
    };

    //set date
    setDate = ()=> {
        let date_ob = new Date();
        let date = ("0" + date_ob.getDate()).slice(-2);
        let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
        let year = date_ob.getFullYear();


        let curDate = date + "/" + month + "/" + year;
        this.setState({
                date: curDate
            });
        this.datee = curDate;

    };

    //handle start point selector
    handlestartPointIDChange(event) {
        this.setState({
            startPoint: event.target.value
        });
    }

    //handle end point selector
    handleendPointIDChange(event) {
        this.setState({
            endPoint: event.target.value
        });
        this.generateTicketAMount();
    }

    //generate ticket amount
    generateTicketAMount=()=>{
        let start = this.state.startPoint;
        let end = this.state.endPoint;
        let sIndex, eIndex, price, priceGap = 0;

        //get bus stops for this route
        let arrayy = this.state.busStops;
        if(start!==null && start!=="" && end!==null && end!==""){
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

    //handle ticket amount text field
    handleticketAmountIDChange(event) {
        this.setState({
            ticketAmount: event.target.value
        });
    }

    //handle route id selector
    handlerouteIdIDChange(event) {
        this.setState({
            routeId: event.target.value
        });

        //get all the bus stops for this route
        axios.get('http://localhost:3002/routes/'+event.target.value)
            .then(res => {
                this.setState({
                    busStops: res.data[0].busStops,
                    busStopsLoaded: true
                })
            });

    }

    //book a ride
    bookNow=()=>{
        if(this.state.routeId==="" || this.state.startPoint==="" || this.state.endPoint===""){
            this.setState({
                errorMsg: '* Please select required fields'
            })
        }else if(this.state.ticketAmount===0){
            this.setState({
                errorMsg: '* Please generate price'
            })
        }else {

            //generate ride id
            axios.get('http://localhost:3002/rides/')
                .then(res => {
                    let len = res.data.length;
                    let x = res.data[len - 1].rideId.substr(4, 1);
                    let id = Number(x);
                    id++;
                    let idStr = "R000" + id;
                    this.setState({
                        rideId: idStr
                    })
                }).then(() => {


                 //generate qr id
                axios.get('http://localhost:3002/qr/')
                    .then(res => {
                        let len = res.data.length;
                        let x = res.data[len - 1].qrId.substr(5, 1);
                        let id = Number(x);
                        id++;
                        let idStr = "QR000" + id;
                        this.setState({
                            qrId: idStr
                        })
                    }).then(this.generateQR);

            });
        }
    };

    //generate qr
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
                this.setState({
                    imgData:response.data.qrUrl,
                    errorMsg: '',
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
            }, (error) => {
                console.log(error);
            });
    }

    //extend ride
    extendRide=()=>{
        if(this.state.startPoint==="" || this.state.endPoint===""){
            this.setState({
                errorMsg: '* Please select required fields'
            })
        }else if(this.state.ticketAmount===0){
            this.setState({
                errorMsg: '* Please generate price'
            })
        }else {
            //generate qrid
            axios.get('http://localhost:3002/qr/')
                .then(res => {
                    let len = res.data.length;
                    let x = res.data[len-1].qrId.substr(5,1);
                    let id = Number(x);
                    id++;
                    let idStr = "QR000"+id;
                    this.setState({
                        qrId: idStr
                    })
                }).then(this.QRForExtendRide);
        }
    };
    QRForExtendRide=()=>{
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
        axios.patch('http://localhost:3002/rides/'+this.state.rideId, {
            startPoint: this.state.startPoint,
            endPoint: this.state.endPoint,
            ticketAmount: this.state.ticketAmount,
        })
            .then((response) => {
                console.log(response);
            }, (error) => {
                console.log(error);
            });
    };

    //cancel ride
    cancelRide=()=>{
        axios.delete('http://localhost:3002/qr/'+this.state.qrId)
            .then(res => {
                console.log(res);
            },err=>{
                console.log(err);
            }).then(()=>{
                axios.delete('http://localhost:3002/rides/'+this.state.rideId)
                    .then(res => {
                        console.log(res);
                        this.setState({
                            isQrLoadded: false
                        })
                    },err=>{
                        console.log(err);
                    });
        });
    };

    routeMenuItems = this.state.RoutIdList.map(item => (
        <MenuItem key={item} value={item}>{item}</MenuItem>
    ));

    toggleDrawer = (anchor, open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }

        this.setState({ ...this.state, [anchor]: open });
    };

    toggleDrawerAddRide=()=>{
        this.toggleDrawer('left',false);
        this.props.history.push('/addRide');
    };
    toggleDrawerRecharge=()=>{
        this.toggleDrawer('left',false);
        this.props.history.push('/recharge');
    };
    toggleDrawerHistory=()=>{
        this.toggleDrawer('left',false);
        // this.props.history.push('/history');
    };
    toggleDrawerLogout=()=>{
        this.toggleDrawer('left',false);
        this.props.history.push('/login');
    };

    list = (anchor) => (
        <div
            role="presentation"
            // onClick={this.toggleDrawer(anchor, false)}
            onKeyDown={this.toggleDrawer(anchor, false)}
        >
            <List>
                {/*{['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (*/}
                    <ListItem button onClick={this.toggleDrawerAddRide}>
                        <ListItemIcon><DriveEtaIcon /></ListItemIcon>
                        <ListItemText primary={'Add a Ride'} />
                    </ListItem>
                <ListItem button onClick={this.toggleDrawerRecharge}>
                    <ListItemIcon><CreditCardIcon/></ListItemIcon>
                    <ListItemText primary={'Recharge'} />
                </ListItem>
                <ListItem button onClick={this.toggleDrawerHistory}>
                    <ListItemIcon><HistoryIcon /></ListItemIcon>
                    <ListItemText primary={'History'} />
                </ListItem>
                <ListItem button onClick={this.toggleDrawerLogout}>
                    <ListItemIcon><ExitToAppIcon /></ListItemIcon>
                    <ListItemText primary={'Logout'} />
                </ListItem>
                {/*))}*/}
            </List>

        </div>
    );

    busStopsMenuItems;

    render() {
        let self = this.state;
        let routeList = this.state.RoutIdList;
        return (
            <div>

                <AppBar position="static">
                    <Toolbar variant="dense">
                        <div>
                            <React.Fragment>
                                <Button onClick={this.toggleDrawer('left', true)}><MenuIcon style={{color:'white'}} /></Button>
                                <Drawer anchor={'left'} open={this.state['left']} onClose={this.toggleDrawer('left', false)}>
                                    {this.list('left')}
                                </Drawer>
                            </React.Fragment>
                        </div>
                        <Typography variant="h6" color="inherit">
                            Pay & Go
                        </Typography>
                    </Toolbar>
                </AppBar>


                <div>
                    {(!self.isQrLoaded)?
                        <Paper elevation={3} style={{margin: 10, padding: 10 }}>

                            {(this.state.isExtending)?
                                <div>
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
                                    <FormControl disabled  variant="filled" style={{width:300, marginBottom: 10}}>
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
                                    <p style={{color:'red'}}>{this.state.errorMsg}</p>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={this.extendRide}
                                    >
                                        Update Ride
                                    </Button>
                                </div>

                                :
                                <div>
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
                                    <p style={{color:'red'}}>{this.state.errorMsg}</p>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={this.bookNow}
                                    >
                                        Book Now
                                    </Button>
                                </div>

                            }

                        </Paper>
                        :null}
                </div>



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
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={()=>{
                                    this.setState({
                                        isExtending: true,
                                        isQrLoaded: false
                                    })
                                }}
                                style={{margin: 10}}
                            >
                                Extend The Ride
                            </Button><br/>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={this.cancelRide}
                                    style={{margin: 10}}
                            >
                                Cancel The Ride
                            </Button><br/>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={()=>{this.setState({isQrLoaded: false})}}
                                style={{margin: 10}}
                            >
                                Book Another Ride
                            </Button>
                        </Paper>
                        :null}
                </div>
            </div>
        );
    }
}

export default AddRide;
