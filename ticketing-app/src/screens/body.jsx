import React, {Component} from 'react';
import { Route, Switch, BrowserRouter } from 'react-router-dom';
import Login from "./login";
// import Dashboard from "./dashboard";
import SignUp from "./signUp";
// import JourneyHistory from "./journeyHistory";
// import Feedback from "./feedback";
// import Notification from "./notification";
import Recharge from "./Recharge";
// import TimeTables from "./timeTables";
// import Profile from "./profile";
import AddRide from "./AddRide";

class Body extends Component {
    render() {
        return (
            <div>

                <div className="container mt-3 px-5">
                    <BrowserRouter>
                        <Switch>
                            <Route exact path="/" component={Login} />
                            <Route path="/login" component={Login} />
                            {/*<Route path="/dashboard" component={Dashboard} />*/}
                            <Route path="/sign_up" component={SignUp} />
                            {/*<Route path="/journey_history" component={JourneyHistory} />*/}
                            {/*<Route path="/feedback" component={Feedback} />*/}
                            {/*<Route path="/notification" component={Notification} />*/}
                            <Route path="/recharge" component={Recharge} />
                            {/*<Route path="/time_tables" component={TimeTables} />*/}
                            <Route path="/addride" component={AddRide} />
                        </Switch>
                    </BrowserRouter>


                </div>
            </div>
        );
    }
}

export default Body;
