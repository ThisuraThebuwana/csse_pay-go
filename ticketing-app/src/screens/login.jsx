import React, {Component} from 'react';
import axios from "axios";

class Login extends Component {

    constructor(props) {

        super(props);

        this.state = {
            username: '',
            password: '',
            isLoggedIn: false,
            error: ""
        };

        window.passengersId = 'P0001';
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleInputChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    handleSubmit(e) {

        e.preventDefault();

        const obj = {
            Username: this.state.username,
            Password: this.state.password
        };

        axios.get('http://localhost:3002/passengers/login/'+this.state.username+'/'+this.state.password)
            .then(res => {
                if(res.data.message==='success'){
                    this.setState({
                        isLoggedIn: true,
                        error: ''
                    })
                    window.passengersId = res.data.passengersId;
                    this.props.history.push('/addRide');
                }else if(res.data.message==='fail'){
                    this.setState({
                        isLoggedIn: false,
                    })
                }
            }, err=>{
                this.setState({
                    error: '*Please enter a valid username and password.'
                })
            });


        this.setState({
            email: '',
            password: ''
        })

    }

    render() {

        return (
            <div className="text-center">

                <form className="form-signin px-5" onSubmit={this.handleSubmit}>
                    <img className="mb-4" src="https://aquaproductsinc.com/wp-content/uploads/2019/02/person.png"
                         alt="" width="72" height="72">
                    </img>
                    <h1 className="h3 mb-3 font-weight-normal">Please Login</h1>

                    <label htmlFor="inputusername" className="sr-only">Username</label>
                    <input type="text"
                           id="inputusername"
                           className="form-control mb-2"
                           placeholder="Username (NIC)"
                           onChange={this.handleInputChange}
                           value={this.state.username}
                           name="username"
                           autoFocus>
                    </input>

                    <label htmlFor="inputPassword" className="sr-only">Password</label>
                    <input type="password"
                           id="inputPassword"
                           className="form-control mb-3"
                           placeholder="Password"
                           onChange={this.handleInputChange}
                           value={this.state.password}
                           name="password">
                    </input>
                    <p style={{color: 'red'}}>{this.state.error}</p>
                    <button
                        className="btn btn-lg btn-primary btn-block"
                        type="submit"
                    >Login
                    </button>
                </form>

                <div className="mt-2">
                    <p>Not a registered user?</p>

                    <form action="/sign_up">
                        <button className="btn btn-primary btn-lg" type="submit">Sign Up</button>
                    </form>
                </div>
            </div>
        );
    }
}

export default Login;
