import React, { Component } from 'react';

class Footer extends Component {
    render() {
        return (
            <div id="footer">
                <h6>An Anonymous Rhinos Production</h6>
                <h6>WeTube 2018</h6>
                <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href="https://github.com/AnonymousRhinos/WeTube">
                    <img id="git-logo" src="/images/github-logo.png" alt="logo" />
                </a>
            </div>
        );
    }
}

export default Footer;
