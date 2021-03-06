import React, { Component } from 'react';
import { Jumbotron, Button, Container } from 'reactstrap';
import LoginScreen from './LoginScreen.js'
import PopupModal from './PopupModal';

class InitialConnect extends Component {
    constructor(props) {
        super(props);
        console.log('initialconnect constructor called')

        this.setDisplayNameCallback = this.props.setDisplayNameCallback;
        this.setQIDCallback = this.props.setQIDCallback;
        this.hideMeCallback = this.props.hideInitialConnectCallback;
        this.socket = props.socket;

        this.state = {
            displayLoginScreen: false,
            createQueue: false,
            joinQueue: false,
            displayQIDModal: false,
            qID: '' //needed to pass to popup modal to show user their QID
        };

        this.socket.on('create', (data) => {
            console.log(data);
            let qID = data['qID'];
            this.setQIDCallback(qID);
            this.setState({
                displayQIDModal: true,
                qID: qID
            });
        });
        this.socket.on('join', (data) => {
            console.log(data);
        });
    }

    createQueue = () => {
        this.setState({
            displayLoginScreen: true,
            createQueue: true,
            joinQueue: false,
        });
    }

    joinQueue = () => {
        this.setState({
            displayLoginScreen: true,
            createQueue: false,
            joinQueue: true,
        });
    }

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
            this.socket.emit('join', {'displayName': displayName, 'qID': qID});
            this.setDisplayNameCallback(displayName);
            this.setQIDCallback(qID);
            this.setState({
                displayLoginScreen: false,
                createQueue: false,
                joinQueue: false,
            });
            this.hideMeCallback();
        } else if (this.state.createQueue) {
            this.socket.emit('create', {'displayName': displayName});
            this.setDisplayNameCallback(displayName);
            this.setState({
                displayLoginScreen: false,
                createQueue: false,
                joinQueue: false,
            });
        }
    }
    
    hideQIDModal = () => {
        this.setState({
            displayQIDModal: false
        });
        this.hideMeCallback();
   }

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
                    userAction={this.state.joinQueue ? 'Join an existing queue' : 'Create a new queue'}
                    hideLoginAndCallParentCallback={this.hideLoginAndCallParentCallback} />
                }
                {this.state.displayQIDModal && 
                <PopupModal modelWantsToCloseCallback={this.hideQIDModal} 
                    title={'Your new Queue ID: ' + this.state.qID} 
                    body={'Give the Queue ID "' + this.state.qID + '" to your friends to join your queue'}/>}
            </div>
            );
    }
}

export default InitialConnect
