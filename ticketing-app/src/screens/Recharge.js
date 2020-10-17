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

class Recharge extends Component {

    constructor(props, context) {
        super(props, context);

        this.state = {
            left: false,
            amount:'',
            nameOnCard:'',
            cardNumber:'',
            cvv:'',
            expiryMM:'',
            expiryYY:'',
            passengerAvailableBalance:'',
            errorMsg:'',
        };

        this.handleInputChange = this.handleInputChange.bind(this);
    }


    handleInputChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

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
        // this.props.history.push('/recharge');
    };
    toggleDrawerHistory=()=>{
        this.toggleDrawer('left',false);
        // this.props.history.push('/history');
    };
    toggleDrawerLogout=()=>{
        this.toggleDrawer('left',false);
        this.props.history.push('/login');
    };

    recharge=()=>{
        let pid = window.passengersId;
        if(this.state.amount==="" || this.state.nameOnCard==="" || this.state.cardNumber==="" ||this.state.cvv==="" || this.state.expiryMM==="" || this.state.expiryYY===""){
            this.setState({
                errorMsg: '* Please fill all the fields'
            })
        }else{
            this.setState({
                errorMsg: ''
            });
            axios.get('http://localhost:3002/passengers/'+pid)
                .then(res => {
                    this.setState({
                        passengerAvailableBalance: res.data[0].availableAmount
                    });
                }).then(()=>this.RechargePassengerAvailableAmount());
        }
    };

    RechargePassengerAvailableAmount=()=>{
        let newAmount =  Number(this.state.passengerAvailableBalance)+Number(this.state.amount);
        axios.patch('http://localhost:3002/passengers/'+window.passengersId, {
            availableAmount: newAmount
        })
            .then((response) => {
                console.log(response);
                alert("Successfully Recharged");
            }, (error) => {
                console.log(error);
                alert("Error on Recharging");
            });
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

    render() {
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

                <Paper elevation={3} style={{margin: 10, padding: 10 }}>
                    <TextField required
                       id="standard-required"
                       name="amount"
                       label="Payment Amount"
                       value={this.state.amount}
                       onChange={this.handleInputChange}
                       style={{marginBottom: 20}}

                    />
                    <TextField required
                       id="standard-required"
                       name="nameOnCard"
                       label="Name On Card"
                       value={this.state.nameOnCard}
                       onChange={this.handleInputChange}
                       style={{marginBottom: 20}}

                    />
                    <TextField required
                       id="standard-required"
                       name="cardNumber"
                       label="Card Number"
                       value={this.state.cardNumber}
                       onChange={this.handleInputChange}
                       style={{marginBottom: 20}}

                    />
                    <FormHelperText style={{fontSize:16, marginLeft:'20%'}}>Expiry Date*</FormHelperText>
                    <div style={{display:'flex', flexDirection:'row', justifyContent: 'center'}}>

                        <FormControl variant="filled"  style={{width:100, marginBottom: 10, marginRight:5}}>
                            <InputLabel id="demo-simple-select-filled-label">MM</InputLabel>
                            <Select
                                labelId="demo-simple-select-filled-label"
                                id="demo-simple-select-filled"
                                value={this.state.expiryMM}
                                onChange={(e)=>this.setState({
                                    expiryMM: e.target.value
                                })}
                            >
                                <MenuItem value="">
                                    <em>None</em>
                                </MenuItem>

                                {['01','02','03','04','05','06','07','08','09','10','11','12'].map((item,index) => (
                                    <MenuItem key={item} value={item}>{item}</MenuItem>
                                ))}
                            </Select>

                        </FormControl>
                        <FormControl variant="filled"  style={{width:100, marginBottom: 10, marginLeft:5}}>
                            <InputLabel id="demo-simple-select-filled-label">YYYY</InputLabel>
                            <Select
                                labelId="demo-simple-select-filled-label"
                                id="demo-simple-select-filled"
                                value={this.state.expiryYY}
                                onChange={(e)=>this.setState({
                                    expiryYY: e.target.value
                                })}
                            >
                                <MenuItem value="">
                                    <em>None</em>
                                </MenuItem>

                                {['2020','2021','2022','2023','2024','2025','2026','2027'].map((item,index) => (
                                    <MenuItem key={item} value={item}>{item}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </div>
                    <TextField required
                       id="standard-required"
                       name="cvv"
                       label="CVV"
                       value={this.state.cvv}
                       onChange={this.handleInputChange}
                       style={{marginBottom: 20}}

                    /><br/>
                    <p style={{color: 'red'}}>{this.state.errorMsg}</p>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={this.recharge}
                        style={{marginBottom: 20}}
                    >
                        Recharge
                    </Button>
                </Paper>
            </div>
        );
    }
}

export default Recharge;
