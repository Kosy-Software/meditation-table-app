(()=>{"use strict";(()=>{function e(e,t){let s=document.querySelector("#viewing"),i=e.youtubeUrl.split("=")[1];if(console.log(i),null!=e.player&&null!=e.youtubeUrl){e.player.setVideoId(i);let t=e.player.getPlayer();return t.classList.add("overlay"),t}return s.cloneNode(!1)}class t{constructor(e){this.kosyClient=window.parent,this.latestMessageNumber=0,this.kosyApp=e}startApp(){return this.initialInfoPromise=new Promise(((e,t)=>{window.addEventListener("message",(t=>{let s=t.data;switch(s.type){case"receive-initial-info":e(s.payload),this.latestMessageNumber=s.latestMessageNumber;break;case"client-has-joined":this.kosyApp.onClientHasJoined(s.clientInfo);break;case"client-has-left":this.kosyApp.onClientHasLeft(s.clientUuid);break;case"get-app-state":const t=this.kosyApp.onRequestState();this._sendMessageToKosy({type:"receive-app-state",state:t,clientUuids:s.clientUuids,latestMessageNumber:this.latestMessageNumber});break;case"set-app-state":this.kosyApp.onProvideState(s.state),this.latestMessageNumber=s.latestMessageNumber;break;case"receive-message-as-host":this._handleReceiveMessageAsHost(s);break;case"receive-message-as-client":this._handleReceiveMessageAsClient(s)}})),this._sendMessageToKosy({type:"ready-and-listening"})})),this.initialInfoPromise}stopApp(){this._sendMessageToKosy({type:"stop-app"})}relayMessage(e){this._sendMessageToKosy({type:"relay-message-to-host",message:e})}_sendMessageToKosy(e){this.kosyClient.postMessage(e,"*")}_handleReceiveMessageAsClientRecursive(e,t,s){this.latestMessageNumber===e.messageNumber-(t.currentClientUuid===e.sentByClientUuid?0:1)?(this.kosyApp.onReceiveMessageAsClient(e.message),this.latestMessageNumber=e.messageNumber):s<50&&this.latestMessageNumber<e.messageNumber&&setTimeout((()=>this._handleReceiveMessageAsClientRecursive(e,t,s+1)),100)}_handleReceiveMessageAsClient(e){this.initialInfoPromise.then((t=>{this._handleReceiveMessageAsClientRecursive(e,t,0)}))}_handleReceiveMessageAsHost(e){this.initialInfoPromise.then((t=>{const s=this.kosyApp.onReceiveMessageAsHost(e.message);s&&this._sendMessageToKosy({type:"relay-message-to-clients",sentByClientUuid:t.currentClientUuid,message:s,messageNumber:++this.latestMessageNumber})}))}}class s{constructor(e,t,s,i,a){this.dispatch=i,this.isHost=s,this.origin=e,this.player=new YT.Player("viewing",{height:"0px",width:"0px",videoId:t,events:{onReady:()=>this.onPlayerReady()},playerVars:{enablejsapi:1,autoplay:1,origin:this.origin,fs:1,rel:0,modestbranding:1,showinfo:0,autohide:this.isHost?0:1,start:a}})}setVideoId(e){this.videoId=e}setHost(){document.querySelector("#viewing").classList.remove("remove-click")}getPlayer(){let e=this.player.getIframe();return this.isHost||e.classList.add("remove-click"),e}getCurrentState(){return null!=this.player&&this.player.getPlayerState?this.player.getPlayerState():null}loadVideo(){null!=this.videoId&&""!=this.videoId&&(this.player.loadVideoById(this.videoId,0,"large"),this.player.setSize(window.innerWidth,window.innerHeight))}handleStateChange(e,t){if(null!=this.player&&this.player.getPlayerState&&this.player.getPlayerState()!=e)switch(null!=t&&this.player.seekTo(t,!0),e){case YT.PlayerState.PLAYING:case YT.PlayerState.CUED:this.player.playVideo();break;case YT.PlayerState.PAUSED:this.player.pauseVideo();break;case YT.PlayerState.ENDED:}}onPlayerReady(){null!=this.videoId&&(this.loadVideo(),this.player.playVideo(),this.isHost&&(this.interval=window.setInterval((()=>{this.getCurrentStateAndTime()}),500)))}getCurrentStateAndTime(){let e=this.player.getPlayerState(),t=this.player.getCurrentTime();this.dispatch({type:"youtube-video-state-changed",payload:{state:e,time:t}}),e==YT.PlayerState.ENDED&&null!=this.interval&&clearInterval(this.interval)}}var i;!function(i){var a;(function(i){class a{constructor(){this.state={youtubeUrl:"https://www.youtube.com/embed?v=ENYYb5vIMkU",videoState:null},this.kosyApi=new t({onClientHasJoined:e=>this.onClientHasJoined(e),onClientHasLeft:e=>this.onClientHasLeft(e),onReceiveMessageAsClient:e=>this.processMessage(e),onReceiveMessageAsHost:e=>this.processMessageAsHost(e),onRequestState:()=>this.getState(),onProvideState:e=>this.setState(e)})}start(){var e,t,s,i,a;return t=this,s=void 0,a=function*(){let t=yield this.kosyApi.startApp();this.initializer=t.clients[t.initializerClientUuid],this.currentClient=t.clients[t.currentClientUuid],this.state=null!==(e=t.currentAppState)&&void 0!==e?e:this.state,this.isApiReady=!1,this.setupPlayerScript(),this.renderComponent(),window.addEventListener("message",(e=>{this.processComponentMessage(e.data)}))},new((i=void 0)||(i=Promise))((function(e,n){function o(e){try{l(a.next(e))}catch(e){n(e)}}function r(e){try{l(a.throw(e))}catch(e){n(e)}}function l(t){var s;t.done?e(t.value):(s=t.value,s instanceof i?s:new i((function(e){e(s)}))).then(o,r)}l((a=a.apply(t,s||[])).next())}))}setupPlayerScript(){window.onYouTubeIframeAPIReady=()=>{this.onYouTubeIframeAPIReady()};const e=document.createElement("script");e.src="https://www.youtube.com/iframe_api";const t=document.getElementsByTagName("script")[0];t.parentNode.insertBefore(e,t)}onYouTubeIframeAPIReady(){this.isApiReady=!0,this.player=new s(window.origin,"",this.initializer.clientUuid==this.currentClient.clientUuid,(e=>this.processComponentMessage(e)),this.state.time),this.renderComponent()}setState(e){this.state=e,this.renderComponent()}getState(){return this.state}onClientHasJoined(e){}onClientHasLeft(e){e===this.initializer.clientUuid&&(this.state.youtubeUrl?this.kosyApi.relayMessage({type:"assign-new-host"}):this.kosyApi.stopApp())}processMessageAsHost(e){switch(e.type){case"assign-new-host":this.player.setHost(),this.renderComponent();break;default:return e}return null}processMessage(e){switch(e.type){case"close-integration":this.kosyApi.stopApp();break;case"receive-youtube-video-state":this.isApiReady&&(this.state.videoState=e.payload.state,this.state.time=e.payload.time,this.state.videoState==YT.PlayerState.ENDED&&(console.log("Video ended, clearing youtube url"),this.state.videoState=null,this.kosyApi.stopApp()),this.renderComponent())}}processComponentMessage(e){switch(e.type){case"close-integration":this.kosyApi.relayMessage({type:"close-integration"});break;case"youtube-video-state-changed":this.kosyApi.relayMessage({type:"receive-youtube-video-state",payload:e.payload})}}renderComponent(){!function(t,s){var i;let a,n=document.getElementById("root"),o=n.firstChild;if(a=e,null!=t.videoState&&null!=o&&(o.hidden=!1,t.player.handleStateChange(t.videoState,t.time)),(null==t.videoState||null==(null===(i=t.player)||void 0===i?void 0:i.videoId))&&null!=a){var r=n.cloneNode(!1);n.parentNode.replaceChild(r,n),r.appendChild(a(t,s))}}({videoState:this.state.videoState,time:this.state.time,currentClient:this.currentClient,initializer:this.initializer,player:this.player,youtubeUrl:this.state.youtubeUrl},(e=>this.processComponentMessage(e)))}log(...e){var t,s;console.log(`${null!==(s=null===(t=this.currentClient)||void 0===t?void 0:t.clientName)&&void 0!==s?s:"New user"} logged: `,...e)}}i.App=a,(new a).start()})((a=i.Integration||(i.Integration={})).Meditation||(a.Meditation={}))}(i||(i={}))})()})();