import React, {Component} from 'react';
import axios from "axios";

class SignUp extends Component {

    constructor(props) {
        super(props);
        this.state = {
            firstname: '',
            lastname: '',
            address: '',
            email: '',
            contactNumber: '',
            username: '',
            password: '',
            qrImageLink: ''
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

        axios.get(`https://api.qrserver.com/v1/create-qr-code/?size=256x256&data=${this.state.username}`,{responseType:'blob'} )
            .then(res => {
                const url = window.URL.createObjectURL(new Blob([res.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'qr.png');

                document.body.appendChild(link);

                console.log(document.body.appendChild(link));

                localStorage.setItem('qr', document.body.appendChild(link).toString());

                link.click();
                }
            );

        const obj = {
            firstName: this.state.firstname,
            lastName: this.state.lastname,
            address: this.state.address,
            email: this.state.email,
            contactNumber: this.state.contactNumber,
            nic: this.state.username,
            password: this.state.password,
            qrImageLink : this.qrImageLink
        };

        axios.post('http://localhost:8080/api/passenger', obj).then(
            res => {

                // localStorage.setItem('token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVkMGU1OGJkYjYwMzA3NDgxZmI1YzVmYyIsInR5cGUiOiJBZG1pbiIsImlhdCI6MTU2MTM2OTk5NX0.J-NYI-x0Awqb1qxYvC4Byjo-cz8fCtyqpU6p7AHJaWs');
                localStorage.setItem('username', res.data.username);
                localStorage.setItem('name', res.data.firstname);
                localStorage.setItem('type', 'Passenger');
                this.props.history.push('/login');
            }
        );

        this.setState({
            firstname: '',
            lastname: '',
            address: '',
            email: '',
            contactNumber: '',
            username: '',
            password: ''
        })
    };

    render() {
        return (
            <div>
                <div className="signup-form">
                    <form onSubmit={this.handleSubmit}>
                        <h2>Sign Up</h2>
                        <p>Please fill this form to create an account!</p>
                        <div className="form-group">
                            <div className="form-group">
                                <input type="text"
                                       className="form-control"
                                       placeholder="First Name"
                                       onChange={this.handleInputChange}
                                       value={this.state.firstname}
                                       name="firstname">
                                </input>
                            </div>

                            <div className="form-group">
                                <input type="text"
                                       className="form-control"
                                       placeholder="Last Name"
                                       onChange={this.handleInputChange}
                                       value={this.state.lastname}
                                       name="lastname">
                                </input>
                            </div>

                            <div className="form-group">
                                <input type="text"
                                       className="form-control"
                                       placeholder="Address"
                                       onChange={this.handleInputChange}
                                       value={this.state.address}
                                       name="address">
                                </input>
                            </div>

                            <div className="form-group">
                                <input type="text"
                                       className="form-control"
                                       placeholder="Email Address"
                                       onChange={this.handleInputChange}
                                       value={this.state.email}
                                       name="email">
                                </input>
                            </div>

                            <div className="form-group">
                                <input type="text"
                                       className="form-control"
                                       placeholder="Contact Number"
                                       onChange={this.handleInputChange}
                                       value={this.state.contactNumber}
                                       name="contactNumber">
                                </input>
                            </div>

                            <div className="form-group">
                                <input type="text"
                                       className="form-control"
                                       placeholder="Username (NIC)"
                                       onChange={this.handleInputChange}
                                       value={this.state.username}
                                       name="username">
                                </input>
                            </div>

                            <div className="form-group">
                                <input type="password"
                                       className="form-control"
                                       placeholder="Password"
                                       onChange={this.handleInputChange}
                                       value={this.state.password}
                                       name="password"
                                       autoComplete="off">
                                </input>
                            </div>

                            <div className="form-group">
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