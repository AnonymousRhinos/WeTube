import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class CssPlay extends Component {
    render() {
        return (
            <div className="wrapper">
                <h1 className="text-play">
                    <div className="line">
                        <p className="playing">WATCH</p>
                        <p className="playing">SHARE</p>
                    </div>
                    <div className="line">
                        <p className="playing">SHARE</p>
                        <p className="playing">PLAY</p>
                    </div>
                    <div className="line">
                        <p className="playing">PLAY</p>
                        <p className="playing">WATCH</p>
                    </div>
                </h1>
            </div>
        );
    }
}

export default CssPlay;