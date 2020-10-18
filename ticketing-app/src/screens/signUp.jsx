import React, {Component} from 'react';
import axios from "axios";

class SignUp extends Component {

     passengerId="";

    constructor(props) {
        super(props);
        this.state = {
            name: '',
            nic: '',
            availableAmount: 1000,
            holdAmount: 0,
            mobileNo: '',
            username: '',
            password: '',
            passengerId:''
        };

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleInputChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    handleSubmit=(e) =>{

        e.preventDefault();

        axios.get('http://localhost:3002/passengers/')
            .then(res => {
                let len = res.data.length;
                console.log(res.data.length);
                console.log(res.data[len-1]);
                let x = res.data[len-1].passengerID.substr(4,1);
                let id = Number(x);
                id++;
                let idStr = "P000"+id;
                console.log(idStr);
                // this.setState({
                //     passengerId: idStr
                // })
                this.passengerId = idStr
            }).then(this.createAPassenger);

    };

    createAPassenger = ()=>{
        //
        // console.log(this.passengerId)
        // console.log(this.state.username)

        axios.post('http://localhost:3002/passengers', {
            passengerID: this.passengerId,
            username: this.state.username,
            password: this.state.password,
            name: this.state.name,
            nic: this.state.nic,
            mobileNo: this.mobileNo,
            availableAmount: this.state.availableAmount,
            holdAmount: this.state.holdAmount
        })
            .then((response) => {
                console.log(response);

                this.setState({
                    name: '',
                    nic: '',
                    availableAmount: '',
                    holdAmount: '',
                    mobileNo: '',
                    username: '',
                    password: ''
                });

                this.props.history.push('/login');
            }, (error) => {
                console.log(error);
            });
    };

    render() {
        return (
            <div>
                <div className="signup-form">
                    <form onSubmit={this.handleSubmit}>
                        <h2>Sign Up</h2>
                        <p>Please fill this form to create an account!</p>
                        <div className="form-group" style={{marginBottom:10}}>
                            <div className="form-group" style={{marginBottom:10}}>
                                <input type="text"
                                       className="form-control"
                                       placeholder="Name"
                                       onChange={this.handleInputChange}
                                       value={this.state.name}
                                       name="name">
                                </input>
                            </div>

                            <div className="form-group" style={{marginBottom:10}}>
                                <input type="text"
                                       className="form-control"
                                       placeholder="NIC"
                                       onChange={this.handleInputChange}
                                       value={this.state.nic}
                                       name="nic">
                                </input>
                            </div>

                            {/*<div className="form-group">*/}
                                {/*<input type="text"*/}
                                       {/*className="form-control"*/}
                                       {/*placeholder="Available Amount"*/}
                                       {/*onChange={this.handleInputChange}*/}
                                       {/*value={this.state.availableAmount}*/}
                                       {/*name="availableAmount">*/}
                                {/*</input>*/}
                            {/*</div>*/}

                            {/*<div className="form-group">*/}
                                {/*<input type="text"*/}
                                       {/*className="form-control"*/}
                                       {/*placeholder="Hold Amount"*/}
                                       {/*onChange={this.handleInputChange}*/}
                                       {/*value={this.state.holdAmount}*/}
                                       {/*name="holdAmount">*/}
                                {/*</input>*/}
                            {/*</div>*/}

                            <div className="form-group" style={{marginBottom:10}}>
                                <input type="text"
                                       className="form-control"
                                       placeholder="Mobile Number"
                                       onChange={this.handleInputChange}
                                       value={this.state.mobileNo}
                                       name="mobileNo">
                                </input>
                            </div>

                            <div className="form-group" style={{marginBottom:10}}>
                                <input type="text"
                                       className="form-control"
                                       placeholder="Username"
                                       onChange={this.handleInputChange}
                                       value={this.state.username}
                                       name="username">
                                </input>
                            </div>

                            <div className="form-group" style={{marginBottom:10}}>
                                <input type="password"
                                       className="form-control"
                                       placeholder="Password"
                                       onChange={this.handleInputChange}
                                       value={this.state.password}
                                       name="password"
                                       autoComplete="off">
                                </input>
                            </div>

                            <div className="form-group" style={{marginBottom:10}}>
                                <input type="password"
                                       className="form-control"
                                       name="confirm_password"
                                       placeholder="Confirm Password"
                                       autoComplete="off">
                                </input>
                            </div>
                        </div>

                        <div className="form-group">
                            <button type="submit" className="btn btn-primary btn-lg">Sign Up</button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

export default SignUp;
