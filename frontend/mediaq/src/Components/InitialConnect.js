import React, { Component } from 'react';
import { Jumbotron, Button, Container } from 'reactstrap';
import { connect } from 'react-redux';

import LoginScreen from './LoginScreen.js'
import PopupModal from './PopupModal';
import {
    setDisplayName,
    setQID,
    login,
    setQIDPopupDisplayStatus,
    setIncorrectQIDPopupDisplayStatus,
} from "../actions";

class InitialConnect extends Component {
    constructor(props) {
        super(props);

        let displayNameInStorage = localStorage.getItem('displayName');
        let qIDInStorage = localStorage.getItem('qID');
        if (displayNameInStorage !== null && qIDInStorage !== null) {
            this.props.socket.emit('join', {'displayName': displayNameInStorage, 'qID': qIDInStorage});
            this.props.setDisplayName(displayNameInStorage);
            this.props.setQID(qIDInStorage);
        }

        this.state = {
            displayLoginScreen: false,
            createQueue: false,
            joinQueue: false,
        };
    }

    createQueue = () => {
        this.setState({
            displayLoginScreen: true,
            createQueue: true,
            joinQueue: false,
        });
    };

    joinQueue = () => {
        this.setState({
            displayLoginScreen: true,
            createQueue: false,
            joinQueue: true,
        });
    };

    hideLoginAndCallParentCallback = (displayName, qID) => {
        if (displayName === '' && qID === '') { //user clicked cancel
            this.setState({
                displayLoginScreen: false,
                createQueue: false,
                joinQueue: false,
            });
            return;
        }
        if (this.state.joinQueue){
            this.props.socket.emit('join', {'displayName': displayName, 'qID': qID});
            this.props.setDisplayName(displayName);
            this.props.setQID(qID);
            this.setState({
                displayLoginScreen: false,
                createQueue: false,
                joinQueue: false,
            });
        } else if (this.state.createQueue) {
            this.props.socket.emit('create', {'displayName': displayName});
            this.props.setDisplayName(displayName);
            //qID set in socket listeners
            this.setState({
                displayLoginScreen: false,
                createQueue: false,
                joinQueue: false,
            });
        }
    };
    
    hideQIDModal = () => {
        this.props.setQIDPopupDisplayStatus(false);
        this.props.login();
   };

    hideIncorrectQIDModal = () => {
        this.props.setIncorrectQIDPopupDisplayStatus(false);
        this.props.setQID('');
        this.props.setDisplayName('');
    };

    render() {
        return (
            <div>
                <Container>
                    <Jumbotron>
                        <h1 className="display-3 text-center">
                            Please select an option.
                        </h1>
                        <p className="lead text-center">
                            Select Create if you would like to start a MediaQ or select Join if you want to join an already created MediaQ.
                        </p>
                        <hr className="my-2" />
                        {false && 
                        <p>
                            It uses utility classes for typography and spacing to space content out within the larger container.
                        </p>
                        }
                        <Container className="text-center">
                            <Button color="success" 
                                onClick={this.createQueue}>
                                Create a Queue
                            </Button>{' '}
                            <Button color="primary" 
                                onClick={this.joinQueue}>
                                Join a Queue
                            </Button>
                        </Container>
                    </Jumbotron>
                </Container>
                {this.state.displayLoginScreen && 
                <LoginScreen 
                    createQueue={this.state.createQueue}
                    hideLoginAndCallParentCallback={this.hideLoginAndCallParentCallback} />
                }
                {this.props.displayQIDPopup &&
                <PopupModal modelWantsToCloseCallback={this.hideQIDModal}
                            title={'Your new Queue ID: ' + this.props.qID}
                            body={'Your Queue ID is "' + this.props.qID +
                            '" save it and give it to friends to join your queue'}
                />}
                {this.props.displayIncorrectQIDPopup &&
                <PopupModal modelWantsToCloseCallback={this.hideIncorrectQIDModal}
                            title={'Incorrect Queue ID'}
                            body={'The Queue ID you inputted "' + this.props.qID +
                            '" is incorrect, please check that this is the correct Queue ID'}
                />}
            </div>
            );
    }
}

const mapStateToProps = state => {
    return {
        qID : state.qID,
        socket: state.socket,
        displayQIDPopup: state.displayQIDPopup,
        displayIncorrectQIDPopup: state.displayIncorrectQIDPopup
    }
};

const mapDispatchToProps = dispatch => {
    return {
        setQID : qID => dispatch(setQID(qID)),
        setDisplayName: displayName => dispatch(setDisplayName(displayName)),
        login: () => dispatch(login()),
        setQIDPopupDisplayStatus: newDisplayStatus => dispatch(setQIDPopupDisplayStatus(newDisplayStatus)),
        setIncorrectQIDPopupDisplayStatus: newDisplayStatus => dispatch(setIncorrectQIDPopupDisplayStatus(newDisplayStatus))
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(InitialConnect)