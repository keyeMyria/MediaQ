import React, { Component } from 'react';
import { Table, Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import Search from './Search.js'

class Queue extends Component {

    // contact server in this component to grab queue

    constructor(props) {
        super(props)
        
        this.state = {
            searchBoxText: '',
            modal: false,
            video: ''
        };
                
        this.searchModelToggle = this.searchModelToggle.bind(this);
        this.loadVideoCallback = this.loadVideoCallback.bind(this);

    }
    
    searchModelToggle() {
        this.setState({
            modal: !this.state.modal
        });
    }
    
    loadVideoCallback(videoObject) {
        this.setState({
            modal: false,
            video: videoObject
        });
    }
    
    setDisplayName(displayName) {
        this.setState({
            displayName: displayName
        });
    }

    render() {
        return (
            <div>
            <Modal size='lg' isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
                <ModalHeader toggle={this.searchModelToggle}>
                    Add a new song
                </ModalHeader>
                <ModalBody>
                    <Search loadVideoCallback={this.loadVideoCallback}/>
                </ModalBody>
                <ModalFooter>
                    <Button color="secondary" onClick={this.searchModelToggle}>Cancel</Button>
                </ModalFooter>
            </Modal>
            <Table hover>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Play/Pause</th>
                        <th>Title</th>
                        <th>Author/Artist</th>
                        <th>Album</th>
                        <th>Source</th>
                        <Button onClick={this.searchModelToggle} color="primary">+</Button>{' '}
                    </tr>
                </thead>
                <tbody>
                </tbody>
            </Table>
            {this.state.video !== '' && this.state.video}
            </div>
            );
    }

}

export default Queue
