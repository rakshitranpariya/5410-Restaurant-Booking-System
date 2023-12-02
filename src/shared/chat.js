import React, { Component } from 'react';

class KommunicateChat extends Component {
  componentDidMount() {
    const accessToken = localStorage.getItem('accessToken');
    const userType = localStorage.getItem('userType');
    let apiId;
    if(userType == 1) {
        apiId = "2b5873eace4273972e5d3ddbf604693f5";
    } else if(userType == 2){
        apiId = "1c1da9623227878fe3f8ef384f2199ac6";
    }
    if (accessToken) {
      (function (d, m) {
        var kommunicateSettings = {
          appId: apiId,
          popupWidget: true,
          automaticChatOpenOnNavigation: true,
        };

        var s = document.createElement("script");
        s.type = "text/javascript";
        s.async = true;
        s.src = "https://widget.kommunicate.io/v2/kommunicate.app";
        var h = document.getElementsByTagName("head")[0];
        h.appendChild(s);
        window.kommunicate = m;
        m._globals = kommunicateSettings;
      })(document, window.kommunicate || {});
    }
  }

  render() {
    return <div></div>;
  }
}

export default KommunicateChat;
